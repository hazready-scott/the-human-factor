'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Copy, ExternalLink } from 'lucide-react'

interface Presentation {
  id: string
  title: string
  slug: string
  status: string
  slides: unknown[]
  settings: { estimatedMinutes?: number }
  tags: string[]
  share_token: string | null
  created_at: string
  updated_at: string
}

const STATUS_STYLES: Record<string, string> = {
  draft: 'bg-yellow-500/20 text-yellow-300',
  published: 'bg-green-500/20 text-green-300',
  private: 'bg-blue-500/20 text-blue-300',
  shareable: 'bg-purple-500/20 text-purple-300',
}

export default function PresentationsPage() {
  const [presentations, setPresentations] = useState<Presentation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/presentations')
      .then(r => r.json())
      .then(data => { setPresentations(data.presentations || []); setLoading(false) })
  }, [])

  const copyShareUrl = (slug: string, token: string | null) => {
    const url = token
      ? `${window.location.origin}/p/${slug}?token=${token}`
      : `${window.location.origin}/p/${slug}`
    navigator.clipboard.writeText(url)
    alert('Share URL copied!')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Presentations</h1>
        <Link
          href="/admin/presentations/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#06b6d4] text-white rounded-lg text-sm font-semibold hover:bg-[#0891b2] transition-colors"
        >
          <Plus size={16} /> New Presentation
        </Link>
      </div>

      <div className="admin-card p-0 overflow-hidden">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Slides</th>
              <th>Duration</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">Loading...</td></tr>
            ) : presentations.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">No presentations yet. Create your first one.</td></tr>
            ) : presentations.map(p => (
              <tr key={p.id}>
                <td className="px-4 py-3">
                  <Link href={`/admin/presentations/${p.id}/edit`} className="font-medium text-slate-200 hover:text-cyan-400 transition-colors">
                    {p.title}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_STYLES[p.status] || ''}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-400">{Array.isArray(p.slides) ? p.slides.length : 0}</td>
                <td className="px-4 py-3 text-slate-400">
                  {p.settings?.estimatedMinutes ? `${p.settings.estimatedMinutes} min` : '—'}
                </td>
                <td className="px-4 py-3 text-slate-500">
                  {new Date(p.updated_at || p.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <a
                      href={`/p/${p.slug}${p.share_token ? `?token=${p.share_token}` : ''}`}
                      target="_blank"
                      rel="noopener"
                      className="text-slate-500 hover:text-cyan-400 transition-colors"
                      title="Preview"
                    >
                      <ExternalLink size={14} />
                    </a>
                    {(p.status === 'shareable' || p.status === 'private') && p.share_token && (
                      <button
                        onClick={(e) => { e.stopPropagation(); copyShareUrl(p.slug, p.share_token) }}
                        className="text-slate-500 hover:text-purple-400 transition-colors"
                        title="Copy share URL"
                      >
                        <Copy size={14} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
