"use client"

import { useContext } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ConnectWallet, WarningAlert, ConnectedAlert, CardTabs } from "@/components/CardComponents"
import { CardContext } from "@/contexts/CardContext"

export default function NFCCard() {
  const { isConnected, showWarning } = useContext(CardContext)

  return (
    <Card className="w-full max-w-md bg-[#03015b] text-white border-[#2d78b9]">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-[#2d78b9]">NFC USDC Card</CardTitle>
        <CardDescription className="text-[#ffffff]">Pay and recharge with USDC on zkSync</CardDescription>
      </CardHeader>
      <CardContent>
        {!isConnected && <ConnectWallet />}
        {showWarning && <WarningAlert />}
        {isConnected && <ConnectedAlert />}
        <CardTabs />
      </CardContent>
      <CardFooter className="text-sm text-[#ffffff]">
        Powered by zkSync for fast and low-cost transactions
      </CardFooter>
    </Card>
  )
}