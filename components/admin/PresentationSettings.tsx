'use client'

import { useState } from 'react'
import { Copy, Loader2, Sparkles } from 'lucide-react'
import type { Presentation, PresentationSettings as Settings } from '@/lib/presentation/slide-types'

interface Props {
  presentation: Presentation
  onChange: (updates: Partial<Presentation>) => void
}

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' },
  { value: 'published', label: 'Published', color: 'bg-green-500/20 text-green-300 border-green-500/30' },
  { value: 'private', label: 'Private', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  { value: 'shareable', label: 'Shareable', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
]

export default function PresentationSettingsPanel({ presentation, onChange }: Props) {
  const [seoLoading, setSeoLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState(false)
  const [tagsInput, setTagsInput] = useState(presentation.tags?.join(', ') || '')

  const settings = presentation.settings || {} as Settings

  const updateSettings = (updates: Partial<Settings>) => {
    onChange({ settings: { ...settings, ...updates } })
  }

  const shareUrl = presentation.share_token
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/p/${presentation.slug}?token=${presentation.share_token}`
    : `${typeof window !== 'undefined' ? window.location.origin : ''}/p/${presentation.slug}`

  const handleGenerateSeo = async () => {
    setSeoLoading(true)
    try {
      const res = await fetch('/api/admin/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'presentation_seo',
          context: { title: presentation.title, slides: presentation.slides?.slice(0, 5) },
        }),
      })
      const data = await res.json()
      if (data.result) {
        const seo = typeof data.result === 'string' ? JSON.parse(data.result) : data.result
        onChange({
          seo_title: seo.seo_title,
          seo_description: seo.seo_description,
          seo_keywords: seo.seo_keywords,
        })
      }
    } catch (err) { console.error('SEO generation error:', err) }
    setSeoLoading(false)
  }

  const handleGenerateSocial = async () => {
    setSocialLoading(true)
    try {
      const res = await fetch('/api/admin/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'presentation_social',
          context: { title: presentation.title, description: presentation.description, url: shareUrl, slides: presentation.slides?.slice(0, 5) },
        }),
      })
      const data = await res.json()
      if (data.result) {
        const social = typeof data.result === 'string' ? JSON.parse(data.result) : data.result
        onChange({
          social_post_text: social.postText || social.post_text,
          social_hashtags: social.hashtags,
        })
      }
    } catch (err) { console.error('Social generation error:', err) }
    setSocialLoading(false)
  }

  return (
    <div className="w-80 flex-shrink-0 overflow-y-auto p-4 space-y-6" style={{ borderLeft: '1px solid rgba(255,255,255,0.06)' }}>
      {/* Status */}
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-2">Status</label>
        <div className="grid grid-cols-2 gap-2">
          {STATUS_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => onChange({ status: opt.value as Presentation['status'] })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                presentation.status === opt.value ? opt.color : 'border-transparent text-slate-500 hover:bg-white/5'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Share URL */}
      {(presentation.status === 'shareable' || presentation.status === 'published') && (
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Share URL</label>
          <div className="flex gap-1">
            <input type="text" readOnly value={shareUrl} className="admin-input flex-1 text-[10px]" />
            <button
              onClick={() => { navigator.clipboard.writeText(shareUrl); alert('Copied!') }}
              className="p-2 text-slate-500 hover:text-cyan-400 transition-colors"
            >
              <Copy size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Theme */}
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-2">Theme</label>
        <select value={settings.theme || 'default'} onChange={e => updateSettings({ theme: e.target.value as Settings['theme'] })} className="admin-input w-full">
          <option value="default">Default (Navy)</option>
          <option value="dark">Dark (Black)</option>
          <option value="light">Light (White)</option>
        </select>
      </div>

      {/* Transition */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Transition</label>
          <select value={settings.transition || 'fade'} onChange={e => updateSettings({ transition: e.target.value as Settings['transition'] })} className="admin-input w-full">
            <option value="fade">Fade</option>
            <option value="slide">Slide</option>
            <option value="none">None</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Aspect Ratio</label>
          <select value={settings.aspectRatio || '16:9'} onChange={e => updateSettings({ aspectRatio: e.target.value as Settings['aspectRatio'] })} className="admin-input w-full">
            <option value="16:9">16:9</option>
            <option value="4:3">4:3</option>
          </select>
        </div>
      </div>

      {/* Duration */}
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">Estimated Duration (minutes)</label>
        <input type="number" value={settings.estimatedMinutes || 30} onChange={e => updateSettings({ estimatedMinutes: parseInt(e.target.value) || 30 })} className="admin-input w-full" />
      </div>

      {/* Cover Image */}
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">Cover Image URL</label>
        <input type="text" value={presentation.cover_image_url || ''} onChange={e => onChange({ cover_image_url: e.target.value })} placeholder="https://..." className="admin-input w-full" />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">Tags (comma-separated)</label>
        <input
          type="text"
          value={tagsInput}
          onChange={e => {
            setTagsInput(e.target.value)
            onChange({ tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })
          }}
          className="admin-input w-full"
          placeholder="conference, AI, emergency services"
        />
      </div>

      {/* Author */}
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">Author</label>
        <input type="text" value={presentation.author_name || ''} onChange={e => onChange({ author_name: e.target.value })} className="admin-input w-full" />
      </div>

      {/* SEO */}
      <div className="pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400">SEO</span>
          <button onClick={handleGenerateSeo} disabled={seoLoading} className="flex items-center gap-1 text-[10px] text-purple-400 hover:text-purple-300">
            {seoLoading ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />} Generate
          </button>
        </div>
        <div className="space-y-3">
          <input type="text" value={presentation.seo_title || ''} onChange={e => onChange({ seo_title: e.target.value })} placeholder="SEO Title" className="admin-input w-full text-xs" />
          <textarea value={presentation.seo_description || ''} onChange={e => onChange({ seo_description: e.target.value })} placeholder="Meta description" className="admin-input w-full text-xs" rows={2} />
          <input type="text" value={presentation.seo_keywords || ''} onChange={e => onChange({ seo_keywords: e.target.value })} placeholder="Keywords" className="admin-input w-full text-xs" />
        </div>
      </div>

      {/* Social */}
      <div className="pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400">Social Post</span>
          <button onClick={handleGenerateSocial} disabled={socialLoading} className="flex items-center gap-1 text-[10px] text-purple-400 hover:text-purple-300">
            {socialLoading ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />} Generate
          </button>
        </div>
        <div className="space-y-3">
          <textarea value={presentation.social_post_text || ''} onChange={e => onChange({ social_post_text: e.target.value })} placeholder="LinkedIn post text..." className="admin-input w-full text-xs" rows={4} />
          <input type="text" value={presentation.social_hashtags || ''} onChange={e => onChange({ social_hashtags: e.target.value })} placeholder="#hashtags" className="admin-input w-full text-xs" />
        </div>
      </div>
    </div>
  )
}
