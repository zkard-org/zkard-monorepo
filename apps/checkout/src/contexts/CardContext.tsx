"use client"

import React, { createContext, useState, useCallback, useEffect } from "react"
import { ethers } from 'ethers'

interface CardContextType {
  balance: string
  isConnected: boolean
  isProcessing: boolean
  showWarning: boolean
  paymentAmount: string
  rechargeAmount: string
  address: string | null
  handleConnectWallet: () => Promise<void>
  handleDisconnectWallet: () => void
  handlePayment: (p: string, c: string) => Promise<void>
  handleRecharge: () => void
  setShowWarning: (show: boolean) => void
  setPaymentAmount: (amount: string) => void
  setRechargeAmount: (amount: string) => void
}

export const CardContext = createContext<CardContextType>({} as CardContextType)

export const CardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [balance, setBalance] = useState<string>('0')
  const [isConnected, setIsConnected] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showWarning, setShowWarning] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState("")
  const [rechargeAmount, setRechargeAmount] = useState("")
  const [address, setAddress] = useState<string | null>(null)
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)

  const handleConnectWallet = useCallback(async () => {
    setIsProcessing(true)
    try {
      // Request account access
      await (window as any).ethereum.request({ method: 'eth_requestAccounts' })
      const web3Provider = new ethers.BrowserProvider((window as any).ethereum)
      setProvider(web3Provider)
      const signer = await web3Provider.getSigner()
      const address = await signer.getAddress()
      setAddress(address)
      setIsConnected(true)
      setShowWarning(false)

      // Fetch balance from zkSync explorer
      const response = await fetch(`https://zksync2-testnet.zkscan.io/api?module=account&action=balance&address=${address}`)
      const data = await response.json()
      if (data.status === '1') {
        setBalance(ethers.formatEther(data.result))
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      setShowWarning(true)
    } finally {
      setIsProcessing(false)
    }
  }, [])

  const handleDisconnectWallet = useCallback(() => {
    setIsConnected(false)
    setAddress(null)
    setBalance('0')
    setProvider(null)
  }, [])

  const handlePayment = useCallback(async (p: string, c: string) => {
    if (!isConnected || !address) {
      setShowWarning(true)
      return
    }
    const amount = parseFloat(paymentAmount)
    if (isNaN(amount) || amount <= 0 || parseFloat(balance) < amount) {
      alert("Invalid payment amount or insufficient balance")
      return
    }
    setIsProcessing(true)
    try {
      const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'User-Agent': 'insomnia/8.5.1'},
        body: JSON.stringify({
          p,
          c,
          chain: "zksync_testnet",
          amount: ethers.parseUnits(paymentAmount, 6).toString(), // Assuming USDC has 6 decimals
          token: "USDC"
        })
      };
      const response = await fetch(`https://api.cashnt.org/account/${address}/request`, options)
      const result = await response.json()
      if (result.success) {
        setBalance(prevBalance => (parseFloat(prevBalance) - amount).toString())
        alert("Payment successful!")
      } else {
        throw new Error(result.error || "Payment failed")
      }
    } catch (error) {
      console.error(error)
      alert("Payment failed. Please try again.")
    } finally {
      setIsProcessing(false)
      setPaymentAmount("")
    }
  }, [isConnected, address, paymentAmount, balance])

  const handleRecharge = useCallback(() => {
    // todo: Implement recharge logic 
  }, [])

  useEffect(() => {
    // Check if wallet is already connected
    if ((window as any).ethereum) {
      (window as any).ethereum.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            handleConnectWallet()
          }
        })
    }
  }, [handleConnectWallet])

  return (
    <CardContext.Provider value={{
      balance,
      isConnected,
      isProcessing,
      showWarning,
      paymentAmount,
      rechargeAmount,
      address,
      handleConnectWallet,
      handleDisconnectWallet,
      handlePayment,
      handleRecharge,
      setShowWarning,
      setPaymentAmount,
      setRechargeAmount
    }}>
      {children}
    </CardContext.Provider>
  )
}