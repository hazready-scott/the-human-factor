import Link from 'next/link'

export const metadata = {
  title: 'Contact | The Human Factor',
  description:
    'Get in touch with The Human Factor for AI readiness consulting, workflow design, and custom AI systems. Based in Waterloo, Ontario.',
}

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 px-6 bg-hero-gradient text-white">
        <div className="max-w-4xl mx-auto">
          <div className="accent-bar mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Get in Touch</h1>
          <p className="text-lg text-slate-300 max-w-2xl">
            Ready to explore how AI can work for your organization? We&apos;d
            love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="section-pad">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Info */}
            <div>
              <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-primary)' }}>
                Let&apos;s Start a Conversation
              </h2>
              <div className="space-y-6 text-slate-600">
                <p>
                  Whether you&apos;re just beginning to think about AI or
                  you&apos;re ready to transform your operations, we can help
                  you find the right path forward.
                </p>

                <div>
                  <h3 className="font-semibold mb-2" style={{ color: 'var(--color-primary)' }}>
                    Email
                  </h3>
                  <a
                    href="mailto:info@thehumanfactor.ca"
                    className="text-brand-teal hover:text-brand-teal-dark transition-colors"
                  >
                    info@thehumanfactor.ca
                  </a>
                </div>

                <div>
                  <h3 className="font-semibold mb-2" style={{ color: 'var(--color-primary)' }}>
                    Location
                  </h3>
                  <p>Waterloo, Ontario, Canada</p>
                  <p className="text-sm text-slate-400">
                    Serving organizations across North America
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2" style={{ color: 'var(--color-primary)' }}>
                    Connect
                  </h3>
                  <a
                    href="https://www.linkedin.com/company/the-human-factor-consulting/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-teal hover:text-brand-teal-dark transition-colors text-sm"
                  >
                    LinkedIn &rarr;
                  </a>
                </div>

                <div>
                  <h3 className="font-semibold mb-2" style={{ color: 'var(--color-primary)' }}>
                    What to Expect
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-brand-teal mt-0.5">&#10003;</span>
                      Response within 24 hours
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-teal mt-0.5">&#10003;</span>
                      Free initial consultation
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-teal mt-0.5">&#10003;</span>
                      No-obligation assessment review
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="card">
              <form
                action="https://formspree.io/f/placeholder"
                method="POST"
                className="space-y-5"
              >
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-1"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-brand-light-gray focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-colors"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-1"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-brand-light-gray focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-colors"
                    placeholder="you@organization.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="organization"
                    className="block text-sm font-medium mb-1"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    Organization
                  </label>
                  <input
                    type="text"
                    id="organization"
                    name="organization"
                    className="w-full px-4 py-3 rounded-lg border border-brand-light-gray focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-colors"
                    placeholder="Your organization (optional)"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium mb-1"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-brand-light-gray focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-colors resize-none"
                    placeholder="How can we help?"
                  />
                </div>

                <button type="submit" className="btn-primary w-full">
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* Alternative CTAs */}
          <div className="grid md:grid-cols-2 gap-6 mt-16">
            <div className="card text-center">
              <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--color-primary)' }}>
                Book a Free Consultation
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                30-minute call to discuss your organization&apos;s AI readiness
                and potential next steps.
              </p>
              <a
                href="mailto:info@thehumanfactor.ca?subject=Free%20Consultation%20Request"
                className="btn-primary text-sm"
              >
                Request a Call
              </a>
            </div>

            <div className="card text-center">
              <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--color-primary)' }}>
                Take the Assessment First
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                Not ready to talk yet? Start with our free AI Readiness Quiz
                and see where your organization stands.
              </p>
              <Link href="/assessment" className="btn-primary text-sm">
                Start the Quiz
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
