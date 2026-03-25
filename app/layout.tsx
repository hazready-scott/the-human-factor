import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'The Human Factor | AI Implementation Consulting',
  description:
    'AI implementation consulting grounded in Human Factors and Systems Design Engineering. We help organizations implement AI that fits how people actually work.',
  openGraph: {
    title: 'The Human Factor | AI Implementation Consulting',
    description:
      'AI implementation consulting grounded in Human Factors and Systems Design Engineering.',
    url: 'https://thehumanfactor.ca',
    siteName: 'The Human Factor',
    locale: 'en_CA',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
