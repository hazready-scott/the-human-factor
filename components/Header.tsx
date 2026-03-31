'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

const navItems = [
  { label: 'About', href: '/#about' },
  { label: 'ARIA Method', href: '/#aria' },
  { label: 'Services', href: '/#services' },
  { label: 'Specialties', href: '/#specialties' },
  { label: 'HazReady', href: '/#hazready' },
  { label: 'Team', href: '/#team' },
  { label: 'Resources', href: '/resources' },
  { label: 'Contact', href: '/#contact' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'backdrop-blur-xl shadow-lg' : 'bg-transparent'}`}
      style={scrolled ? { background: 'rgba(26, 39, 68, 0.9)', borderBottom: '1px solid rgba(255,255,255,0.06)' } : {}}>
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-[72px]">
        <Link href="/" className="flex flex-col">
          <span className="text-xl font-bold text-white">The Human Factor</span>
          <span className="text-[10px] uppercase tracking-widest text-slate-500">Systems Improvement Specialists</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6">
          {navItems.map(link => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-slate-400 hover:text-white transition-colors">{link.label}</Link>
          ))}
          <Link href="#contact" className="btn-primary text-sm">Free AI Readiness Scorecard</Link>
        </nav>

        <button className="lg:hidden p-2" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <svg className="w-6 h-6" fill="none" stroke="white" viewBox="0 0 24 24">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <nav className="lg:hidden px-6 py-4 space-y-3" style={{ background: 'rgba(26,39,68,0.95)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {navItems.map(link => (
            <Link key={link.href} href={link.href} className="block text-sm font-medium text-slate-300" onClick={() => setMenuOpen(false)}>{link.label}</Link>
          ))}
          <Link href="#contact" className="btn-primary text-sm w-full text-center" onClick={() => setMenuOpen(false)}>Free AI Readiness Scorecard</Link>
        </nav>
      )}
    </header>
  )
}
