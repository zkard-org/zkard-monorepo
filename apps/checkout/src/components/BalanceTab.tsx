import React from 'react'

interface BalanceTabProps {
  balance: string
  address: string | null
}

export default function BalanceTab({ balance, address }: BalanceTabProps) {
  return (
    <div className="text-center">
      <h3 className="text-2xl font-bold mt-4 text-[#2d78b9]">Current Balance</h3>
      <p className="text-4xl font-bold text-[#ffffff] mt-2">${parseFloat(balance).toFixed(2)} USDC</p>
      {address && <p className="mt-2 text-sm">Address: {address}</p>}
    </div>
  )
}