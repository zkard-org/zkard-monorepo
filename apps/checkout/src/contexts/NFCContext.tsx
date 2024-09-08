"use client"

import React, { createContext, useCallback, useEffect, useState } from 'react'

export interface NFCContext {
  isAvailable: boolean
  isEnabled: boolean
  subscribe: () => Promise<{ pubkey: string, p: string, c: string }>
  unsubscribe: () => Promise<void>
  requestPermission: () => Promise<boolean>
}

export const NFCContext = createContext<NFCContext>({
  isAvailable: false,
  isEnabled: false,
  subscribe: () => {
    throw new Error('Function not implemented.')
  },
  unsubscribe: () => {
    throw new Error('Function not implemented.')
  },
  requestPermission: () => {
    throw new Error('Function not implemented.')
  }
})

const injectFunctionsToWindow = () => {
  if (typeof window !== 'undefined' && window.Android?.isNFCAvailable?.()) {
    window.injectedNFC = {
      handleRead: (data: { pubkey: string, p: string, c: string }) => {
        if (!window.injectedNFC.resolveFn) {
          console.warn('No callback function found')
          return
        }
        window.injectedNFC.resolveFn(data)
        clearFunctions()
      },
      handleError: (reason: any) => {
        if (!window.injectedNFC.rejectFn) {
          console.warn('No callback function found')
          return
        }
        window.injectedNFC.rejectFn(reason)
        clearFunctions()
      }
    }
    return true
  }
  return false
}

const clearFunctions = () => {
  window.injectedNFC.resolveFn = undefined
  window.injectedNFC.rejectFn = undefined
}

export const NFCProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAvailable, setIsAvailable] = useState(false)
  const [isEnabled, setIsEnabled] = useState(false)

  useEffect(() => {
    setIsAvailable(injectFunctionsToWindow())
  }, [])

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isAvailable) return false

    try {
      // If using injected NFC, you might need to call a method on window.Android here
      // For web NFC:
      if ('NDEFReader' in window) {
        const ndef = new (window as any).NDEFReader()
        await ndef.scan()
        setIsEnabled(true)
        return true
      }
      return false
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
      if (window.injectedNFC) {
        window.injectedNFC.resolveFn = resolve
        window.injectedNFC.rejectFn = reject
        // You might need to call a method on window.Android here to start reading
      } else if ('NDEFReader' in window) {
        const ndef = new (window as any).NDEFReader()
        ndef.addEventListener("reading", ({ message, serialNumber }: any) => {
          const pubkey = serialNumber
          const p = message.records[0]?.data
          const c = message.records[1]?.data
          resolve({ pubkey, p, c })
        })
        ndef.addEventListener("error", (error: any) => {
          reject(error)
        })
        ndef.scan().catch(reject)
      } else {
        reject(new Error('NFC is not available'))
      }
    })
  }, [isEnabled])

  const unsubscribe = useCallback(async () => {
    if (window.injectedNFC) {
      window.injectedNFC.handleError('User unsubscribed from NFC')
    }
    // For web NFC, you might need to abort the scan here
  }, [])

  return (
    <NFCContext.Provider value={{ isAvailable, isEnabled, subscribe, unsubscribe, requestPermission }}>
      {children}
    </NFCContext.Provider>
  )
}