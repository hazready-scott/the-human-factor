import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Metadata } from 'next'

export const revalidate = 60

interface Credential {
  id: string
  label: string
  category: 'academic' | 'professional' | 'award' | 'certification'
  year: number | null
  is_visible?: boolean
}

interface Publication {
  id: string
  year: number | null
  name: string
  doi: string
  url: string
  is_visible?: boolean
}

const CATEGORY_STYLES: Record<string, string> = {
  academic: 'bg-[#1a2744] text-white border border-[#c9944a]',
  professional: 'bg-blue-800 text-white',
  award: 'bg-[#c9944a] text-white',
  certification: 'bg-green-800 text-white',
}

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

  const credentials: Credential[] = (Array.isArray(associate.credentials) ? associate.credentials : []).filter((c: Credential) => c.is_visible !== false)
  const publications: Publication[] = (Array.isArray(associate.publications) ? associate.publications : []).filter((p: Publication) => p.is_visible !== false)

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
      <Link href="/team" className="text-sm text-[#c9944a] hover:text-[#d4a85c] mb-8 inline-block">&larr; Back to Team</Link>

      <div className="flex flex-col md:flex-row gap-10 mt-4">
        {/* Photo & Contact */}
        <div className="flex-shrink-0 flex flex-col items-center md:items-start">
          {associate.photo_url ? (
            <img src={associate.photo_url} alt={associate.name} className="w-48 h-48 rounded-2xl object-cover ring-2 ring-white/10" />
          ) : (
            <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-[#243352] to-[#1a2744] flex items-center justify-center text-5xl font-bold text-[#c9944a]">
              {associate.name.split(' ').map((n: string) => n[0]).join('')}
            </div>
          )}

          <div className="mt-6 space-y-2 text-sm">
            {associate.email && (
              <a href={`mailto:${associate.email}`} className="block text-slate-400 hover:text-[#c9944a] transition-colors">
                {associate.email}
              </a>
            )}
            {associate.phone && (
              <a href={`tel:${associate.phone}`} className="block text-slate-400 hover:text-[#c9944a] transition-colors">
                {associate.phone}
              </a>
            )}
            {associate.linkedin && (
              <a href={associate.linkedin} target="_blank" rel="noopener noreferrer" className="block text-[#c9944a] hover:text-[#d4a85c] transition-colors">
                LinkedIn
              </a>
            )}
            {associate.website && (
              <a href={associate.website} target="_blank" rel="noopener noreferrer" className="block text-[#c9944a] hover:text-[#d4a85c] transition-colors">
                Website
              </a>
            )}
          </div>
        </div>

        {/* Bio & Details */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-white">{associate.name}</h1>
          {associate.title && <p className="text-lg text-[#c9944a] mt-2">{associate.title}</p>}
          {associate.role && <p className="text-sm text-slate-500 mt-1">{associate.role}</p>}

          {/* Credentials */}
          {credentials.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {credentials.map((cred: Credential) => (
                <span
                  key={cred.id}
                  className={`px-3 py-1 rounded-full text-[11px] font-medium ${CATEGORY_STYLES[cred.category] || 'bg-slate-700 text-white'}`}
                >
                  {cred.label}{cred.year ? ` (${cred.year})` : ''}
                </span>
              ))}
            </div>
          )}

          {associate.specialties?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {associate.specialties.map((s: string) => (
                <span key={s} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-400">{s}</span>
              ))}
            </div>
          )}

          {associate.bio && (
            <div className="mt-8">
              <p className="text-slate-400 leading-relaxed whitespace-pre-line">{associate.bio}</p>
            </div>
          )}

          {/* Publications */}
          {publications.length > 0 && (
            <div className="mt-12">
              <h2 className="text-lg font-semibold text-white mb-4">Relevant Publications</h2>
              <div className="space-y-3">
                {publications.map(pub => (
                  <div key={pub.id} className="flex items-start gap-4 p-4 rounded-xl border border-white/10 bg-white/[0.02]">
                    {pub.year && (
                      <div className="flex-shrink-0 text-sm font-semibold text-slate-500 w-12 pt-0.5">{pub.year}</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-300 leading-relaxed">{pub.name}</p>
                      <div className="flex flex-wrap gap-3 mt-1.5">
                        {pub.doi && (
                          <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer" className="text-xs text-[#c9944a] hover:text-[#d4a85c] transition-colors">
                            DOI: {pub.doi}
                          </a>
                        )}
                        {pub.url && (
                          <a href={pub.url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#c9944a] hover:text-[#d4a85c] transition-colors">
                            View Publication &rarr;
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming events */}
          {events && events.length > 0 && (
            <div className="mt-12">
              <h2 className="text-lg font-semibold text-white mb-4">Upcoming Events</h2>
              <div className="space-y-3">
                {events.map(ev => (
                  <div key={ev.id} className="flex items-start gap-4 p-4 rounded-xl border border-white/10 bg-white/[0.02]">
                    <div className="flex-shrink-0 text-center w-12">
                      <div className="text-xl font-bold text-white">{new Date(ev.start_date).getDate()}</div>
                      <div className="text-[10px] text-slate-500 uppercase">{new Date(ev.start_date).toLocaleDateString('en-US', { month: 'short' })}</div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-white">{ev.title}</h3>
                      {(ev.venue || ev.city) && (
                        <p className="text-xs text-slate-500 mt-0.5">{[ev.venue, ev.city].filter(Boolean).join(', ')}</p>
                      )}
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] bg-[#c9944a]/10 text-[#c9944a]">{ev.event_type}</span>
                    </div>
                    {ev.external_url && (
                      <a href={ev.external_url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#c9944a] hover:text-[#d4a85c] flex-shrink-0">
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
