import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import StarField from '@/components/layout/StarField'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'AYA (آية) - Islamic Knowledge Graph',
  description: 'Explore authentic connections between Quran verses and hadiths through beautiful 3D visualization',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  themeColor: '#0a0e1a',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'AYA'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <StarField />
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  )
}
