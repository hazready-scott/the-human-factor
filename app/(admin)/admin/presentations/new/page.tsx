'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function NewPresentationPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [saving, setSaving] = useState(false)

  const handleCreate = async () => {
    if (!title.trim()) return
    setSaving(true)

    try {
      const res = await fetch('/api/admin/presentations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          subtitle: subtitle.trim() || null,
          slides: [
            {
              id: crypto.randomUUID(),
              type: 'title',
              title: title.trim(),
              subtitle: subtitle.trim() || undefined,
              author: 'The Human Factor',
              date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            }
          ],
        }),
      })

      const data = await res.json()
      if (res.ok && data.presentation) {
        router.push(`/admin/presentations/${data.presentation.id}/edit`)
      } else {
        alert(data.error || 'Failed to create presentation')
        setSaving(false)
      }
    } catch {
      alert('Failed to create presentation')
      setSaving(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-12">
      <h1 className="text-2xl font-bold text-white mb-8">New Presentation</h1>

      <div className="admin-card space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g., Research to Reality: AI Emergency Intelligence"
            className="admin-input w-full text-lg"
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Subtitle (optional)</label>
          <input
            type="text"
            value={subtitle}
            onChange={e => setSubtitle(e.target.value)}
            placeholder="e.g., CRHNet 2026 Symposium"
            className="admin-input w-full"
          />
        </div>

        <button
          onClick={handleCreate}
          disabled={!title.trim() || saving}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#06b6d4] text-white rounded-lg font-semibold hover:bg-[#0891b2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? <><Loader2 size={18} className="animate-spin" /> Creating...</> : 'Create Presentation'}
        </button>
      </div>
    </div>
  )
}
