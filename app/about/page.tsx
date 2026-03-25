import Link from 'next/link'

export const metadata = {
  title: 'About | The Human Factor',
  description:
    'Learn about The Human Factor — a boutique consulting firm helping organizations navigate AI adoption with human-centered strategies.',
}

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 px-6 bg-navy text-white">
        <div className="max-w-4xl mx-auto">
          <div className="accent-bar mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            The Human Side of AI Transformation
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            We believe the most successful AI implementations start with
            people — understanding their workflows, addressing their concerns,
            and building their capabilities.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="section-pad">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-2xl font-bold text-navy mb-4">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  The Human Factor was founded on a simple observation:
                  organizations invest heavily in AI technology but
                  underinvest in the people who must use it. The result is
                  failed implementations, frustrated teams, and unrealized
                  potential.
                </p>
                <p>
                  We take a different approach. Combining behavioral science
                  with modern organizational development, we help leaders
                  understand their workforce&apos;s readiness for AI and build
                  strategies that bring people along on the journey.
                </p>
                <p>
                  Based in Halifax, Nova Scotia, we work with organizations
                  across Canada — from emergency services to enterprise — helping
                  them find the balance between technological capability and
                  human capacity.
                </p>
              </div>
            </div>

            <div className="bg-navy/5 rounded-2xl p-8">
              <h3 className="text-lg font-bold text-navy mb-6">
                Our Principles
              </h3>
              <div className="space-y-6">
                {[
                  {
                    title: 'People First',
                    desc: 'Technology serves people, not the other way around. Every recommendation starts with the human impact.',
                  },
                  {
                    title: 'Evidence-Based',
                    desc: 'We measure before we prescribe. Our assessments provide data-driven insights, not guesswork.',
                  },
                  {
                    title: 'Practical Results',
                    desc: 'Strategic plans that collect dust help no one. We focus on actionable steps your teams can implement today.',
                  },
                ].map((principle) => (
                  <div key={principle.title}>
                    <h4 className="font-semibold text-navy">
                      {principle.title}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {principle.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise Areas */}
      <section
        className="section-pad"
        style={{ backgroundColor: 'var(--off-white)' }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="accent-bar mb-4" />
          <h2 className="section-title mb-12">Areas of Expertise</h2>

          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                title: 'Organizational AI Readiness',
                desc: 'Comprehensive assessments that evaluate leadership, data maturity, culture, infrastructure, ethics, skills, and strategy.',
              },
              {
                title: 'Change Management for AI',
                desc: 'Frameworks and facilitation for navigating the human side of AI-driven organizational change.',
              },
              {
                title: 'Emergency Services Innovation',
                desc: 'Specialized consulting for fire, EMS, and public safety agencies adopting AI and data-driven decision support.',
              },
              {
                title: 'Workforce Development',
                desc: 'Training programs and skill gap analysis to prepare teams for AI-augmented workflows.',
              },
            ].map((area) => (
              <div key={area.title} className="card">
                <h3 className="font-bold text-navy mb-2">{area.title}</h3>
                <p className="text-sm text-gray-500">{area.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-navy mb-4">
            Curious where your organization stands?
          </h2>
          <p className="text-gray-500 mb-8">
            Take our free AI Readiness Assessment and get a personalized report
            with actionable recommendations.
          </p>
          <Link href="/assessment" className="btn-primary">
            Take the AI Readiness Quiz
          </Link>
        </div>
      </section>
    </>
  )
}
