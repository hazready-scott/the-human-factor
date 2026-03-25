import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ backgroundColor: 'var(--color-primary)' }} className="text-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-lg font-bold mb-1">The Human Factor</h3>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-1 mb-3">System Improvement & AI Integration</p>
            <p className="text-slate-400 text-sm leading-relaxed">
              Improving how complex organizations work — through human factors science,
              quality improvement methodology, and thoughtfully integrated AI.
              Based in Waterloo, Ontario. Serving organizations across North America.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">Navigation</h4>
            <nav className="space-y-2">
              {[
                { href: '/about', label: 'About' },
                { href: '/resources', label: 'Resources' },
                { href: '/assessment', label: 'AI Readiness Quiz' },
                { href: '/contact', label: 'Contact' },
              ].map(link => (
                <Link key={link.href} href={link.href} className="block text-sm text-slate-300 hover:text-[#06b6d4] transition-colors">{link.label}</Link>
              ))}
              <a href="https://www.linkedin.com/company/the-human-factor-consulting/" target="_blank" rel="noopener noreferrer" className="block text-sm text-slate-300 hover:text-[#06b6d4] transition-colors">LinkedIn</a>
            </nav>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">Get in Touch</h4>
            <a href="mailto:info@thehumanfactor.ca" className="text-sm text-slate-300 hover:text-[#06b6d4] transition-colors">info@thehumanfactor.ca</a>
            <p className="text-sm text-slate-400 mt-2">Waterloo, Ontario, Canada</p>
          </div>
        </div>
        <div className="border-t border-white/10 mt-12 pt-8 text-center">
          <p className="text-sm text-slate-500">&copy; {new Date().getFullYear()} The Human Factor. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
