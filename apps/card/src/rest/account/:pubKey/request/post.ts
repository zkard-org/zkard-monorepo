import { utils, Wallet, Provider, EIP712Signer, types } from "zksync-ethers";

import { DefaultContext, ExtendedRequest } from '@lawallet/module';
import type { Response } from 'express';
import { Debugger } from 'debug';
import * as ethers from "ethers";

import { logger, requiredEnvVar } from '@lawallet/module';

import { retrieveNtag424FromPC, } from '@lib/ntag424';

const log: Debugger = logger.extend('rest:account:pubKey:request:post');
const debug: Debugger = log.extend('debug');

const ACCOUNT_OWNER_PRIVKEY = requiredEnvVar('ACCOUNT_OWNER_PRIVKEY');
const PAYMASTER_ADDRESS = requiredEnvVar('PAYMASTER_ADDRESS');
const PROVIDER_URL = requiredEnvVar('PROVIDER_URL');

async function handler<Context extends DefaultContext>(
  req: ExtendedRequest<Context>,
  res: Response,
) {
  console.dir(req.query);
  console.dir(req.params);
  console.dir(req.body);
  // 1. check query params
  const ntag424Res: { ok: any } | { error: string } =
    await retrieveNtag424FromPC(
      req.context.prisma,
      req.body.p as string | undefined,
      req.body.c as string | undefined,
    );
  if ('error' in ntag424Res) {
    debug('Ntag 424 not found');
    res
      .status(400)
      .json({
        status: 'ERROR',
        reason: 'Failed to retrieve card data --- ' + ntag424Res.error,
      })
      .send();
    return;
  }
  const ntag424 = ntag424Res.ok;

  const provider = new Provider(PROVIDER_URL);
  const balance = await provider.getBalance(ntag424.pubKey, "latest", req.body.token);
  console.dir(balance)


  const amount = ethers.parseUnits(req.body.amount, 6);
  if (balance < amount) {
     res
      .status(400)
      .json({
        status:'ERROR',
        reason:`Not enough funds, asked for ${amount}, have ${balance}`
        });
    return;
  }

  let tx = await provider.getTransferTx({
    token: req.body.token,
    amount,
    from: ntag424.pubKey,
    to: req.body.address, // account that will receive the ETH transfer
  });

  const paymasterParams = utils.getPaymasterParams(PAYMASTER_ADDRESS, {
    type: "General",
    innerInput: new Uint8Array(),
  });
  tx = {
    ...tx,
    chainId: (await provider.getNetwork()).chainId,
    nonce: await provider.getTransactionCount(ntag424.pubKey),
    type: 113,
    customData: {
      gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
      paymasterParams,
    } as types.Eip712Meta,
    value: 0,
    gasPrice: await provider.getGasPrice(),
    gasLimit: BigInt(20000000), // constant 20M since estimateGas() causes an error and this tx consumes more than 15M at most
  };
  const signedTxHash = EIP712Signer.getSignedDigest(tx);

  const owner = new Wallet(ACCOUNT_OWNER_PRIVKEY, provider);
  const signature = ethers.concat([ethers.Signature.from(owner.signingKey.sign(signedTxHash)).serialized]);

  tx.customData = {
    ...tx.customData,
    customSignature: signature,
  };


  console.log("Sending transfer from smart contract account");
  try {
    const sentTx = await provider.broadcastTransaction(types.Transaction.from(tx).serialized);
    await sentTx.wait();
    console.dir(sentTx);
    res.status(200).json({ txId: sentTx.hash }).send();
  } catch (e) {
    res.status(500).json({status: 'ERROR', reason: e.toString()});
  }
}

export default handler;
