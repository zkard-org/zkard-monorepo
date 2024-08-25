import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Wallet, Loader2, AlertCircle } from "lucide-react"

export function ConnectWallet({ onClick, isProcessing }: { onClick: () => void, isProcessing: boolean }) {
  return (
    <Button 
      className="w-full mb-4 bg-[#2d78b9] text-white hover:bg-[#2d78b9]/80" 
      onClick={onClick} 
      disabled={isProcessing}
    >
      {isProcessing ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </>
      )}
    </Button>
  )
}

export function WarningAlert() {
  return (
    <Alert variant="destructive" className="mb-4 bg-red-600 text-white border-red-700">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Warning</AlertTitle>
      <AlertDescription>
        Please connect your wallet before performing any transactions.
      </AlertDescription>
    </Alert>
  )
}

export function ConnectedAlert() {
  return (
    <Alert variant="default" className="mb-4 bg-[#2d78b9] text-white border-[#2d78b9]">
      <Wallet className="h-4 w-4" />
      <AlertTitle>Wallet Connected</AlertTitle>
      <AlertDescription>
        Your wallet is connected and ready for transactions.
      </AlertDescription>
    </Alert>
  )
}