import Link from 'next/link'

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center bg-hero-gradient text-white overflow-hidden">
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-brand-teal/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-brand-purple/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="accent-bar mx-auto mb-8" />
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            AI That Fits How{' '}
            <span className="text-brand-teal">People Actually Work</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10">
            Most AI implementations fail because they ignore the human element.
            We start with your people, your processes, and your reality — then
            design AI systems that make work better.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/assessment" className="btn-primary text-lg px-8 py-4">
              Take the AI Readiness Quiz
            </Link>
            <Link
              href="/about"
              className="btn-secondary text-lg px-8 py-4 border-white/30 text-white hover:bg-white hover:text-brand-primary"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="section-pad bg-brand-cool-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="eyebrow">What We Do</p>
            <h2 className="section-title">
              From Assessment to Implementation
            </h2>
            <p className="section-subtitle mx-auto">
              We bridge the gap between emerging AI capabilities and the humans
              who use them — from initial readiness assessment through workflow
              design to custom-built AI tools.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'AI Readiness Assessment',
                description:
                  "Evaluate your organization's preparedness for AI across leadership, data, culture, infrastructure, people, and governance. Know where you stand before you invest.",
                icon: '📊',
              },
              {
                title: 'Workflow Design & AI Fitting',
                description:
                  "We map your actual workflows, identify where AI adds real value, and select or build the right tools. This is not about buying the most expensive platform — it is about fitting the right solution to your work.",
                icon: '⚙️',
              },
              {
                title: 'Custom AI Systems',
                description:
                  'Purpose-built AI tools using modern open-source and cloud infrastructure. Custom solutions at a fraction of what traditional consultancies charge, designed around how your team actually operates.',
                icon: '🔧',
              },
            ].map((service) => (
              <div key={service.title} className="card text-center">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--color-primary)' }}>
                  {service.title}
                </h3>
                <p className="text-slate-500">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Design & Custom AI */}
      <section className="section-pad">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <p className="eyebrow">Beyond Assessment</p>
              <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: 'var(--color-primary)' }}>
                Workflow Design & AI Integration
              </h2>
              <div className="space-y-4 text-slate-600">
                <p>
                  Assessment is where we start, not where we stop. After we
                  understand your organization&apos;s readiness, we design
                  optimized workflows and select or build the right AI tools.
                </p>
                <p>
                  Too many organizations buy AI platforms and then try to
                  reshape their work around the tool. We do the opposite: we
                  understand how your people work, identify where AI creates
                  genuine value, and fit the technology to the workflow.
                </p>
                <p>
                  The result is AI that people actually use — because it was
                  designed around their reality, not despite it.
                </p>
              </div>
            </div>

            <div>
              <p className="eyebrow">Competitive Pricing</p>
              <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: 'var(--color-primary)' }}>
                Custom AI at Prices That Make Sense
              </h2>
              <div className="space-y-4 text-slate-600">
                <p>
                  Many organizations assume custom AI means enterprise pricing.
                  That assumption keeps them stuck with generic tools that do
                  not fit their work.
                </p>
                <p>
                  We design and build purpose-built AI tools using modern
                  open-source models and cloud infrastructure. This means
                  custom solutions — trained on your data, designed for your
                  workflows — at a fraction of what traditional consultancies
                  charge.
                </p>
                <p>
                  No vendor lock-in. No six-figure platform licenses. Just
                  AI that works for your organization.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Research Partners */}
      <section className="section-pad bg-hero-gradient text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="eyebrow" style={{ color: '#06b6d4' }}>Our Research Partners</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Academic Rigor, Real-World Results
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Our agency associates and partners are drawn from leading
              Canadian research institutions, bringing peer-reviewed
              methodology to practical implementation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-8">
              <h3 className="text-xl font-bold text-brand-teal mb-2">
                University of Waterloo
              </h3>
              <p className="text-sm text-slate-400 mb-4">
                Faculty of Engineering — Systems Design Engineering
              </p>
              <p className="text-slate-300 text-sm leading-relaxed">
                Research expertise in cognitive systems engineering, work
                system analysis, and human-AI interaction. The Human Factors
                and Ergonomics program at UWaterloo provides the theoretical
                foundation for understanding how people interact with complex
                systems — and how to design AI that supports rather than
                disrupts expert decision-making.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-8">
              <h3 className="text-xl font-bold text-brand-purple-light mb-2">
                Western University
              </h3>
              <p className="text-sm text-slate-400 mb-4">
                Faculty of Science — Computer Science Department
              </p>
              <p className="text-slate-300 text-sm leading-relaxed">
                Deep expertise in computer science, artificial intelligence,
                machine learning, and digital security. Our partnership with
                Western&apos;s CS department ensures our AI implementations
                are built on sound technical foundations with proper
                attention to security, privacy, and system architecture.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ARIA Method */}
      <section className="section-pad bg-brand-cool-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="eyebrow">Our Methodology</p>
            <h2 className="section-title">The ARIA Method</h2>
            <p className="section-subtitle mx-auto">
              AI Readiness & Implementation Approach — grounded in Human
              Factors Engineering and evidence-based change management.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                step: 'Orient',
                desc: 'Understand your organization, your people, and your current reality before prescribing anything.',
              },
              {
                step: 'Assess',
                desc: 'Evaluate readiness across six dimensions using frameworks from cognitive systems engineering and organizational research.',
              },
              {
                step: 'Design',
                desc: 'Map optimized workflows and select or build AI tools that fit how your team actually works.',
              },
              {
                step: 'Implement',
                desc: 'Deploy with structured change management, training, and continuous feedback loops to ensure adoption sticks.',
              },
            ].map((item) => (
              <div key={item.step} className="card card-accent">
                <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--color-primary)' }}>
                  {item.step}
                </h3>
                <p className="text-sm text-slate-500">{item.desc}</p>
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
            Our free assessment evaluates your organization across 6 key
            dimensions. It takes about 5 minutes and you get a personalized
            report with actionable recommendations.
          </p>
          <Link href="/assessment" className="btn-primary text-lg px-8 py-4">
            Start the Free Assessment
          </Link>
        </div>
      </section>
    </>
  )
}
