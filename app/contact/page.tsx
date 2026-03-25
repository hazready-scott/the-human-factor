export const metadata = {
  title: 'Contact | The Human Factor',
  description:
    'Get in touch with The Human Factor for AI readiness consulting, organizational assessments, and change management.',
}

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 px-6 bg-navy text-white">
        <div className="max-w-4xl mx-auto">
          <div className="accent-bar mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Get in Touch</h1>
          <p className="text-lg text-gray-300 max-w-2xl">
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
              <h2 className="text-2xl font-bold text-navy mb-6">
                Let&apos;s Start a Conversation
              </h2>
              <div className="space-y-6 text-gray-600">
                <p>
                  Whether you&apos;re just beginning to think about AI or
                  you&apos;re ready to transform your operations, we can help
                  you find the right path forward.
                </p>

                <div>
                  <h3 className="font-semibold text-navy mb-2">Email</h3>
                  <a
                    href="mailto:scott@thehumanfactor.ca"
                    className="text-warmth hover:text-warmth-dark transition-colors"
                  >
                    scott@thehumanfactor.ca
                  </a>
                </div>

                <div>
                  <h3 className="font-semibold text-navy mb-2">Location</h3>
                  <p>Halifax, Nova Scotia, Canada</p>
                </div>

                <div>
                  <h3 className="font-semibold text-navy mb-2">
                    What to Expect
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-warmth mt-0.5">&#10003;</span>
                      Response within 24 hours
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-warmth mt-0.5">&#10003;</span>
                      Free initial consultation
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-warmth mt-0.5">&#10003;</span>
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
                    className="block text-sm font-medium text-navy mb-1"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-warmth focus:ring-1 focus:ring-warmth transition-colors"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-navy mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-warmth focus:ring-1 focus:ring-warmth transition-colors"
                    placeholder="you@organization.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="organization"
                    className="block text-sm font-medium text-navy mb-1"
                  >
                    Organization
                  </label>
                  <input
                    type="text"
                    id="organization"
                    name="organization"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-warmth focus:ring-1 focus:ring-warmth transition-colors"
                    placeholder="Your organization (optional)"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-navy mb-1"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-warmth focus:ring-1 focus:ring-warmth transition-colors resize-none"
                    placeholder="How can we help?"
                  />
                </div>

                <button type="submit" className="btn-primary w-full">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
