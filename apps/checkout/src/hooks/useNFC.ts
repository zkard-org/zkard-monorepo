import { useContext } from 'react'
import { NFCContext } from '@/contexts/NFCContext'

export default function useNFC(handlePayment: (pubkey: string, p: string, c: string) => Promise<void>) {
  const { isAvailable, isEnabled, subscribe, unsubscribe, requestPermission } = useContext(NFCContext)

  const handleNFCPayment = async () => {
    if (!isAvailable) {
      throw new Error("NFC is not supported on this device.")
    }

    if (!isEnabled) {
      const permissionGranted = await requestPermission()
      if (!permissionGranted) {
        throw new Error("NFC permission was not granted. Please enable NFC in your device settings.")
      }
    }

    try {
      const { pubkey, p, c } = await subscribe()
      await handlePayment(pubkey, p, c)
    } catch (error) {
      console.error(error)
      throw new Error("Error reading NFC tag. Please try again.")
    } finally {
      await unsubscribe()
    }
  }

  return { handleNFCPayment, isAvailable, isEnabled }
}