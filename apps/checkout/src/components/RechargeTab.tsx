import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowUpCircle, Loader2 } from "lucide-react"

interface RechargeTabProps {
  rechargeAmount: string
  setRechargeAmount: (amount: string) => void
  //handleRecharge: 
  isProcessing: boolean
  isConnected: boolean
}

export default function RechargeTab({ 
  rechargeAmount, 
  setRechargeAmount, 
  //handleRecharge, 
  isProcessing, 
  isConnected 
}: RechargeTabProps) {
  const handleRechargeAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setRechargeAmount(e.target.value);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="rechargeAmount" className="text-[#ffffff]">Amount to Recharge (USDC)</Label>
        <Input 
          id="rechargeAmount" 
          type="number" 
          placeholder="Enter amount" 
          className="bg-[#010f3b] text-white border-[#2d78b9]"
          value={rechargeAmount}
          onChange={handleRechargeAmountChange}
          aria-label="Amount to recharge in USDC"
        />
      </div>
      <Button 
        className="w-full bg-[#2d78b9] text-white hover:bg-[#2d78b9]/80" 
        //onClick={handleRecharge} 
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
  )
}