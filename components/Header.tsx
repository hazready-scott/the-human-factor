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
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-[72px]">
        <Link href="/" className="text-xl font-bold text-navy">
          The Human Factor
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/about"
            className="text-sm font-medium text-gray-600 hover:text-navy transition-colors"
          >
            About
          </Link>
          <Link
            href="/assessment"
            className="text-sm font-medium text-gray-600 hover:text-navy transition-colors"
          >
            AI Readiness Quiz
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-gray-600 hover:text-navy transition-colors"
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
            className="w-6 h-6 text-navy"
            fill="none"
            stroke="currentColor"
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
        <nav className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-3">
          <Link
            href="/about"
            className="block text-sm font-medium text-gray-600"
            onClick={() => setMenuOpen(false)}
          >
            About
          </Link>
          <Link
            href="/assessment"
            className="block text-sm font-medium text-gray-600"
            onClick={() => setMenuOpen(false)}
          >
            AI Readiness Quiz
          </Link>
          <Link
            href="/contact"
            className="block text-sm font-medium text-gray-600"
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
