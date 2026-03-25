import Link from 'next/link'

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center bg-navy text-white overflow-hidden">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-dark to-navy opacity-90" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-warmth/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="accent-bar mx-auto mb-8" />
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Optimizing the Intersection of{' '}
            <span className="text-warmth">People & Technology</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            We help organizations navigate AI adoption with human-centered
            strategies. Data-driven consulting for the human element of your
            business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/assessment" className="btn-primary text-lg px-8 py-4">
              Take the AI Readiness Quiz
            </Link>
            <Link
              href="/about"
              className="btn-secondary text-lg px-8 py-4 border-white/30 text-white hover:bg-white hover:text-navy"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="section-pad bg-off-white" style={{ backgroundColor: 'var(--off-white)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="accent-bar mx-auto mb-4" />
            <h2 className="section-title">What We Do</h2>
            <p className="section-subtitle mx-auto">
              We bridge the gap between emerging AI capabilities and the humans
              who use them.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'AI Readiness Assessment',
                description:
                  'Evaluate your organization\'s preparedness for AI integration across leadership, data, culture, and infrastructure.',
                icon: '📊',
              },
              {
                title: 'Change Management',
                description:
                  'Guide your teams through AI adoption with proven frameworks that reduce resistance and accelerate capability building.',
                icon: '🔄',
              },
              {
                title: 'Strategic Consulting',
                description:
                  'Develop AI implementation roadmaps that align technology investments with organizational goals and workforce development.',
                icon: '🎯',
              },
            ].map((service) => (
              <div key={service.title} className="card text-center">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-navy mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-500">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-pad bg-navy text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '15+', label: 'Years Experience' },
              { value: '40%', label: 'Avg. Efficiency Gain' },
              { value: '200+', label: 'Organizations Assessed' },
              { value: '95%', label: 'Client Satisfaction' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl md:text-5xl font-bold text-warmth mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad">
        <div className="max-w-3xl mx-auto text-center">
          <div className="accent-bar mx-auto mb-4" />
          <h2 className="section-title">Ready to Assess Your AI Readiness?</h2>
          <p className="section-subtitle mx-auto mb-8">
            Our free 21-question assessment evaluates your organization across 7
            key dimensions. Get instant results with actionable insights.
          </p>
          <Link href="/assessment" className="btn-primary text-lg px-8 py-4">
            Start the Free Assessment
          </Link>
        </div>
      </section>
    </>
  )
}
