import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/providers'
import { Toaster } from '@/components/ui/toaster'
import { Navigation } from '@/components/layout/navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AstroSuite Pro - Professional Astrology Software',
  description: 'Comprehensive astrology platform supporting Vedic, Western, and KP systems with advanced calculations and beautiful charts.',
  keywords: 'astrology, vedic astrology, western astrology, KP astrology, birth chart, horoscope, panchang, dasha',
  authors: [{ name: 'AstroSuite Pro Team' }],
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    title: 'AstroSuite Pro - Professional Astrology Software',
    description: 'Create accurate astrological charts with advanced calculations',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-background text-foreground">
            <Navigation />
            <main className="flex-1">
              {children}
            </main>
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}