import Link from 'next/link'
import ContactForm from '@/components/ContactForm'

export const metadata = {
  title: 'Contact | The Human Factor',
  description: 'Get in touch with The Human Factor for system improvement, AI integration, and quality improvement. Based in Waterloo, Ontario.',
}

export default function ContactPage() {
  return (
    <>
      <section className="pt-32 pb-16 px-6 bg-hero-gradient text-white">
        <div className="max-w-4xl mx-auto">
          <div className="accent-bar mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Get in Touch</h1>
          <p className="text-lg text-slate-300 max-w-2xl">
            Ready to explore how better systems and smarter AI integration can
            work for your organization? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-primary)' }}>
                Let&apos;s Start a Conversation
              </h2>
              <div className="space-y-6 text-slate-600">
                <p>
                  Whether you&apos;re looking to improve your systems, integrate
                  AI thoughtfully, or build better workflows — we can help you
                  find the right path forward.
                </p>
                <div>
                  <h3 className="font-semibold mb-2" style={{ color: 'var(--color-primary)' }}>Email</h3>
                  <a href="mailto:info@thehumanfactor.ca" className="text-brand-teal hover:text-brand-teal-dark transition-colors">info@thehumanfactor.ca</a>
                </div>
                <div>
                  <h3 className="font-semibold mb-2" style={{ color: 'var(--color-primary)' }}>Location</h3>
                  <p>Waterloo, Ontario, Canada</p>
                  <p className="text-sm text-slate-400">Serving organizations across North America</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2" style={{ color: 'var(--color-primary)' }}>Connect</h3>
                  <a href="https://www.linkedin.com/company/the-human-factor-consulting/" target="_blank" rel="noopener noreferrer" className="text-brand-teal hover:text-brand-teal-dark transition-colors text-sm">LinkedIn &rarr;</a>
                </div>
                <div>
                  <h3 className="font-semibold mb-2" style={{ color: 'var(--color-primary)' }}>What to Expect</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2"><span className="text-brand-teal mt-0.5">&#10003;</span>Response within 24 hours</li>
                    <li className="flex items-start gap-2"><span className="text-brand-teal mt-0.5">&#10003;</span>Free initial conversation</li>
                    <li className="flex items-start gap-2"><span className="text-brand-teal mt-0.5">&#10003;</span>No-obligation assessment review</li>
                  </ul>
                </div>
              </div>
            </div>
            <ContactForm />
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-16">
            <div className="card text-center">
              <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--color-primary)' }}>Book a Free Conversation</h3>
              <p className="text-sm text-slate-500 mb-4">30-minute call to discuss your organization&apos;s needs and potential next steps.</p>
              <a href="mailto:info@thehumanfactor.ca?subject=Free%20Conversation%20Request" className="btn-primary text-sm">Request a Call</a>
            </div>
            <div className="card text-center">
              <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--color-primary)' }}>Take the Assessment First</h3>
              <p className="text-sm text-slate-500 mb-4">Not ready to talk yet? Start with our free AI Readiness Quiz.</p>
              <Link href="/assessment" className="btn-primary text-sm">Start the Quiz</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
