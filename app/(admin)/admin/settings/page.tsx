'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Upload, Check } from 'lucide-react'

const KEY = 'default_event_hero_url'

export default function SettingsPage() {
  const [heroUrl, setHeroUrl] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [savedAt, setSavedAt] = useState<number | null>(null)
  const fileRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    fetch('/api/admin/site-settings')
      .then(r => r.ok ? r.json() : {})
      .then((data: Record<string, unknown>) => {
        const v = data[KEY]
        if (typeof v === 'string') setHeroUrl(v)
        else if (v && typeof v === 'object' && 'url' in v && typeof (v as { url: unknown }).url === 'string') {
          setHeroUrl((v as { url: string }).url)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const handleUpload = async (file: File) => {
    setUploading(true)
    setError(null)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('kind', 'image')
      fd.append('slug', 'site-defaults')
      const res = await fetch('/api/admin/events/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      setHeroUrl(data.url)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/site-settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [KEY]: heroUrl ? { url: heroUrl } : null }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Save failed')
      }
      setSavedAt(Date.now())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-8 text-slate-500">Loading...</div>

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-white mb-2">Site Settings</h1>
      <p className="text-sm text-slate-500 mb-8">Site-wide defaults used by public pages.</p>

      <section className="admin-card p-6">
        <h2 className="text-base font-semibold text-white mb-1">Default Event Hero Image</h2>
        <p className="text-xs text-slate-500 mb-4">
          Used on event landing pages when an event has no hero image of its own. Recommended: 1920×1080 or wider.
        </p>

        {heroUrl && (
          <div className="relative w-full aspect-[16/9] mb-4 rounded-lg overflow-hidden bg-black/40">
            <Image src={heroUrl} alt="Default event hero" fill className="object-cover" unoptimized />
          </div>
        )}

        <div className="flex flex-wrap gap-2 items-center">
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(f) }}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 text-slate-200 rounded-lg text-sm border border-white/10 disabled:opacity-50"
          >
            <Upload size={14} />
            {uploading ? 'Uploading...' : (heroUrl ? 'Replace image' : 'Upload image')}
          </button>
          {heroUrl && (
            <button
              type="button"
              onClick={() => setHeroUrl('')}
              className="px-3 py-2 text-sm text-slate-500 hover:text-red-400"
            >
              Remove
            </button>
          )}
        </div>

        <div className="mt-3">
          <label className="block text-xs font-medium text-slate-500 mb-1">URL</label>
          <input
            value={heroUrl}
            onChange={e => setHeroUrl(e.target.value)}
            placeholder="https://..."
            className="admin-input w-full text-xs"
          />
        </div>

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-[#06b6d4] text-white rounded-lg text-sm font-semibold hover:bg-[#0891b2] disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
          {savedAt && <span className="flex items-center gap-1 text-xs text-green-400"><Check size={12} /> Saved</span>}
        </div>
      </section>
    </div>
  )
}
