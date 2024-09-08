import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Smartphone, Loader2 } from "lucide-react"

interface PayTabProps {
  paymentAmount: string
  setPaymentAmount: (amount: string) => void
  handleNFCPayment: () => Promise<void>
  isProcessing: boolean
  isConnected: boolean
}

export default function PayTab({ 
  paymentAmount, 
  setPaymentAmount, 
  handleNFCPayment, 
  isProcessing, 
  isConnected 
}: PayTabProps) {
  const handlePaymentAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setPaymentAmount(e.target.value);
    }
  };

  return (
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
          onChange={handlePaymentAmountChange}
          aria-label="Amount to pay in USDC"
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
  )
}