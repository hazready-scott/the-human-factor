'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ExternalLink, Mail } from 'lucide-react'
import type { Associate, Credential } from './AssociateProfiles'

const CATEGORY_STYLES: Record<Credential['category'], string> = {
  academic: 'bg-[#1a2744] text-white border border-[#c9944a]',
  professional: 'bg-blue-800 text-white',
  award: 'bg-[#c9944a] text-white',
  certification: 'bg-green-800 text-white',
}

function CredentialBar({ credentials }: { credentials: Credential[] }) {
  if (!credentials || credentials.length === 0) return null

  return (
    <div className="overflow-x-auto flex gap-2 pb-2 mt-4 scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
      {credentials.map((cred) => (
        <span
          key={cred.id}
          className={`px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap ${CATEGORY_STYLES[cred.category] || 'bg-slate-700 text-white'}`}
          title={cred.label + (cred.year ? ` (${cred.year})` : '')}
        >
          {cred.label.length > 40 ? cred.label.substring(0, 37) + '...' : cred.label}
          {cred.year ? ` (${cred.year})` : ''}
        </span>
      ))}
    </div>
  )
}

export function AssociateCardClient({ associate }: { associate: Associate }) {
  const [expanded, setExpanded] = useState(false)
  const a = associate

  return (
    <div className="rounded-xl border p-6 transition-all duration-300 bg-[#1a2744]/80 border-white/10 hover:border-[#c9944a]/30 hover:-translate-y-1"
      style={{ backdropFilter: 'blur(12px)' }}>
      <div className="flex flex-col items-center text-center">
        {a.photo_url ? (
          <img
            src={a.photo_url}
            alt={a.name}
            className="w-[120px] h-[120px] rounded-full object-cover mb-4 ring-2 ring-white/10"
          />
        ) : (
          <div className="w-[120px] h-[120px] rounded-full bg-gradient-to-br from-[#243352] to-[#1a2744] flex items-center justify-center text-3xl font-bold text-[#c9944a] mb-4 ring-2 ring-white/10">
            {a.name.split(' ').map((n: string) => n[0]).join('')}
          </div>
        )}

        <Link href={`/team/${a.slug}`} className="hover:underline">
          <h3 className="text-lg font-semibold text-white">{a.name}</h3>
        </Link>
        {a.title && <p className="text-sm text-[#c9944a] mt-1 font-medium">{a.title}</p>}

        {a.bio && (
          <div className="mt-3 text-sm text-slate-400">
            <p className={expanded ? '' : 'line-clamp-3'}>{a.bio}</p>
            {a.bio.length > 150 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-[#c9944a] text-xs mt-1 hover:underline"
              >
                {expanded ? 'Show less' : 'Read more'}
              </button>
            )}
          </div>
        )}

        <div className="flex items-center gap-3 mt-4">
          {a.linkedin && (
            <a href={a.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-[#c9944a] transition-colors">
              <ExternalLink size={18} />
            </a>
          )}
          {a.email && (
            <a href={`mailto:${a.email}`} className="text-slate-500 hover:text-[#c9944a] transition-colors">
              <Mail size={18} />
            </a>
          )}
        </div>

        <CredentialBar credentials={a.credentials} />
      </div>
    </div>
  )
}
