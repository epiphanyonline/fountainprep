import './globals.css'
import type { Metadata, Viewport } from 'next'
import Navbar from './components/Navbar'
import { Analytics } from '@vercel/analytics/next'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.fountainprep.com'),

  title: {
    default: 'Fountain Prep',
    template: '%s | Fountain Prep',
  },

  description:
    'Premium online tutoring with structured curriculum pathways and progress tracking.',

  applicationName: 'Fountain Prep',

  manifest: '/manifest.json',

  keywords: [
    'online tutoring',
    'private tutoring',
    'maths tutor',
    'english tutor',
    'science tutor',
    'yoruba lessons',
    'children learning',
    'home education',
    'fountain prep',
  ],

  authors: [
    {
      name: 'Fountain Prep',
    },
  ],

  creator: 'Fountain Prep',

  appleWebApp: {
    capable: true,
    title: 'Fountain Prep',
    statusBarStyle: 'default',
  },

  icons: {
    icon: [
      {
        url: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        url: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],

    apple: [
      {
        url: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],

    shortcut: ['/icons/icon-192.png'],
  },

  openGraph: {
    title: 'Fountain Prep',
    description:
      'Premium online tutoring with structured curriculum pathways and progress tracking.',
    siteName: 'Fountain Prep',
    type: 'website',
    locale: 'en_GB',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Fountain Prep',
    description:
      'Premium online tutoring with structured curriculum pathways and progress tracking.',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#7c3aed',
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
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="default"
        />

        <link
          rel="apple-touch-icon"
          href="/apple-touch-icon.png"
        />
      </head>

      <body>
  <Navbar />
  {children}
  <Analytics />
</body>
    </html>
  )
}