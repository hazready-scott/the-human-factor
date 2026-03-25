import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'The Human Factor | System Improvement & AI Integration',
  description:
    'System improvement, quality improvement, and AI integration grounded in Human Factors and Systems Design Engineering. We help organizations build better systems and safer outcomes.',
  openGraph: {
    title: 'The Human Factor | System Improvement & AI Integration',
    description:
      'System improvement, quality improvement, and AI integration grounded in Human Factors and Systems Design Engineering.',
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
