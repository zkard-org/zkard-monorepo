"use client"

import { useState, useEffect } from 'react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { WifiOff } from "lucide-react"

export default function OfflineAlert() {
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    function onlineHandler() {
      setIsOffline(false)
    }

    function offlineHandler() {
      setIsOffline(true)
    }

    window.addEventListener('online', onlineHandler)
    window.addEventListener('offline', offlineHandler)

    return () => {
      window.removeEventListener('online', onlineHandler)
      window.removeEventListener('offline', offlineHandler)
    }
  }, [])

  if (!isOffline) return null

  return (
    <Alert variant="destructive" className="mb-4 bg-red-600 text-white border-red-700">
      <WifiOff className="h-4 w-4" />
      <AlertTitle>Offline</AlertTitle>
      <AlertDescription>
        You are currently offline. Some features may be limited.
      </AlertDescription>
    </Alert>
  )
}