"use client"

import { useContext, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ConnectWallet, WarningAlert, ConnectedAlert } from "@/components/CardComponents"
import { CardContext } from "@/contexts/CardContext"
import { NFCContext } from "@/contexts/NFCContext"
import OfflineAlert from './OfflineAlerts'
import UpdateAlert from './UpdateAlert'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Smartphone, ArrowUpCircle, Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

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
  const { isAvailable, isEnabled, requestPermission, subscribe } = useContext(NFCContext)
  const [nfcError, setNfcError] = useState<string | null>(null)

  const handleNFCPayment = async () => {
    setNfcError(null)
    if (!isAvailable) {
      setNfcError("NFC is not supported on this device.")
      return
    }

    if (!isEnabled) {
      const permissionGranted = await requestPermission()
      if (!permissionGranted) {
        setNfcError("NFC permission was not granted. Please enable NFC in your device settings.")
        return
      }
    }

    try {
      const { p, c } = await subscribe()
      await handlePayment(p, c)
    } catch (error) {
      console.error(error)
      setNfcError("Error reading NFC tag. Please try again.")
    }
  }

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
            <div className="text-center">
              <h3 className="text-2xl font-bold mt-4 text-[#2d78b9]">Current Balance</h3>
              <p className="text-4xl font-bold text-[#ffffff] mt-2">${parseFloat(balance).toFixed(2)} USDC</p>
              {address && <p className="mt-2 text-sm">Address: {address}</p>}
            </div>
          </TabsContent>
          <TabsContent value="pay">
            <div className="space-y-4">
              <div className="text-center">
                <Smartphone className="h-16 w-16 mx-auto text-[#2d78b9]" />
                <p className="mt-2 text-[#ffffff]">Enter amount and tap your NFC card to pay</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="payAmount" className="text-[#ffffff]">Amount to Pay (USDC)</Label>
                <Input 
                  id="payAmount" 
                  type="number" 
                  placeholder="Enter amount" 
                  className="bg-[#010f3b] text-white border-[#2d78b9]"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                />
              </div>
              <Button 
                className="w-full bg-[#2d78b9] text-white hover:bg-[#2d78b9]/80" 
                onClick={handleNFCPayment} 
                disabled={isProcessing || !isConnected || !paymentAmount}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay ${paymentAmount ? `$${paymentAmount}` : ''} USDC`
                )}
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="recharge">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rechargeAmount" className="text-[#ffffff]">Amount to Recharge (USDC)</Label>
                <Input 
                  id="rechargeAmount" 
                  type="number" 
                  placeholder="Enter amount" 
                  className="bg-[#010f3b] text-white border-[#2d78b9]"
                  value={rechargeAmount}
                  onChange={(e) => setRechargeAmount(e.target.value)}
                />
              </div>
              <Button 
                className="w-full bg-[#2d78b9] text-white hover:bg-[#2d78b9]/80" 
                onClick={handleRecharge} 
                disabled={isProcessing || !isConnected || !rechargeAmount}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ArrowUpCircle className="mr-2 h-4 w-4" />
                    {`Recharge ${rechargeAmount ? `$${rechargeAmount}` : ''} USDC`}
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="text-sm text-[#ffffff]">
        Powered by zkSync for fast and low-cost transactions
      </CardFooter>
    </Card>
  )
}