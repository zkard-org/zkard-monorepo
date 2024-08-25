"use client"

import React, { createContext, useCallback, useEffect, useState } from 'react'

export interface NFCContext {
  isAvailable: boolean
  isEnabled: boolean
  subscribe: () => Promise<{ pubkey: string, p: string, c: string }>
  unsubscribe: () => Promise<void>
  requestPermission: () => Promise<boolean>
}

export const NFCContext = createContext<NFCContext>({} as NFCContext)

export const NFCProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAvailable, setIsAvailable] = useState(false)
  const [isEnabled, setIsEnabled] = useState(false)

  useEffect(() => {
    setIsAvailable('NDEFReader' in window)
  }, [])

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isAvailable) return false

    try {
      const ndef = new (window as any).NDEFReader()
      await ndef.scan()
      setIsEnabled(true)
      return true
    } catch (error) {
      console.error('Error requesting NFC permission:', error)
      setIsEnabled(false)
      return false
    }
  }, [isAvailable])

  const subscribe = useCallback(async (): Promise<{ pubkey: string, p: string, c: string }> => {
    if (!isEnabled) {
      throw new Error('NFC is not enabled')
    }

    return new Promise((resolve, reject) => {
      const ndef = new (window as any).NDEFReader()
      ndef.addEventListener("reading", ({ message, serialNumber }: any) => {
        // This is a simplified example. In reality, you'd need to parse the NFC data correctly
        const pubkey = serialNumber
        const p = message.records[0]?.data
        const c = message.records[1]?.data
        resolve({ pubkey, p, c })
      })
      ndef.addEventListener("error", (error: any) => {
        reject(error)
      })
    })
  }, [isEnabled])

  const unsubscribe = useCallback(async () => {
    // Implementation depends on how you're managing the NDEFReader
  }, [])

  return (
    <NFCContext.Provider value={{ isAvailable, isEnabled, subscribe, unsubscribe, requestPermission }}>
      {children}
    </NFCContext.Provider>
  )
}