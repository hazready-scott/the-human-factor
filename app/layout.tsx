import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'The Human Factor — AI Strategy for Organizations That Can\'t Afford to Get It Wrong',
  description:
    'Evidence-based AI advisory for emergency services and high-stakes organizations. The ARIA Method helps you implement AI that works for the people who use it.',
  openGraph: {
    title: 'The Human Factor — AI Strategy for Organizations That Can\'t Afford to Get It Wrong',
    description:
      'Evidence-based AI advisory for emergency services and high-stakes organizations. The ARIA Method helps you implement AI that works for the people who use it.',
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
      <body className={inter.className}>{children}</body>
    </html>
  )
}
