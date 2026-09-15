import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'
import { PWAInstallPrompt } from '@/components/pwa-install-prompt'
import './globals.css'

const geistSans = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#6366f1',
}

export const metadata: Metadata = {
  title: {
    default: 'ImmoLeads — CRM Immobilier',
    template: '%s | ImmoLeads',
  },
  description:
    'CRM immobilier pour les agences au Maroc. Gérez vos leads, visites et suivis en un seul endroit.',
  keywords: ['immobilier', 'CRM', 'Maroc', 'leads', 'agence immobilière'],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'ImmoLeads',
  },
  icons: {
    icon: [
      { url: '/images/logo/favicon.png', type: 'image/png' },
    ],
    shortcut: '/images/logo/favicon.png',
    apple: '/images/logo/favicon.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col antialiased" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <PWAInstallPrompt />
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              duration: 4000,
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
