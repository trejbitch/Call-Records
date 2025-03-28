src/app/layout.tsx





import type { Metadata } from 'next'
import { Montserrat, Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Toaster } from "sonner"

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
})

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'TrainedByAI Platform',
  description: 'Comprehensive AI-powered training and management platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${montserrat.variable} ${inter.variable} bg-white light`} suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ background: 'white', margin: 0, padding: 0 }} className={`font-sans bg-white min-h-screen antialiased ${inter.variable} p-0 m-0`}>
  <Providers>
    <div style={{ background: 'white', margin: 0, padding: 0 }} className="min-h-screen bg-white w-full p-0 m-0">
      {children}
    </div>
    <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: '#18181B',
                color: '#fff',
                border: 'none',
              },
              duration: 2000,
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
