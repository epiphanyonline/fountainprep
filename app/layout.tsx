import './globals.css'
import type { Metadata, Viewport } from 'next'
import Navbar from './components/Navbar'

export const metadata: Metadata = {
  title: {
    default: 'Fountain Prep',
    template: '%s | Fountain Prep',
  },
  description:
    'Premium online tutoring with structured curriculum pathways and progress tracking.',
  applicationName: 'Fountain Prep',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'Fountain Prep',
    statusBarStyle: 'default',
  },
  icons: {
    icon: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' }],
  },
}

export const viewport: Viewport = {
  themeColor: '#7c3aed',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Fountain Prep" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>

      <body>
        <Navbar />
        {children}
      </body>
    </html>
  )
}