import Link from 'next/link'

export const metadata = {
  title: 'About | The Human Factor',
  description:
    'The Human Factor is a system improvement and AI integration firm based in Waterloo, Ontario, backed by research partnerships with the University of Waterloo and Western University.',
}

export default function AboutPage() {
  return (
    <>
      <section className="pt-32 pb-16 px-6 bg-hero-gradient text-white">
        <div className="max-w-4xl mx-auto">
          <div className="accent-bar mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            The Human Side of System Improvement
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl">
            We believe the best system improvements start with people —
            understanding how they work, where systems support or hinder them,
            and how technology can amplify rather than replace expert judgment.
          </p>
        </div>
      </section>

      {/* The Firm */}
      <section className="section-pad">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <p className="eyebrow">The Firm</p>
              <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-primary)' }}>Who We Are</h2>
              <div className="space-y-4 text-slate-600">
                <p>
                  The Human Factor is a system improvement and AI integration
                  firm based in Waterloo, Ontario. We bring together researchers
                  and practitioners from the University of Waterloo&apos;s Systems
                  Design Engineering and Human Factors programs and Western
                  University&apos;s Computer Science and Digital Security departments.
                </p>
                <p>
                  Unlike technology vendors who start with a product and look for
                  a problem, we start with the humans doing the work. Our
                  methodology draws on established frameworks from Human Factors
                  Engineering, Cognitive Systems Engineering, healthcare quality
                  improvement, and evidence-based change management.
                </p>
                <p>
                  We serve organizations across North America — from healthcare
                  and emergency services to professional services and manufacturing —
                  anywhere human performance, system reliability, and safety intersect.
                </p>
              </div>
            </div>
            <div className="rounded-2xl p-8" style={{ backgroundColor: 'var(--color-cool-gray)' }}>
              <h3 className="text-lg font-bold mb-6" style={{ color: 'var(--color-primary)' }}>Our Principles</h3>
              <div className="space-y-6">
                {[
                  { title: 'People First', desc: 'Technology serves people, not the other way around. Every recommendation starts with the human impact.' },
                  { title: 'Evidence-Based', desc: 'We measure before we prescribe. Our assessments provide data-driven insights grounded in peer-reviewed research.' },
                  { title: 'Practical Results', desc: 'Strategic plans that collect dust help no one. We focus on actionable steps your teams can implement today.' },
                  { title: 'Human in the Loop', desc: 'AI should augment expert judgment, not replace it. We design systems that keep humans where they matter most.' },
                ].map((p) => (
                  <div key={p.title}>
                    <h4 className="font-semibold" style={{ color: 'var(--color-primary)' }}>{p.title}</h4>
                    <p className="text-sm text-slate-500 mt-1">{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="section-pad bg-brand-cool-white">
        <div className="max-w-4xl mx-auto">
          <p className="eyebrow">Our Approach</p>
          <h2 className="section-title mb-8">The ARIA Method</h2>
          <p className="text-slate-600 mb-8 max-w-2xl">
            AI Readiness & Implementation Approach — a structured methodology built
            on established frameworks from Human Factors Engineering, healthcare
            quality improvement, and organizational science.
          </p>
          <div className="grid sm:grid-cols-2 gap-6 mb-12">
            {[
              { title: 'SEIPS Framework', desc: 'Systems Engineering Initiative for Patient Safety — adapted for organizational work system analysis across safety-critical environments.' },
              { title: 'Recognition-Primed Decision Making', desc: 'Understanding how experts actually make decisions under pressure, so systems support rather than disrupt expert judgment.' },
              { title: 'ADKAR Change Model', desc: 'Structured change management ensuring Awareness, Desire, Knowledge, Ability, and Reinforcement through every implementation.' },
              { title: 'Cognitive Task Analysis', desc: 'Mapping the cognitive demands of work to identify where system changes and AI create genuine value versus friction.' },
            ].map((item) => (
              <div key={item.title} className="card card-accent">
                <h3 className="font-bold mb-2" style={{ color: 'var(--color-primary)' }}>{item.title}</h3>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="section-pad bg-hero-gradient text-white">
        <div className="max-w-4xl mx-auto">
          <p className="eyebrow" style={{ color: '#06b6d4' }}>Agency Associates & Partners</p>
          <h2 className="text-3xl font-bold mb-4">Research-Backed Implementation</h2>
          <p className="text-slate-300 mb-12 max-w-2xl">
            Our team draws from active researchers and practitioners at leading
            Canadian institutions, giving our clients direct access to cutting-edge
            research translated into practical system improvement.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-8">
              <h3 className="text-xl font-bold text-brand-teal mb-2">University of Waterloo</h3>
              <p className="text-sm text-slate-400 mb-4">Faculty of Engineering — Systems Design Engineering</p>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>Human Factors and Ergonomics Lab</li>
                <li>Cognitive Systems Engineering research</li>
                <li>Work system analysis and design</li>
                <li>Human-AI interaction and collaboration</li>
              </ul>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-8">
              <h3 className="text-xl font-bold text-brand-purple-light mb-2">Western University</h3>
              <p className="text-sm text-slate-400 mb-4">Faculty of Science — Computer Science Department</p>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>Artificial intelligence and machine learning</li>
                <li>Digital security and privacy</li>
                <li>Software engineering and system architecture</li>
                <li>Applied AI research and deployment</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* What We Build */}
      <section className="section-pad">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <p className="eyebrow">What We Build</p>
              <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-primary)' }}>
                Custom Tools & Workflow Systems
              </h2>
              <div className="space-y-4 text-slate-600">
                <p>
                  Beyond assessment, we design and build custom AI tools and
                  workflow systems. Our engineering team creates purpose-built
                  solutions using modern cloud and open-source infrastructure —
                  tools fitted to your work, not the other way around.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { title: 'Decision Support Systems', desc: 'AI that augments expert judgment with relevant information at the right moment.' },
                { title: 'Workflow Automation', desc: 'Automate the repetitive parts so your team focuses on the work that matters.' },
                { title: 'Quality Monitoring', desc: 'Continuous system performance tracking tied to patient safety and operational outcomes.' },
                { title: 'Custom Integrations', desc: 'Connect existing systems with AI capabilities through purpose-built integrations.' },
              ].map((item) => (
                <div key={item.title} className="card">
                  <h4 className="font-semibold mb-1" style={{ color: 'var(--color-primary)' }}>{item.title}</h4>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad bg-brand-cool-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-primary)' }}>
            Curious where your organization stands?
          </h2>
          <p className="text-slate-500 mb-8">
            Take our free AI Readiness Assessment and get a personalized report
            with actionable recommendations across 6 dimensions.
          </p>
          <Link href="/assessment" className="btn-primary">Take the AI Readiness Quiz</Link>
        </div>
      </section>
    </>
  )
}
