"use client"

import { useContext } from "react"
import { Smartphone, Wallet, ArrowUpCircle, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CardContext } from "@/contexts/CardContext"

export function ConnectWallet() {
  const { handleConnectWallet, isProcessing } = useContext(CardContext)
  return (
    <Button 
      className="w-full mb-4 bg-[#2d78b9] text-white hover:bg-[#2d78b9]/80" 
      onClick={handleConnectWallet} 
      disabled={isProcessing}
    >
      {isProcessing ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </>
      )}
    </Button>
  )
}

export function WarningAlert() {
  return (
    <Alert variant="destructive" className="mb-4 bg-red-600 text-white border-red-700">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Warning</AlertTitle>
      <AlertDescription>
        Please connect your wallet before performing any transactions.
      </AlertDescription>
    </Alert>
  )
}

export function ConnectedAlert() {
  return (
    <Alert variant="default" className="mb-4 bg-[#2d78b9] text-white border-[#2d78b9]">
      <Wallet className="h-4 w-4" />
      <AlertTitle>Wallet Connected</AlertTitle>
      <AlertDescription>
        Your wallet is connected and ready for transactions.
      </AlertDescription>
    </Alert>
  )
}

export function CardTabs() {
  const { balance, handlePayment, handleRecharge, isProcessing, isConnected } = useContext(CardContext)
  
  return (
    <Tabs defaultValue="balance" className="w-full">
      <TabsList className="grid w-full grid-cols-3 bg-[#010f3b]">
        <TabsTrigger value="balance" className="text-white data-[state=active]:bg-[#2d78b9]">Balance</TabsTrigger>
        <TabsTrigger value="pay" className="text-white data-[state=active]:bg-[#2d78b9]">Pay</TabsTrigger>
        <TabsTrigger value="recharge" className="text-white data-[state=active]:bg-[#2d78b9]">Recharge</TabsTrigger>
      </TabsList>
      <TabsContent value="balance">
        <div className="text-center">
          <h3 className="text-2xl font-bold mt-4 text-[#2d78b9]">Current Balance</h3>
          <p className="text-4xl font-bold text-[#ffffff] mt-2">${balance.toFixed(2)} USDC</p>
        </div>
      </TabsContent>
      <TabsContent value="pay">
        <div className="space-y-4">
          <div className="text-center">
            <Smartphone className="h-16 w-16 mx-auto text-[#2d78b9]" />
            <p className="mt-2 text-[#ffffff]">Tap your NFC card to pay</p>
          </div>
          <Button 
            className="w-full bg-[#2d78b9] text-white hover:bg-[#2d78b9]/80" 
            onClick={handlePayment} 
            disabled={isProcessing || balance < 10 || !isConnected}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Pay $10 USDC"
            )}
          </Button>
        </div>
      </TabsContent>
      <TabsContent value="recharge">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-[#ffffff]">Amount to Recharge (USDC)</Label>
            <Input id="amount" type="number" placeholder="Enter amount" className="bg-[#010f3b] text-white border-[#2d78b9]" />
          </div>
          <Button 
            className="w-full bg-[#2d78b9] text-white hover:bg-[#2d78b9]/80" 
            onClick={() => handleRecharge(20)} 
            disabled={isProcessing || !isConnected}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <ArrowUpCircle className="mr-2 h-4 w-4" />
                Recharge $20 USDC
              </>
            )}
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  )
}