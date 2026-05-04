import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { getDefaultEventHero } from '@/lib/site-settings'
import { RESERVED_SLUGS } from '@/lib/events/slug'
import ContactForm from '@/components/ContactForm'
import EventPdfEmbed from '@/components/EventPdfEmbed'
import { Calendar, MapPin, ExternalLink, Sparkles } from 'lucide-react'

export const revalidate = 60

type EventRow = {
  id: string
  slug: string
  title: string
  event_name: string | null
  description: string | null
  event_type: string
  venue: string | null
  city: string | null
  province_state: string | null
  country: string | null
  start_date: string
  end_date: string | null
  timezone: string | null
  is_public: boolean
  hero_image_url: string | null
  slides_pdf_url: string | null
  slides_pdf_allow_download: boolean
  external_url: string | null
  associate: { id: string; name: string; slug: string; photo_url: string | null; title: string | null; booking_url: string | null } | null
  presentation: { id: string; title: string; slug: string } | null
}

async function loadEvent(slug: string): Promise<EventRow | null> {
  if (RESERVED_SLUGS.has(slug.toLowerCase())) return null
  const supabase = createClient()
  const { data } = await supabase
    .from('events')
    .select('id, slug, title, event_name, description, event_type, venue, city, province_state, country, start_date, end_date, timezone, is_public, hero_image_url, slides_pdf_url, slides_pdf_allow_download, external_url, associate:associates(id, name, slug, photo_url, title, booking_url), presentation:presentations(id, title, slug)')
    .eq('slug', slug)
    .eq('is_public', true)
    .maybeSingle()
  return (data as unknown as EventRow) || null
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const event = await loadEvent(params.slug)
  if (!event) return { title: 'Event' }
  const name = event.event_name || event.title
  return {
    title: `${name} | The Human Factor`,
    description: event.description || `Resources from ${name}`,
    openGraph: {
      title: name,
      description: event.description || undefined,
      images: event.hero_image_url ? [event.hero_image_url] : undefined,
    },
  }
}

function formatDate(iso: string, timezone: string | null) {
  const date = new Date(iso)
  return new Intl.DateTimeFormat('en-CA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: timezone || 'America/Toronto',
    timeZoneName: 'short',
  }).format(date)
}

export default async function EventLandingPage({ params }: { params: { slug: string } }) {
  const event = await loadEvent(params.slug)
  if (!event) notFound()

  const heroUrl = event.hero_image_url || (await getDefaultEventHero())
  const displayName = event.event_name || event.title
  const location = [event.venue, event.city, event.province_state, event.country].filter(Boolean).join(', ')

  return (
    <>
      {/* Hero */}
      <section className="relative pt-24 pb-12 md:pt-32 md:pb-20 px-6 overflow-hidden">
        {heroUrl && (
          <div className="absolute inset-0 -z-10">
            <Image src={heroUrl} alt="" fill className="object-cover" priority unoptimized />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/90" />
          </div>
        )}

        <div className="max-w-4xl mx-auto text-white">
          <div className="accent-bar mb-6" />
          <p className="text-xs font-semibold uppercase tracking-widest text-[#c9944a] mb-3">{event.event_type}</p>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{displayName}</h1>
          {event.event_name && event.title && event.event_name !== event.title && (
            <p className="text-lg md:text-xl text-slate-200 mb-6">{event.title}</p>
          )}

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-300 mb-8">
            <span className="flex items-center gap-2"><Calendar size={14} /> {formatDate(event.start_date, event.timezone)}</span>
            {location && <span className="flex items-center gap-2"><MapPin size={14} /> {location}</span>}
          </div>

          <Link
            href={`/assessment?event=${encodeURIComponent(event.slug)}`}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Sparkles size={16} />
            Take the AI Readiness Assessment
          </Link>
          <p className="text-xs text-slate-400 mt-3">Free, takes 5–7 minutes. Get your organization&rsquo;s readiness score and a tailored report.</p>
        </div>
      </section>

      {/* Body */}
      <section className="section-pad">
        <div className="max-w-4xl mx-auto">

          {event.description && (
            <div className="mb-12">
              <p className="text-lg text-slate-300 leading-relaxed whitespace-pre-line">{event.description}</p>
            </div>
          )}

          {event.associate && (
            <div className="card mb-12 flex flex-wrap items-center gap-4">
              {event.associate.photo_url && (
                <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                  <Image src={event.associate.photo_url} alt={event.associate.name} fill className="object-cover" unoptimized />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">Presented by</p>
                <h3 className="text-xl font-bold text-white">{event.associate.name}</h3>
                {event.associate.title && <p className="text-sm text-slate-400 mt-1">{event.associate.title}</p>}
              </div>
              {event.associate.booking_url && (
                <a
                  href={event.associate.booking_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary inline-flex items-center gap-2 flex-shrink-0"
                >
                  <Calendar size={14} />
                  Schedule a Conversation
                </a>
              )}
            </div>
          )}

          {event.slides_pdf_url && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4">Slides</h2>
              <EventPdfEmbed pdfUrl={event.slides_pdf_url} allowDownload={event.slides_pdf_allow_download} />
              {event.presentation && (
                <p className="mt-3 text-sm text-slate-400">
                  <Link href={`/p/${event.presentation.slug}`} className="text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1">
                    View interactive slides <ExternalLink size={11} />
                  </Link>
                </p>
              )}
            </div>
          )}

          {!event.slides_pdf_url && event.presentation && (
            <div className="card mb-12">
              <h3 className="text-lg font-semibold text-white mb-2">Interactive Slides</h3>
              <p className="text-sm text-slate-400 mb-3">View the talk slides online.</p>
              <Link href={`/p/${event.presentation.slug}`} className="btn-secondary inline-flex items-center gap-2">
                View Slides <ExternalLink size={14} />
              </Link>
            </div>
          )}

          <div className="grid md:grid-cols-5 gap-8 mt-16">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold text-white mb-4">Stay in Touch</h2>
              <p className="text-slate-400 mb-4">
                Questions about the talk, or want to explore how this applies to your organization? Send a note and we&rsquo;ll be in touch within 24 hours.
              </p>
              <p className="text-sm text-slate-500">
                Or take the AI Readiness Assessment first — it&rsquo;s a 5–7 minute quiz that gives you a tailored readiness score and report you can share with your team.
              </p>
            </div>
            <div className="md:col-span-3">
              <ContactForm eventSlug={event.slug} />
            </div>
          </div>

        </div>
      </section>
    </>
  )
}
