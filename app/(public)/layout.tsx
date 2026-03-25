import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="site-grid">
      <Header />
      <main className="min-h-screen relative z-10">{children}</main>
      <Footer />
    </div>
  )
}
