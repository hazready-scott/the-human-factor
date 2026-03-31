import Link from 'next/link'
import AssociateProfiles from '@/components/AssociateProfiles'

const ariaPhases = [
  {
    num: 1,
    name: 'Orient',
    desc: 'Understand the business, people, and context before recommending anything. Map the decision-making architecture, leadership dynamics, and organizational readiness.',
  },
  {
    num: 2,
    name: 'Assess',
    desc: 'Analyze the work system. Map workflows, identify friction points, perform cognitive task analysis on critical decisions, and score every AI opportunity on suitability, impact, effort, and risk.',
  },
  {
    num: 3,
    name: 'Design',
    desc: 'Select the right interventions. Define human-AI collaboration models. Choose tools. Set success metrics. Build the implementation blueprint.',
  },
  {
    num: 4,
    name: 'Build',
    desc: 'Implement, test, and validate. Pilot with real users in real workflows. Evaluate rigorously against defined success criteria.',
  },
  {
    num: 5,
    name: 'Embed',
    desc: 'Adoption is not deployment. Train people. Build governance. Measure outcomes. Create the conditions for long-term success.',
  },
]

const services = [
  {
    title: 'AI Readiness Scorecard',
    tag: 'Free',
    desc: 'A 45-minute diagnostic conversation that gives you a clear picture of where you stand. You\u2019ll receive a personalized readiness score across six dimensions, three specific quick wins, and an honest assessment of what comes next. No pitch. No obligation.',
  },
  {
    title: 'ARIA Assessment',
    desc: 'A structured deep-dive into your organization\u2019s workflows, decision-making, and technology landscape. Deliverables include a work system analysis, scored AI opportunity map, council-ready presentation package, and complimentary 90-day access to HazReady, our AI-powered emergency intelligence platform.',
  },
  {
    title: 'ARIA Blueprint',
    desc: 'Everything in the Assessment, plus a full implementation design: tool selection, human-AI collaboration models, data readiness evaluation, phased rollout plan, and risk register. Includes 6-month HazReady access and monthly advisory calls.',
  },
  {
    title: 'ARIA Implementation',
    desc: 'End-to-end transformation. We build it, test it, validate it, train your people, and embed the governance to make it stick. Includes 12-month HazReady enterprise access and quarterly business reviews.',
  },
  {
    title: 'Ongoing Advisory',
    desc: 'Monthly retainer for organizations that want a trusted advisor on AI strategy, vendor evaluation, and continuous improvement.',
  },
]

const specialties = [
  {
    title: 'Emergency Services & Public Safety',
    desc: 'Fire departments, paramedic services, emergency management offices, and public safety communications agencies. We understand your world because we\u2019ve spent 30 years working in it, from the front line to the executive suite.',
  },
  {
    title: 'AI Strategy & Systems Improvement',
    desc: 'Vendor-neutral guidance on where AI creates genuine value and where it creates expensive problems. We help you make smart technology decisions before you spend money, not after.',
  },
  {
    title: 'Organizational Excellence & Accreditation',
    desc: 'Fire service accreditation (CFAI/CPSE), strategic planning, culture transformation, labour relations, and leadership development. Evidence-based approaches to building high-performing teams.',
  },
  {
    title: 'Healthcare Quality & EMS Systems',
    desc: 'Paramedic service optimization, community paramedicine, quality improvement, patient safety systems, and health system integration. Grounded in healthcare quality science and human factors methodology.',
  },
]

export default function Home() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-brand-amber/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-brand-amber/5 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="accent-bar mx-auto mb-8" />
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            The Human Factor
          </h1>
          <p className="text-lg md:text-xl text-[#c9944a] font-medium max-w-2xl mx-auto mb-6">
            Applied science. Better systems. AI strategy grounded in how people actually work.
          </p>
          <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto mb-10">
            Most AI implementations fail because they ignore the human element. We take a different approach. Grounded in human factors engineering, systems design, and 30 years of operational experience in emergency services, The Human Factor helps organizations adopt AI in ways that genuinely improve how people work, decide, and deliver.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#contact" className="btn-primary text-lg px-8 py-4">
              Book a Free AI Readiness Scorecard Call
            </a>
            <a href="#aria" className="btn-secondary text-lg px-8 py-4">
              Learn about the ARIA Method &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section id="about" className="section-pad section-elevated">
        <div className="max-w-4xl mx-auto">
          <p className="eyebrow">About</p>
          <h2 className="section-title">Where Research Meets Reality</h2>
          <div className="accent-bar mb-8" />
          <div className="space-y-5 text-slate-400 text-base leading-relaxed">
            <p>
              The Human Factor is the advisory practice of Scott Ramey, a practitioner-scholar who has spent three decades at the intersection of emergency services leadership, healthcare quality, and technology innovation.
            </p>
            <p>
              As the Principal Investigator on a $2M federally funded AI research initiative with Defence Research and Development Canada, a PhD candidate in Systems Design Engineering and Human Factors at the University of Waterloo, and a veteran fire service executive who has led organizations through accreditation, cultural transformation, and complex change management, Scott brings something rare to practice: the ability to bridge academic rigor and operational reality.
            </p>
            <p>
              The Human Factor exists because the gap between what AI promises and what AI delivers in high-stakes environments is almost always a human problem, not a technology problem. We close that gap.
            </p>
          </div>
        </div>
      </section>

      {/* ===== ARIA METHOD ===== */}
      <section id="aria" className="section-pad section-dark">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="eyebrow">Our Methodology</p>
            <h2 className="section-title">The ARIA Method</h2>
            <p className="text-[#c9944a] font-medium text-lg mb-4">AI Readiness and Implementation Approach</p>
            <p className="section-subtitle mx-auto">
              ARIA is our proprietary five-phase methodology for helping organizations move from AI curiosity to operational reality. Developed from research in human factors engineering, naturalistic decision-making, and systems design, ARIA ensures that every AI implementation is designed around the people who will actually use it.
            </p>
          </div>

          {/* Desktop: Horizontal Stepper */}
          <div className="hidden md:block relative mb-12">
            {/* Connecting line */}
            <div className="absolute top-6 left-[10%] right-[10%] h-0.5 bg-[#c9944a]/30" />
            <div className="flex items-start justify-between">
              {ariaPhases.map((phase) => (
                <div key={phase.num} className="flex flex-col items-center text-center w-1/5 relative z-10 px-2">
                  <div className="w-12 h-12 rounded-full bg-[#1a2744] border-2 border-[#c9944a] text-white flex items-center justify-center font-bold text-lg shadow-lg">
                    {phase.num}
                  </div>
                  <h3 className="font-bold text-white mt-3 text-base">{phase.name}</h3>
                  <p className="text-sm text-slate-400 mt-2 leading-relaxed">{phase.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile: Vertical Timeline */}
          <div className="md:hidden space-y-6 mb-12">
            {ariaPhases.map((phase) => (
              <div key={phase.num} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-[#1a2744] border-2 border-[#c9944a] text-white flex items-center justify-center font-bold flex-shrink-0">
                    {phase.num}
                  </div>
                  {phase.num < 5 && <div className="w-0.5 flex-1 bg-[#c9944a]/20 mt-2" />}
                </div>
                <div className="pb-4">
                  <h3 className="font-bold text-white">{phase.name}</h3>
                  <p className="text-sm text-slate-400 mt-1 leading-relaxed">{phase.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Callout */}
          <div className="rounded-xl border border-[#c9944a]/20 bg-[#c9944a]/5 p-6 text-center max-w-3xl mx-auto mb-10">
            <p className="text-slate-300 text-sm md:text-base italic">
              &ldquo;Every engagement includes a &lsquo;Do Not Touch&rsquo; list. Telling you where AI should not go is as valuable as telling you where it should.&rdquo;
            </p>
          </div>

          <div className="text-center">
            <a href="#contact" className="btn-primary text-lg px-8 py-4">
              See How Ready You Are &mdash; Book a Free Scorecard Call
            </a>
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section id="services" className="section-pad">
        <div className="max-w-4xl mx-auto">
          <p className="eyebrow">Services</p>
          <h2 className="section-title mb-10">How We Work</h2>
          <div className="space-y-6">
            {services.map((svc) => (
              <div key={svc.title} className="card card-accent">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-lg text-white">{svc.title}</h3>
                    <p className="text-sm text-slate-400 mt-2 leading-relaxed">{svc.desc}</p>
                  </div>
                  {svc.tag && (
                    <span className="px-3 py-1 rounded-full bg-[#c9944a] text-white text-xs font-semibold flex-shrink-0">
                      {svc.tag}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SPECIALTIES ===== */}
      <section id="specialties" className="section-pad section-elevated">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="eyebrow">Specialties</p>
            <h2 className="section-title">Deep Expertise Where It Matters</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {specialties.map((spec) => (
              <div key={spec.title} className="card">
                <h3 className="font-bold text-lg text-white mb-3">{spec.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{spec.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HAZREADY ===== */}
      <section id="hazready" className="section-pad section-dark">
        <div className="max-w-4xl mx-auto text-center">
          <p className="eyebrow">Our Platform</p>
          <h2 className="section-title">Meet HazReady</h2>
          <div className="accent-bar mx-auto mb-8" />
          <p className="text-slate-400 text-base leading-relaxed max-w-2xl mx-auto mb-8">
            HazReady is our AI-powered emergency intelligence platform, built from the same research that drives our advisory practice. It helps fire departments, emergency management offices, and regional coordinators automate planning, manage resources, and coordinate across agencies. When we recommend AI during an ARIA engagement, HazReady is often part of the solution. It was designed to solve the exact problems our work identifies.
          </p>
          <a
            href="https://hazready.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-lg px-8 py-4"
          >
            Explore HazReady
          </a>
        </div>
      </section>

      {/* ===== TEAM ===== */}
      <section id="team" className="section-pad">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="eyebrow">Our Team</p>
            <h2 className="section-title">Our Specialists</h2>
            <p className="section-subtitle mx-auto">
              The Human Factor brings together experienced practitioners from emergency services, healthcare, and technology. Each member of our team is a specialist who has worked in the field — not just studied it.
            </p>
          </div>
          <AssociateProfiles />
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section id="contact" className="section-pad section-elevated">
        <div className="max-w-3xl mx-auto text-center">
          <div className="accent-bar mx-auto mb-4" />
          <h2 className="section-title">Let&apos;s Talk About What You&apos;re Trying to Solve</h2>
          <p className="section-subtitle mx-auto mb-8">
            Whether you&apos;re exploring AI for the first time, navigating a technology procurement, or building an organizational strategy, a conversation is always the best starting point.
          </p>
          <div className="space-y-4">
            <a href="#contact" className="btn-primary text-lg px-8 py-4">
              Book a Free AI Readiness Scorecard Call
            </a>
            <div className="flex items-center justify-center gap-6 mt-6">
              <a href="mailto:scott@thehumanfactor.ca" className="text-sm text-slate-400 hover:text-[#c9944a] transition-colors">
                scott@thehumanfactor.ca
              </a>
              <a href="https://www.linkedin.com/in/sdramey/" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-400 hover:text-[#c9944a] transition-colors">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
