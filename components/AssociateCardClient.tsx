'use client'

import Link from 'next/link'
import type { Associate } from './AssociateProfiles'

export function AssociateCardClient({ associate }: { associate: Associate }) {
  const a = associate

  return (
    <Link
      href={`/team/${a.slug}`}
      className="group rounded-xl border p-6 transition-all duration-300 bg-[#1a2744]/80 border-white/10 hover:border-[#c9944a]/30 hover:-translate-y-1 block"
      style={{ backdropFilter: 'blur(12px)' }}
    >
      <div className="flex flex-col items-center text-center">
        {a.photo_url ? (
          <img
            src={a.photo_url}
            alt={a.name}
            className="w-[120px] h-[120px] rounded-full object-cover mb-4 ring-2 ring-white/10 group-hover:ring-[#c9944a]/30 transition-all"
          />
        ) : (
          <div className="w-[120px] h-[120px] rounded-full bg-gradient-to-br from-[#243352] to-[#1a2744] flex items-center justify-center text-3xl font-bold text-[#c9944a] mb-4 ring-2 ring-white/10 group-hover:ring-[#c9944a]/30 transition-all">
            {a.name.split(' ').map((n: string) => n[0]).join('')}
          </div>
        )}

        <h3 className="text-lg font-semibold text-white group-hover:text-[#c9944a] transition-colors">{a.name}</h3>
        {a.title && <p className="text-sm text-[#c9944a] mt-1 font-medium">{a.title}</p>}

        {a.specialties && a.specialties.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3 justify-center">
            {a.specialties.slice(0, 3).map((s: string) => (
              <span key={s} className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-slate-400">{s}</span>
            ))}
          </div>
        )}

        <p className="text-xs text-slate-500 mt-4 group-hover:text-[#c9944a]/70 transition-colors">View Profile &rarr;</p>
      </div>
    </Link>
  )
}
