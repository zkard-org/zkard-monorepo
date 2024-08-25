# Rechargeable ZKard

This repo contains both the card emissor and the frontend code for the checkout.

This is the technology that enables ZKard's vision: fast, permissionless and
anonymous payments.

Each ntag424 card is uncloneable and the emissor can verify it signature.
Each card is associated with a Abstract Account and can be "recharged"
The emissor is the owner of these accounts and can pay from them when verified
by the card signature
The gas is paid by a General Paymaster that keeps a list of addresses it pays to
(the addresses associated with the cards)

The end result is a transparent experience for the end user: Tap to pay, fast
and secure
