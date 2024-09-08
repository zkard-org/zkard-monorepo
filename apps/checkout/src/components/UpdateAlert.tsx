"use client"

import { useState, useEffect } from 'react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { RefreshCw } from "lucide-react"

export default function UpdateAlert() {
  const [showUpdateAlert, setShowUpdateAlert] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setShowUpdateAlert(true)
              }
            })
          }
        })
      })
    }
  }, [])

  const handleUpdate = () => {
    setShowUpdateAlert(false)
    window.location.reload()
  }

  if (!showUpdateAlert) return null

  return (
    <Alert variant="default" className="mb-4 bg-blue-600 text-white border-blue-700">
      <RefreshCw className="h-4 w-4" />
      <AlertTitle>Update Available</AlertTitle>
      <AlertDescription>
        A new version of the app is available. 
        <button onClick={handleUpdate} className="ml-2 underline">
          Refresh to update
        </button>
      </AlertDescription>
    </Alert>
  )
}