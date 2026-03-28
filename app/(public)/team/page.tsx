import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Team — The Human Factor',
  description: 'Meet the associates and partners at The Human Factor — experts in human factors engineering, systems design, and AI integration.',
}

export const revalidate = 60

export default async function TeamPage() {
  const supabase = createClient()
  const { data: associates } = await supabase
    .from('associates')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })

  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Our Team</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Experienced professionals in human factors engineering, systems design, and AI integration — working together to help organizations thrive.
        </p>
      </div>

      {(!associates || associates.length === 0) ? (
        <p className="text-center text-slate-500">Team page coming soon.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {associates.map((a) => (
            <Link
              key={a.id}
              href={`/team/${a.slug}`}
              className="group rounded-2xl border border-slate-200 bg-white p-6 hover:shadow-lg hover:border-cyan-300 transition-all"
            >
              <div className="flex flex-col items-center text-center">
                {a.photo_url ? (
                  <img src={a.photo_url} alt={a.name} className="w-24 h-24 rounded-full object-cover mb-4 ring-2 ring-slate-100 group-hover:ring-cyan-200 transition-all" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-100 to-cyan-50 flex items-center justify-center text-2xl font-bold text-cyan-600 mb-4">
                    {a.name.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                )}
                <h2 className="text-lg font-semibold text-slate-900">{a.name}</h2>
                {a.credentials && <p className="text-xs text-slate-500 mt-0.5">{a.credentials}</p>}
                {a.title && <p className="text-sm text-cyan-700 mt-1">{a.title}</p>}
                {a.role && <p className="text-xs text-slate-400 mt-1">{a.role}</p>}
                {a.specialties?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3 justify-center">
                    {a.specialties.slice(0, 3).map((s: string) => (
                      <span key={s} className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] text-slate-600">{s}</span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
