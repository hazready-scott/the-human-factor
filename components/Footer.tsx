import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold mb-3">The Human Factor</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Helping organizations navigate AI adoption with human-centered
              strategies. Based in Halifax, Nova Scotia.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
              Navigation
            </h4>
            <nav className="space-y-2">
              <Link
                href="/about"
                className="block text-sm text-gray-300 hover:text-warmth transition-colors"
              >
                About Us
              </Link>
              <Link
                href="/assessment"
                className="block text-sm text-gray-300 hover:text-warmth transition-colors"
              >
                AI Readiness Quiz
              </Link>
              <Link
                href="/contact"
                className="block text-sm text-gray-300 hover:text-warmth transition-colors"
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
              Get in Touch
            </h4>
            <p className="text-sm text-gray-300">scott@thehumanfactor.ca</p>
            <p className="text-sm text-gray-300 mt-1">Halifax, Nova Scotia</p>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} The Human Factor. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
