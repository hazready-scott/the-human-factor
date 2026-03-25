import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ backgroundColor: 'var(--color-primary)' }} className="text-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold mb-1">The Human Factor</h3>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-3">
              AI Implementation Consulting
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              Helping organizations implement AI that fits how people actually
              work. Based in Waterloo, Ontario. Serving organizations across
              North America.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">
              Navigation
            </h4>
            <nav className="space-y-2">
              <Link
                href="/about"
                className="block text-sm text-slate-300 hover:text-brand-teal transition-colors"
              >
                About Us
              </Link>
              <Link
                href="/assessment"
                className="block text-sm text-slate-300 hover:text-brand-teal transition-colors"
              >
                AI Readiness Quiz
              </Link>
              <Link
                href="/contact"
                className="block text-sm text-slate-300 hover:text-brand-teal transition-colors"
              >
                Contact
              </Link>
              <a
                href="https://www.linkedin.com/company/the-human-factor-consulting/"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-slate-300 hover:text-brand-teal transition-colors"
              >
                LinkedIn
              </a>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">
              Get in Touch
            </h4>
            <a
              href="mailto:info@thehumanfactor.ca"
              className="text-sm text-slate-300 hover:text-brand-teal transition-colors"
            >
              info@thehumanfactor.ca
            </a>
            <p className="text-sm text-slate-400 mt-2">Waterloo, Ontario, Canada</p>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} The Human Factor. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
