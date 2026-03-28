import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Metadata } from 'next'

export const revalidate = 60

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const supabase = createClient()
  const { data } = await supabase
    .from('associates')
    .select('name, title, bio')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .single()

  if (!data) return { title: 'Team Member' }
  return {
    title: `${data.name} — The Human Factor`,
    description: data.bio?.substring(0, 160) || `${data.name} — ${data.title || 'The Human Factor'}`,
  }
}

export default async function AssociateProfilePage({ params }: { params: { slug: string } }) {
  const supabase = createClient()
  const { data: associate } = await supabase
    .from('associates')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .single()

  if (!associate) notFound()

  // Fetch upcoming events for this associate
  const { data: events } = await supabase
    .from('events')
    .select('id, title, event_type, venue, city, start_date, status, external_url')
    .eq('associate_id', associate.id)
    .eq('is_public', true)
    .gte('start_date', new Date().toISOString())
    .order('start_date', { ascending: true })
    .limit(5)

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <Link href="/team" className="text-sm text-cyan-700 hover:text-cyan-600 mb-8 inline-block">&larr; Back to Team</Link>

      <div className="flex flex-col md:flex-row gap-10 mt-4">
        {/* Photo & Contact */}
        <div className="flex-shrink-0 flex flex-col items-center md:items-start">
          {associate.photo_url ? (
            <img src={associate.photo_url} alt={associate.name} className="w-48 h-48 rounded-2xl object-cover ring-2 ring-slate-100" />
          ) : (
            <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-cyan-100 to-cyan-50 flex items-center justify-center text-5xl font-bold text-cyan-600">
              {associate.name.split(' ').map((n: string) => n[0]).join('')}
            </div>
          )}

          <div className="mt-6 space-y-2 text-sm">
            {associate.email && (
              <a href={`mailto:${associate.email}`} className="block text-slate-600 hover:text-cyan-700 transition-colors">
                {associate.email}
              </a>
            )}
            {associate.phone && (
              <a href={`tel:${associate.phone}`} className="block text-slate-600 hover:text-cyan-700 transition-colors">
                {associate.phone}
              </a>
            )}
            {associate.linkedin && (
              <a href={associate.linkedin} target="_blank" rel="noopener noreferrer" className="block text-cyan-700 hover:text-cyan-600 transition-colors">
                LinkedIn
              </a>
            )}
            {associate.website && (
              <a href={associate.website} target="_blank" rel="noopener noreferrer" className="block text-cyan-700 hover:text-cyan-600 transition-colors">
                Website
              </a>
            )}
          </div>
        </div>

        {/* Bio & Details */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-slate-900">{associate.name}</h1>
          {associate.credentials && <p className="text-sm text-slate-500 mt-1">{associate.credentials}</p>}
          {associate.title && <p className="text-lg text-cyan-700 mt-2">{associate.title}</p>}
          {associate.role && <p className="text-sm text-slate-400 mt-1">{associate.role}</p>}

          {associate.specialties?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {associate.specialties.map((s: string) => (
                <span key={s} className="px-3 py-1 rounded-full bg-cyan-50 text-cyan-700 text-xs font-medium">{s}</span>
              ))}
            </div>
          )}

          {associate.bio && (
            <div className="mt-8 prose prose-slate max-w-none">
              <p className="text-slate-700 leading-relaxed whitespace-pre-line">{associate.bio}</p>
            </div>
          )}

          {/* Upcoming events */}
          {events && events.length > 0 && (
            <div className="mt-12">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Upcoming Events</h2>
              <div className="space-y-3">
                {events.map(ev => (
                  <div key={ev.id} className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50">
                    <div className="flex-shrink-0 text-center w-12">
                      <div className="text-xl font-bold text-slate-900">{new Date(ev.start_date).getDate()}</div>
                      <div className="text-[10px] text-slate-500 uppercase">{new Date(ev.start_date).toLocaleDateString('en-US', { month: 'short' })}</div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-slate-900">{ev.title}</h3>
                      {(ev.venue || ev.city) && (
                        <p className="text-xs text-slate-500 mt-0.5">{[ev.venue, ev.city].filter(Boolean).join(', ')}</p>
                      )}
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] bg-cyan-50 text-cyan-700">{ev.event_type}</span>
                    </div>
                    {ev.external_url && (
                      <a href={ev.external_url} target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-700 hover:text-cyan-600 flex-shrink-0">
                        Details &rarr;
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
