import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TheraBrake Academy - Professional CE Credits & Personal Growth',
  description: 'Texas-approved continuing education for mental health professionals. Cut & paste course builder, automated CE certificates, and premium learning programs.',
  keywords: 'CE credits, Texas LPC, mental health education, continuing education, therapy courses',
  openGraph: {
    title: 'TheraBrake Academy',
    description: 'Professional CE Credits & Personal Growth for Mental Health Professionals',
    images: ['/images/logo/logo.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow bg-background-light">
            {children}
          </main>
          <Footer />
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#F97316',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  )
}
