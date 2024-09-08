interface Window {
    Android?: {
      isNFCAvailable: () => boolean
      // Otros métodos que pueda tener Android
    }
    injectedNFC?: {
      handleRead: (data: { pubkey: string, p: string, c: string }) => void
      handleError: (reason: any) => void
      resolveFn?: (value: { pubkey: string, p: string, c: string }) => void
      rejectFn?: (reason: any) => void
    }
  }