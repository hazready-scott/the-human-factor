'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-[72px]">
        <Link href="/" className="flex flex-col">
          <span className="text-xl font-bold" style={{ color: scrolled ? 'var(--color-primary)' : 'white' }}>
            The Human Factor
          </span>
          <span className="text-[10px] uppercase tracking-widest" style={{ color: scrolled ? 'var(--color-text-muted)' : 'rgba(255,255,255,0.6)' }}>
            AI Implementation Consulting
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/about"
            className={`text-sm font-medium transition-colors ${
              scrolled ? 'text-slate-600 hover:text-slate-900' : 'text-white/80 hover:text-white'
            }`}
          >
            About
          </Link>
          <Link
            href="/assessment"
            className={`text-sm font-medium transition-colors ${
              scrolled ? 'text-slate-600 hover:text-slate-900' : 'text-white/80 hover:text-white'
            }`}
          >
            AI Readiness Quiz
          </Link>
          <Link
            href="/contact"
            className={`text-sm font-medium transition-colors ${
              scrolled ? 'text-slate-600 hover:text-slate-900' : 'text-white/80 hover:text-white'
            }`}
          >
            Contact
          </Link>
          <Link href="/assessment" className="btn-primary text-sm">
            Take the Quiz
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke={scrolled ? '#0f172a' : 'white'}
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="md:hidden bg-white border-t border-slate-100 px-6 py-4 space-y-3">
          <Link
            href="/about"
            className="block text-sm font-medium text-slate-600"
            onClick={() => setMenuOpen(false)}
          >
            About
          </Link>
          <Link
            href="/assessment"
            className="block text-sm font-medium text-slate-600"
            onClick={() => setMenuOpen(false)}
          >
            AI Readiness Quiz
          </Link>
          <Link
            href="/contact"
            className="block text-sm font-medium text-slate-600"
            onClick={() => setMenuOpen(false)}
          >
            Contact
          </Link>
          <Link
            href="/assessment"
            className="btn-primary text-sm w-full text-center"
            onClick={() => setMenuOpen(false)}
          >
            Take the Quiz
          </Link>
        </nav>
      )}
    </header>
  )
}
