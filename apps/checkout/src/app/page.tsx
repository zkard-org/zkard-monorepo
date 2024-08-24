import NFCCard from "@/components/NFCCard"
import { CardProvider } from "@/contexts/CardContext"

export default function Home() {
  return (
    <div className="bg-[#010f3b] p-6 min-h-screen flex items-center justify-center">
      <CardProvider>
        <NFCCard />
      </CardProvider>
    </div>
  )
}