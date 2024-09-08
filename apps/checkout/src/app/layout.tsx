import './globals.css'
import type { Metadata } from 'next'
import { CardProvider } from '@/contexts/CardContext'
import { NFCProvider } from '@/contexts/NFCContext'

export const metadata: Metadata = {
  title: 'NFC USDC Card App',
  description: 'Pay and recharge with USDC on zkSync',
  manifest: '/manifest.json',
  themeColor: '#010f3b',
  viewport: 'minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <NFCProvider>
          <CardProvider>
            {children}
          </CardProvider>
        </NFCProvider>
      </body>
    </html>
  )
}