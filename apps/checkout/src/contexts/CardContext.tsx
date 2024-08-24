"use client"

import React, { createContext, useState, useCallback } from "react"

interface CardContextType {
  balance: number
  isConnected: boolean
  isProcessing: boolean
  showWarning: boolean
  handleConnectWallet: () => void
  handlePayment: () => void
  handleRecharge: (amount: number) => void
  setShowWarning: (show: boolean) => void
}

export const CardContext = createContext<CardContextType>({} as CardContextType)

export const CardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [balance, setBalance] = useState(50)
  const [isConnected, setIsConnected] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showWarning, setShowWarning] = useState(false)

  const handleConnectWallet = useCallback(() => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsConnected(true)
      setIsProcessing(false)
      setShowWarning(false)
    }, 2000)
  }, [])

  const handlePayment = useCallback(() => {
    if (!isConnected) {
      setShowWarning(true)
      return
    }
    setIsProcessing(true)
    setTimeout(() => {
      setBalance(prevBalance => Math.max(0, prevBalance - 10))
      setIsProcessing(false)
    }, 2000)
  }, [isConnected])

  const handleRecharge = useCallback((amount: number) => {
    if (!isConnected) {
      setShowWarning(true)
      return
    }
    setIsProcessing(true)
    setTimeout(() => {
      setBalance(prevBalance => prevBalance + amount)
      setIsProcessing(false)
    }, 2000)
  }, [isConnected])

  return (
    <CardContext.Provider value={{
      balance,
      isConnected,
      isProcessing,
      showWarning,
      handleConnectWallet,
      handlePayment,
      handleRecharge,
      setShowWarning
    }}>
      {children}
    </CardContext.Provider>
  )
}