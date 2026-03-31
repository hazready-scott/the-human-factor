import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="relative z-10 text-white" style={{ background: 'rgba(0,0,0,0.3)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-lg font-bold mb-1">The Human Factor</h3>
            <p className="text-[10px] uppercase tracking-widest text-slate-600 mt-1 mb-3">Systems Improvement Specialists</p>
            <p className="text-slate-500 text-sm leading-relaxed">
              Applied science. Better systems. AI strategy grounded in how people actually work.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-600 mb-4">Navigation</h4>
            <nav className="space-y-2">
              {[
                { href: '/#about', label: 'About' },
                { href: '/#aria', label: 'ARIA Method' },
                { href: '/#services', label: 'Services' },
                { href: '/resources', label: 'Resources' },
                { href: '/#contact', label: 'Contact' },
              ].map(link => (
                <Link key={link.href} href={link.href} className="block text-sm text-slate-400 hover:text-[#c9944a] transition-colors">{link.label}</Link>
              ))}
              <a href="https://www.linkedin.com/in/sdramey/" target="_blank" rel="noopener noreferrer" className="block text-sm text-slate-400 hover:text-[#c9944a] transition-colors">LinkedIn</a>
            </nav>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-600 mb-4">Get in Touch</h4>
            <a href="mailto:info@thehumanfactor.ca" className="text-sm text-slate-400 hover:text-[#c9944a] transition-colors">info@thehumanfactor.ca</a>
            <p className="text-sm text-slate-500 mt-2">Hamilton, Ontario, Canada</p>
          </div>
        </div>
        <div className="border-t border-white/5 mt-12 pt-8 flex justify-between items-center">
          <p className="text-sm text-slate-600">&copy; 2026 HazReady Corporation. All rights reserved.</p>
          <Link href="/admin/login" className="text-xs text-slate-700 hover:text-slate-500 transition-colors">Staff</Link>
        </div>
      </div>
    </footer>
  )
}
