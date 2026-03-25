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
            Better Systems.{' '}
            <span className="text-brand-teal">Safer Outcomes.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10">
            We improve how complex organizations work — from healthcare quality
            and patient safety to emergency services and beyond. Human factors
            science, quality improvement methodology, and AI that keeps humans
            in the loop.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/assessment" className="btn-primary text-lg px-8 py-4">
              Take the AI Readiness Quiz
            </Link>
            <Link href="/about" className="btn-secondary text-lg px-8 py-4 border-white/30 text-white hover:bg-white hover:text-brand-primary">
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
            <h2 className="section-title">Where Human Expertise Meets Intelligent Systems</h2>
            <p className="section-subtitle mx-auto">
              Organizations do not fail because their technology is inadequate.
              They fail because the systems around the technology — the workflows,
              the decision points, the human factors — were never designed for how
              people actually work.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'System & Quality Improvement',
                description:
                  'We analyze workflows, identify failure points, and redesign systems to reduce errors and improve outcomes. Grounded in healthcare quality improvement and patient safety methodology, applied across industries.',
                icon: '⚙️',
              },
              {
                title: 'AI Systems Integration',
                description:
                  'AI works best when it augments expert judgment rather than replacing it. We design human-in-the-loop AI systems that support decision-making without removing the human understanding that makes organizations resilient.',
                icon: '🧠',
              },
              {
                title: 'Workflow Design & Process Optimization',
                description:
                  'Before introducing any technology, we map how work actually happens. Then we design better processes — informed by cognitive task analysis, naturalistic decision-making research, and evidence-based change management.',
                icon: '📋',
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

      {/* Evidence-Based Approach */}
      <section className="section-pad">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <p className="eyebrow">Our Approach</p>
              <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: 'var(--color-primary)' }}>
                Evidence-Based Improvement, Not Technology for Its Own Sake
              </h2>
              <div className="space-y-4 text-slate-600">
                <p>
                  Too many organizations adopt AI because the market tells them
                  they should. They buy platforms, deploy tools, and wonder why
                  nothing changes — or why things get worse.
                </p>
                <p>
                  We start with the system, not the technology. Using frameworks
                  from human factors engineering, cognitive systems engineering,
                  and healthcare quality improvement, we identify where the real
                  problems are — and whether technology is actually the right
                  solution.
                </p>
                <p>
                  When AI is the answer, we design it to work with your people,
                  not despite them. Human-in-the-loop systems that preserve the
                  expert judgment your organization depends on.
                </p>
              </div>
            </div>

            <div>
              <p className="eyebrow">Where We Work</p>
              <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: 'var(--color-primary)' }}>
                Complex Organizations, Safety-Critical Environments
              </h2>
              <div className="space-y-4 text-slate-600">
                <p>
                  Our work spans any environment where human performance,
                  system reliability, and safety intersect:
                </p>
                <ul className="space-y-3">
                  {[
                    'Healthcare — quality improvement, patient safety, clinical workflow optimization',
                    'Emergency services — fire, EMS, emergency management, incident decision support',
                    'Complex operations — manufacturing, professional services, government agencies',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="text-brand-teal mt-1 flex-shrink-0">&#10003;</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p>
                  The common thread: these are environments where the cost of
                  getting it wrong is high, and the people doing the work are
                  experts whose judgment matters.
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
              Our agency associates and partners bring peer-reviewed
              methodology to practical system improvement.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-8">
              <h3 className="text-xl font-bold text-brand-teal mb-2">University of Waterloo</h3>
              <p className="text-sm text-slate-400 mb-4">Faculty of Engineering — Systems Design Engineering</p>
              <p className="text-slate-300 text-sm leading-relaxed">
                Research expertise in human factors and ergonomics, cognitive
                systems engineering, work system analysis, and human-AI interaction.
                The foundation for understanding how people interact with complex
                systems — and how to design systems that support expert decision-making.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-8">
              <h3 className="text-xl font-bold text-brand-purple-light mb-2">Western University</h3>
              <p className="text-sm text-slate-400 mb-4">Faculty of Science — Computer Science Department</p>
              <p className="text-slate-300 text-sm leading-relaxed">
                Deep expertise in artificial intelligence, machine learning,
                and digital security. Our partnership ensures AI implementations
                are built on sound technical foundations with proper attention to
                security, privacy, and responsible system design.
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
              AI Readiness & Implementation Approach — a structured methodology
              for understanding your systems, identifying improvement opportunities,
              and implementing change that sticks.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { step: 'Orient', desc: 'Understand your organization, your people, and the systems they work within before prescribing anything.' },
              { step: 'Assess', desc: 'Evaluate readiness across six dimensions using frameworks from cognitive systems engineering, quality improvement, and organizational research.' },
              { step: 'Design', desc: 'Map optimized workflows and determine where system changes — including AI where appropriate — create genuine value.' },
              { step: 'Implement', desc: 'Deploy with structured change management, training, and continuous feedback loops to ensure improvements hold.' },
            ].map((item) => (
              <div key={item.step} className="card card-accent">
                <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--color-primary)' }}>{item.step}</h3>
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
          <h2 className="section-title">Ready to Understand Where You Stand?</h2>
          <p className="section-subtitle mx-auto mb-8">
            Our free assessment evaluates your organization across 6 key
            dimensions. It takes about 5 minutes and provides a personalized
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
