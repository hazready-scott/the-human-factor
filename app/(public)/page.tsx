import Link from 'next/link'
import AssociateProfiles from '@/components/AssociateProfiles'
import ContactForm from '@/components/ContactForm'

const HERO_IMAGE = process.env.NEXT_PUBLIC_HERO_IMAGE_URL || '/images/hero-systems.jpg'

const ariaPhases = [
  {
    num: 1,
    name: 'Assess',
    desc: 'Understand your organization, people, and context. Map decision-making architecture, workflows, leadership dynamics, and readiness for change. Identify where systems are underperforming and why.',
  },
  {
    num: 2,
    name: 'Redesign',
    desc: 'Analyze friction points, perform cognitive task analysis, and design better systems. Define improvement opportunities — including where AI and automation create genuine value, and where they don\u2019t.',
  },
  {
    num: 3,
    name: 'Implement',
    desc: 'Build, test, and validate. Deploy process changes, new tools, and technology with structured change management. Pilot with real users in real workflows before scaling.',
  },
  {
    num: 4,
    name: 'Advance',
    desc: 'Adoption is not deployment. Train people, build governance, measure outcomes, and create the conditions for continuous improvement. Systems that stick are systems designed for the people who use them.',
  },
]

const services = [
  {
    title: 'AI Readiness Assessment',
    tag: 'Free',
    desc: 'A comprehensive self-assessment that evaluates your organization across six key dimensions of AI readiness. You\u2019ll receive a personalized score, actionable recommendations, and an honest picture of where you stand. Takes about 5 minutes — no commitment required.',
  },
  {
    title: 'ARIA Assessment',
    desc: 'A structured deep-dive into your organization\u2019s workflows, decision-making, and technology landscape. Deliverables include a work system analysis, scored improvement opportunity map, council-ready presentation package, and complimentary 90-day access to HazReady, our AI-powered emergency intelligence platform.',
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
    desc: 'Monthly retainer for organizations that want a trusted advisor on systems improvement, AI strategy, vendor evaluation, and continuous improvement.',
  },
]

const specialties = [
  {
    title: 'Emergency Services & Public Safety',
    desc: 'Fire departments, paramedic services, emergency management offices, and public safety communications agencies. We understand your world because we\u2019ve spent decades working in it, from the front line to the executive suite.',
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
    desc: 'Healthcare and Paramedic service optimization, community paramedicine, quality improvement, patient safety systems, and health system integration. Grounded in healthcare quality science and human factors methodology.',
  },
]

export default function Home() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center text-white overflow-hidden">
        {/* Background image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_IMAGE}
          alt="AI-powered systems integration across emergency services, healthcare, and public safety"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Dark overlay for text readability — light enough to see the full image */}
        <div className="absolute inset-0 bg-[#0d1626]/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1626] via-transparent to-[#0d1626]/40" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 grid lg:grid-cols-5 gap-12 items-center">
          <div className="lg:col-span-3">
            <div className="accent-bar mb-8" />
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              The Human Factor
            </h1>
            <p className="text-lg md:text-xl text-[#c9944a] font-medium max-w-2xl mb-6">
              Applied science. Better systems. AI strategy grounded in how people actually work.
            </p>
            <p className="text-base md:text-lg text-slate-300 max-w-2xl mb-10 leading-relaxed">
              Most AI implementations fail because they ignore the human element. We take a different approach. Grounded in human factors engineering, systems design, and decades of operational experience in emergency services and healthcare, The Human Factor helps organizations improve their organizational systems and adopt AI in ways that genuinely improve how people work, decide, and deliver.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/assessment" className="btn-primary text-lg px-8 py-4">
                Take the AI Readiness Assessment
              </Link>
              <a href="#aria" className="btn-secondary text-lg px-8 py-4">
                Learn about the ARIA Method &rarr;
              </a>
            </div>
          </div>
          {/* Right side left intentionally transparent to reveal the hero image */}
          <div className="hidden lg:block lg:col-span-2" />
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
              The Human Factor is an advisory practice built at the intersection of emergency services leadership, healthcare quality, and technology innovation. Our team brings decades of combined experience — from front-line operations to the executive suite — alongside active research programs at leading Canadian universities.
            </p>
            <p>
              Our work is backed by significant research investment, including a $2M federally funded AI research initiative with Defence Research and Development Canada (DRDC) and a Social Sciences and Humanities Research Council (SSHRC) supported study on technology adoption in high-stakes environments. This research, conducted through the University of Waterloo&apos;s Systems Design Engineering program, directly informs how we approach every engagement.
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
            <p className="text-[#c9944a] font-medium text-lg mb-4">Assess. Redesign. Implement. Advance.</p>
            <p className="section-subtitle mx-auto">
              ARIA is our structured approach to systems improvement and organizational transformation. Whether the solution involves AI, process redesign, workflow automation, or all three, ARIA ensures every change is designed around the people who will actually use it — grounded in human factors engineering, naturalistic decision-making, and systems design research.
            </p>
          </div>

          {/* Desktop: Horizontal Stepper */}
          <div className="hidden md:block relative mb-12">
            {/* Connecting line */}
            <div className="absolute top-6 left-[12%] right-[12%] h-0.5 bg-[#c9944a]/30" />
            <div className="flex items-start justify-between">
              {ariaPhases.map((phase) => (
                <div key={phase.num} className="flex flex-col items-center text-center w-1/4 relative z-10 px-3">
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
                  {phase.num < 4 && <div className="w-0.5 flex-1 bg-[#c9944a]/20 mt-2" />}
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
            <Link href="/assessment" className="btn-primary text-lg px-8 py-4">
              Take the Free AI Readiness Assessment
            </Link>
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
            HazReady is our AI-powered emergency intelligence platform, built from the same research that drives our advisory practice. It helps fire departments, emergency management offices, and regional coordinators automate planning, manage resources, and coordinate across agencies. When we recommend AI during an ARIA engagement, HazReady is a shining example of solutions we can identify and implement. It was designed to solve the exact problems our work identifies.
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
          </div>
          <AssociateProfiles />
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section id="contact" className="section-pad section-elevated">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="accent-bar mb-4" />
              <h2 className="section-title">Let&apos;s Talk About What You&apos;re Trying to Solve</h2>
              <p className="text-slate-400 mt-4 mb-8">
                Whether you&apos;re exploring AI for the first time, navigating a technology procurement, or building an organizational strategy, a conversation is always the best starting point.
              </p>
              <div className="space-y-4 text-sm">
                <div>
                  <h3 className="font-semibold text-white mb-1">Email</h3>
                  <a href="mailto:info@thehumanfactor.ca" className="text-[#c9944a] hover:text-[#d4a85c] transition-colors">info@thehumanfactor.ca</a>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Location</h3>
                  <p className="text-slate-400">Hamilton, Ontario, Canada</p>
                  <p className="text-slate-500 text-xs">Serving organizations across North America</p>
                </div>
                <div>
                  <a href="https://www.linkedin.com/in/sdramey/" target="_blank" rel="noopener noreferrer" className="text-[#c9944a] hover:text-[#d4a85c] transition-colors">
                    LinkedIn &rarr;
                  </a>
                </div>
              </div>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  )
}
