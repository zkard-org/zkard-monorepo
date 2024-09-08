"use client"

import { useContext } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ConnectWallet, WarningAlert, ConnectedAlert } from "@/components/CardComponents"
import { CardContext } from "@/contexts/CardContext"
import OfflineAlert from './OfflineAlerts'
import UpdateAlert from './UpdateAlert'
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import BalanceTab from "./BalanceTab"
import PayTab from "./PayTab"
import RechargeTab from "./RechargeTab"
import useNFC from "../hooks/useNFC"

export default function NFCCard() {
  const { 
    balance, 
    isConnected, 
    showWarning, 
    isProcessing, 
    paymentAmount,
    rechargeAmount,
    address,
    handleConnectWallet,
    handleDisconnectWallet,
    handlePayment,
    handleRecharge,
    setPaymentAmount,
    setRechargeAmount
  } = useContext(CardContext)

  const { handleNFCPayment, nfcError } = useNFC(handlePayment)

  return (
    <Card className="w-full max-w-md bg-[#03015b] text-white border-[#2d78b9]">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-[#2d78b9]">NFC USDC Card</CardTitle>
        <CardDescription className="text-[#ffffff]">Pay and recharge with USDC on zkSync</CardDescription>
      </CardHeader>
      <CardContent>
        <OfflineAlert />
        <UpdateAlert />
        {!isConnected ? (
          <ConnectWallet onClick={handleConnectWallet} isProcessing={isProcessing} />
        ) : (
          <Button 
            className="w-full mb-4 bg-[#2d78b9] text-white hover:bg-[#2d78b9]/80" 
            onClick={handleDisconnectWallet}
          >
            Disconnect Wallet
          </Button>
        )}
        {showWarning && <WarningAlert />}
        {isConnected && <ConnectedAlert />}
        {nfcError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>NFC Error</AlertTitle>
            <AlertDescription>{nfcError}</AlertDescription>
          </Alert>
        )}
        
        <Tabs defaultValue="balance" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-[#010f3b]">
            <TabsTrigger value="balance" className="text-white data-[state=active]:bg-[#2d78b9]">Balance</TabsTrigger>
            <TabsTrigger value="pay" className="text-white data-[state=active]:bg-[#2d78b9]">Pay</TabsTrigger>
            <TabsTrigger value="recharge" className="text-white data-[state=active]:bg-[#2d78b9]">Recharge</TabsTrigger>
          </TabsList>
          <TabsContent value="balance">
            <BalanceTab balance={balance} address={address} />
          </TabsContent>
          <TabsContent value="pay">
            <PayTab 
              paymentAmount={paymentAmount}
              setPaymentAmount={setPaymentAmount}
              handleNFCPayment={handleNFCPayment}
              isProcessing={isProcessing}
              isConnected={isConnected}
            />
          </TabsContent>
          <TabsContent value="recharge">
            <RechargeTab 
              rechargeAmount={rechargeAmount}
              setRechargeAmount={setRechargeAmount}
              //handleRecharge={handleRecharge}
              isProcessing={isProcessing}
              isConnected={isConnected}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="text-sm text-[#ffffff]">
        Powered by zkSync for fast and low-cost transactions
      </CardFooter>
    </Card>
  )
}