'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Trash2, Eye, Loader2, Play } from 'lucide-react'
import SlideNavigator from './SlideNavigator'
import SlideEditorPanel from './SlideEditorPanel'
import PresentationSettingsPanel from './PresentationSettings'
import type { Presentation, Slide } from '@/lib/presentation/slide-types'

interface Props {
  presentation: Presentation
}

export default function PresentationEditor({ presentation: initial }: Props) {
  const router = useRouter()
  const [presentation, setPresentation] = useState<Presentation>(initial)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [saving, setSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null)
  const presentationRef = useRef(presentation)

  // Keep ref in sync for save handler
  useEffect(() => { presentationRef.current = presentation }, [presentation])

  const slides = presentation.slides || []
  const selectedSlide = slides[selectedIndex]

  // Auto-save after 3 seconds of inactivity
  const scheduleSave = useCallback(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => {
      doSave()
    }, 3000)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const updatePresentation = useCallback((updates: Partial<Presentation>) => {
    setPresentation(prev => ({ ...prev, ...updates }))
    setHasChanges(true)
    scheduleSave()
  }, [scheduleSave])

  const updateSlide = useCallback((updated: Slide) => {
    setPresentation(prev => {
      const newSlides = [...prev.slides]
      const idx = newSlides.findIndex(s => s.id === updated.id)
      if (idx >= 0) newSlides[idx] = updated
      return { ...prev, slides: newSlides }
    })
    setHasChanges(true)
    scheduleSave()
  }, [scheduleSave])

  const handleReorder = useCallback((newSlides: Slide[]) => {
    setPresentation(prev => ({ ...prev, slides: newSlides }))
    setHasChanges(true)
    scheduleSave()
  }, [scheduleSave])

  // BUG FIX: Use functional setState for both slides and selectedIndex
  const handleAddSlide = useCallback((slide: Slide) => {
    setPresentation(prev => {
      const newSlides = [...prev.slides, slide]
      // Set index inside the same tick using the actual new length
      setTimeout(() => setSelectedIndex(newSlides.length - 1), 0)
      return { ...prev, slides: newSlides }
    })
    setHasChanges(true)
    scheduleSave()
  }, [scheduleSave])

  const handleDeleteSlide = useCallback((index: number) => {
    setPresentation(prev => {
      if (prev.slides.length <= 1) return prev
      const newSlides = prev.slides.filter((_, i) => i !== index)
      return { ...prev, slides: newSlides }
    })
    setSelectedIndex(prev => {
      if (prev >= index && prev > 0) return prev - 1
      return prev
    })
    setHasChanges(true)
    scheduleSave()
  }, [scheduleSave])

  const doSave = async () => {
    const current = presentationRef.current
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/presentations/${current.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: current.title,
          subtitle: current.subtitle,
          description: current.description,
          slides: current.slides,
          settings: current.settings,
          status: current.status,
          cover_image_url: current.cover_image_url,
          author_name: current.author_name,
          tags: current.tags,
          seo_title: current.seo_title,
          seo_description: current.seo_description,
          seo_keywords: current.seo_keywords,
          social_post_text: current.social_post_text,
          social_hashtags: current.social_hashtags,
        }),
      })
      if (res.ok) {
        // Don't overwrite local state — just mark as saved
        setHasChanges(false)
      }
    } catch (err) {
      console.error('Save error:', err)
    }
    setSaving(false)
  }

  const handleSave = () => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    doSave()
  }

  const handleDelete = async () => {
    if (!confirm('Delete this entire presentation? This cannot be undone.')) return
    await fetch(`/api/admin/presentations/${presentation.id}`, { method: 'DELETE' })
    router.push('/admin/presentations')
  }

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    }
  }, [])

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)]">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <input
            type="text"
            value={presentation.title}
            onChange={e => updatePresentation({ title: e.target.value })}
            className="bg-transparent text-lg font-bold text-white border-none outline-none flex-1 min-w-0"
            placeholder="Presentation title"
          />
          {hasChanges && <span className="text-[10px] text-yellow-400 flex-shrink-0">unsaved</span>}
          {saving && <Loader2 size={12} className="animate-spin text-cyan-400 flex-shrink-0" />}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <a
            href={`/p/${presentation.slug}${presentation.share_token ? `?token=${presentation.share_token}` : ''}`}
            target="_blank"
            rel="noopener"
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <Eye size={14} /> Preview
          </a>
          <a
            href={`/p/${presentation.slug}${presentation.share_token ? `?token=${presentation.share_token}` : ''}`}
            target="_blank"
            rel="noopener"
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <Play size={14} /> Present
          </a>
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-500 hover:text-red-400 transition-colors"
          >
            <Trash2 size={14} />
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-[#06b6d4] text-white rounded-lg text-sm font-semibold hover:bg-[#0891b2] transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Save
          </button>
        </div>
      </div>

      {/* Three-column layout */}
      <div className="flex flex-1 min-h-0">
        <SlideNavigator
          slides={slides}
          selectedIndex={selectedIndex}
          onSelect={setSelectedIndex}
          onReorder={handleReorder}
          onAdd={handleAddSlide}
          onDelete={handleDeleteSlide}
        />

        {selectedSlide ? (
          <SlideEditorPanel
            slide={selectedSlide}
            onChange={updateSlide}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500">
            Add a slide to get started
          </div>
        )}

        <PresentationSettingsPanel
          presentation={presentation}
          onChange={updatePresentation}
        />
      </div>
    </div>
  )
}
