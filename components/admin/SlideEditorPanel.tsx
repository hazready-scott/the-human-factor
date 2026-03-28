'use client'

import { useState } from 'react'
import { Loader2, Sparkles } from 'lucide-react'
import { SLIDE_TYPE_META, type Slide, type ContentSlide, type TitleSlide, type SectionSlide, type TwoColumnSlide, type ImageSlide, type QuoteSlide, type DataSlide, type ListSlide, type ComparisonSlide, type ClosingSlide, type InteractiveSlide as InteractiveSlideType, type PollSlide } from '@/lib/presentation/slide-types'

interface Props {
  slide: Slide
  onChange: (updated: Slide) => void
}

// ── Shared field components ──

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
      {children}
    </div>
  )
}

function TextInput({ value, onChange, placeholder, large }: { value: string; onChange: (v: string) => void; placeholder?: string; large?: boolean }) {
  return (
    <input
      type="text"
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={`admin-input w-full ${large ? 'text-lg font-semibold' : ''}`}
    />
  )
}

function TextArea({ value, onChange, placeholder, rows }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <textarea
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows || 3}
      className="admin-input w-full resize-y"
    />
  )
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} className="admin-input w-full">
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )
}

// ── Per-type editors ──

function ImageUploadField({ label, value, onChange, slideContext }: { label: string; value: string; onChange: (url: string) => void; slideContext?: { slideType: string; slide: Record<string, unknown>; presentationTitle?: string } }) {
  const [uploading, setUploading] = useState(false)
  const [suggesting, setSuggesting] = useState(false)
  const [suggestions, setSuggestions] = useState<Array<{ concept: string; searchTerms: string; style: string }> | null>(null)
  const [searching, setSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<Array<{ id: string; url: string; thumb: string; alt: string; credit: string; creditLink: string }> | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { alert('Image must be under 2MB'); return }
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.url) onChange(data.url)
      else alert(data.error || 'Upload failed')
    } catch { alert('Upload failed') }
    setUploading(false)
  }

  const handleSuggest = async () => {
    if (!slideContext) return
    setSuggesting(true)
    setSuggestions(null)
    setSearchResults(null)
    try {
      const res = await fetch('/api/admin/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'slide_image_suggestion', context: slideContext }),
      })
      const data = await res.json()
      if (data.result) setSuggestions(data.result)
    } catch { /* ignore */ }
    setSuggesting(false)
  }

  const handleSearch = async (query: string) => {
    setSearching(true)
    setSearchResults(null)
    setSearchQuery(query)
    try {
      const res = await fetch(`/api/admin/image-search?q=${encodeURIComponent(query)}`)
      const data = await res.json()
      if (data.images) setSearchResults(data.images)
      else if (data.error) alert(data.error)
    } catch { /* ignore */ }
    setSearching(false)
  }

  const selectImage = (url: string) => {
    onChange(url)
    setSearchResults(null)
    setSuggestions(null)
  }

  return (
    <Field label={label}>
      <div className="space-y-2">
        {value && <img src={value} alt="" className="w-full h-32 object-cover rounded-lg" />}
        <div className="flex gap-2">
          <input type="text" value={value || ''} onChange={e => onChange(e.target.value)} placeholder="https://..." className="admin-input flex-1 text-xs" />
          <label className={`px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${uploading ? 'bg-white/5 text-slate-600' : 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30'}`}>
            {uploading ? '...' : 'Upload'}
            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
          </label>
          {slideContext && (
            <button onClick={handleSuggest} disabled={suggesting} className="px-3 py-2 rounded-lg text-xs font-medium transition-colors bg-violet-500/20 text-violet-400 hover:bg-violet-500/30 disabled:opacity-50 flex items-center gap-1">
              {suggesting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
              AI
            </button>
          )}
        </div>

        {/* AI Suggestions — click one to search for images */}
        {suggestions && !searchResults && (
          <div className="space-y-2 mt-2">
            <p className="text-[10px] text-slate-600 uppercase tracking-wider">Choose an image concept</p>
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => handleSearch(s.searchTerms)}
                className="w-full text-left p-2.5 rounded-lg bg-white/5 border border-white/10 hover:border-violet-500/40 hover:bg-violet-500/10 transition-colors space-y-1"
              >
                <p className="text-xs text-slate-300">{s.concept}</p>
                <p className="text-[10px] text-violet-400/70">{s.style}</p>
              </button>
            ))}
            <button onClick={() => setSuggestions(null)} className="text-[10px] text-slate-600 hover:text-slate-400">Dismiss</button>
          </div>
        )}

        {/* Searching indicator */}
        {searching && (
          <div className="flex items-center gap-2 py-3 justify-center">
            <Loader2 className="w-4 h-4 animate-spin text-violet-400" />
            <span className="text-xs text-slate-500">Searching images...</span>
          </div>
        )}

        {/* Image search results grid */}
        {searchResults && (
          <div className="space-y-2 mt-2">
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-slate-600 uppercase tracking-wider">Select an image</p>
              <button onClick={() => { setSearchResults(null); setSuggestions(null) }} className="text-[10px] text-slate-600 hover:text-slate-400">Close</button>
            </div>
            {searchResults.length === 0 ? (
              <p className="text-xs text-slate-500 py-2">No images found for &ldquo;{searchQuery}&rdquo;</p>
            ) : (
              <div className="grid grid-cols-3 gap-1.5">
                {searchResults.map(img => (
                  <button
                    key={img.id}
                    onClick={() => selectImage(img.url)}
                    className="relative group rounded-lg overflow-hidden aspect-video hover:ring-2 ring-cyan-500 transition-all"
                  >
                    <img src={img.thumb} alt={img.alt} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <span className="text-white text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity">Select</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {searchResults.length > 0 && (
              <p className="text-[9px] text-slate-700">Photos via Unsplash</p>
            )}
            <button onClick={() => { setSearchResults(null) }} className="text-[10px] text-violet-400 hover:text-violet-300">← Back to suggestions</button>
          </div>
        )}
      </div>
    </Field>
  )
}

function TitleEditor({ slide, onChange }: { slide: TitleSlide; onChange: (s: TitleSlide) => void }) {
  return (
    <div className="space-y-4">
      <Field label="Title"><TextInput value={slide.title} onChange={v => onChange({ ...slide, title: v })} placeholder="Presentation title" large /></Field>
      <Field label="Subtitle"><TextInput value={slide.subtitle || ''} onChange={v => onChange({ ...slide, subtitle: v })} placeholder="Subtitle or event name" /></Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Author"><TextInput value={slide.author || ''} onChange={v => onChange({ ...slide, author: v })} /></Field>
        <Field label="Date"><TextInput value={slide.date || ''} onChange={v => onChange({ ...slide, date: v })} placeholder="March 2026" /></Field>
      </div>
      <ImageUploadField
        label="Title Image"
        value={slide.image?.url || ''}
        onChange={url => onChange({ ...slide, image: url ? { url, alt: '', position: slide.image?.position || 'background', opacity: slide.image?.opacity ?? 0.3 } : undefined })}
        slideContext={{ slideType: 'title', slide: slide as unknown as Record<string, unknown> }}
      />
      {slide.image?.url && (
        <div className="grid grid-cols-2 gap-4">
          <Field label="Image Position">
            <Select
              value={slide.image.position || 'background'}
              onChange={v => onChange({ ...slide, image: { ...slide.image!, position: v as 'background' | 'right' | 'left' } })}
              options={[
                { value: 'background', label: 'Background' },
                { value: 'right', label: 'Right side' },
                { value: 'left', label: 'Left side' },
              ]}
            />
          </Field>
          {slide.image.position === 'background' && (
            <Field label={`Opacity (${Math.round((slide.image.opacity ?? 0.3) * 100)}%)`}>
              <input
                type="range"
                min={0} max={100} step={5}
                value={Math.round((slide.image.opacity ?? 0.3) * 100)}
                onChange={e => onChange({ ...slide, image: { ...slide.image!, opacity: parseInt(e.target.value) / 100 } })}
                className="w-full mt-2"
              />
            </Field>
          )}
        </div>
      )}
    </div>
  )
}

function SectionEditor({ slide, onChange }: { slide: SectionSlide; onChange: (s: SectionSlide) => void }) {
  return (
    <div className="space-y-4">
      <Field label="Heading"><TextInput value={slide.heading} onChange={v => onChange({ ...slide, heading: v })} placeholder="Section heading" large /></Field>
      <Field label="Subheading"><TextInput value={slide.subheading || ''} onChange={v => onChange({ ...slide, subheading: v })} /></Field>
      <ImageUploadField
        label="Background Image (optional)"
        value={slide.image?.url || ''}
        onChange={url => onChange({ ...slide, image: url ? { url, position: 'background', opacity: slide.image?.opacity ?? 0.2 } : undefined })}
        slideContext={{ slideType: 'section', slide: slide as unknown as Record<string, unknown> }}
      />
      {slide.image?.url && (
        <Field label={`Opacity (${Math.round((slide.image.opacity ?? 0.2) * 100)}%)`}>
          <input type="range" min={0} max={100} step={5} value={Math.round((slide.image.opacity ?? 0.2) * 100)} onChange={e => onChange({ ...slide, image: { ...slide.image!, opacity: parseInt(e.target.value) / 100 } })} className="w-full" />
        </Field>
      )}
    </div>
  )
}

function ContentEditor({ slide, onChange }: { slide: ContentSlide; onChange: (s: ContentSlide) => void }) {
  return (
    <div className="space-y-4">
      <Field label="Heading"><TextInput value={slide.heading} onChange={v => onChange({ ...slide, heading: v })} placeholder="Slide heading" large /></Field>
      <Field label="Body (HTML)"><TextArea value={slide.body} onChange={v => onChange({ ...slide, body: v })} placeholder="<p>Slide content...</p>" rows={6} /></Field>
      <ImageUploadField
        label="Image"
        value={slide.image?.url || ''}
        onChange={url => onChange({ ...slide, image: url ? { url, alt: slide.image?.alt || '', position: slide.image?.position || 'right', size: slide.image?.size || 'medium' } : undefined })}
        slideContext={{ slideType: 'content', slide: slide as unknown as Record<string, unknown> }}
      />
      {slide.image?.url && (
        <div className="grid grid-cols-2 gap-4">
          <Field label="Image Position">
            <Select value={slide.image?.position || 'right'} onChange={v => onChange({ ...slide, image: { ...slide.image!, position: v as 'right' | 'left' | 'bottom' } })} options={[{ value: 'right', label: 'Right' }, { value: 'left', label: 'Left' }, { value: 'bottom', label: 'Bottom' }]} />
          </Field>
          <Field label="Image Size">
            <Select value={slide.image?.size || 'medium'} onChange={v => onChange({ ...slide, image: { ...slide.image!, size: v as 'small' | 'medium' | 'large' } })} options={[{ value: 'small', label: 'Small' }, { value: 'medium', label: 'Medium' }, { value: 'large', label: 'Large' }]} />
          </Field>
        </div>
      )}
      <label className="flex items-center gap-2 text-sm text-slate-400">
        <input type="checkbox" checked={slide.reveal || false} onChange={e => onChange({ ...slide, reveal: e.target.checked })} className="rounded" />
        Click-to-reveal content
      </label>
    </div>
  )
}

function TwoColumnEditor({ slide, onChange }: { slide: TwoColumnSlide; onChange: (s: TwoColumnSlide) => void }) {
  return (
    <div className="space-y-4">
      <Field label="Heading"><TextInput value={slide.heading || ''} onChange={v => onChange({ ...slide, heading: v })} placeholder="Optional heading" /></Field>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <p className="text-xs font-semibold text-cyan-400">Left Column</p>
          <Field label="Heading"><TextInput value={slide.left.heading || ''} onChange={v => onChange({ ...slide, left: { ...slide.left, heading: v } })} /></Field>
          <Field label="Body"><TextArea value={slide.left.body} onChange={v => onChange({ ...slide, left: { ...slide.left, body: v } })} rows={4} /></Field>
        </div>
        <div className="space-y-3">
          <p className="text-xs font-semibold text-cyan-400">Right Column</p>
          <Field label="Heading"><TextInput value={slide.right.heading || ''} onChange={v => onChange({ ...slide, right: { ...slide.right, heading: v } })} /></Field>
          <Field label="Body"><TextArea value={slide.right.body} onChange={v => onChange({ ...slide, right: { ...slide.right, body: v } })} rows={4} /></Field>
        </div>
      </div>
    </div>
  )
}

function ImageEditor({ slide, onChange }: { slide: ImageSlide; onChange: (s: ImageSlide) => void }) {
  return (
    <div className="space-y-4">
      <ImageUploadField label="Image" value={slide.url} onChange={url => onChange({ ...slide, url })} slideContext={{ slideType: 'image', slide: slide as unknown as Record<string, unknown> }} />
      <Field label="Alt Text"><TextInput value={slide.alt} onChange={v => onChange({ ...slide, alt: v })} /></Field>
      <Field label="Caption"><TextInput value={slide.caption || ''} onChange={v => onChange({ ...slide, caption: v })} /></Field>
      <Field label="Fit">
        <Select value={slide.fit} onChange={v => onChange({ ...slide, fit: v as 'cover' | 'contain' | 'auto' })} options={[{ value: 'cover', label: 'Cover' }, { value: 'contain', label: 'Contain' }, { value: 'auto', label: 'Auto' }]} />
      </Field>
    </div>
  )
}

function QuoteEditor({ slide, onChange }: { slide: QuoteSlide; onChange: (s: QuoteSlide) => void }) {
  return (
    <div className="space-y-4">
      <Field label="Quote"><TextArea value={slide.quote} onChange={v => onChange({ ...slide, quote: v })} placeholder="The quote text..." rows={4} /></Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Attribution"><TextInput value={slide.attribution || ''} onChange={v => onChange({ ...slide, attribution: v })} placeholder="Person name" /></Field>
        <Field label="Role / Title"><TextInput value={slide.role || ''} onChange={v => onChange({ ...slide, role: v })} placeholder="CEO, Company" /></Field>
      </div>
      <ImageUploadField
        label="Author Photo (optional)"
        value={slide.image?.url || ''}
        onChange={url => onChange({ ...slide, image: url ? { url } : undefined })}
        slideContext={{ slideType: 'quote', slide: slide as unknown as Record<string, unknown> }}
      />
    </div>
  )
}

function DataEditor({ slide, onChange }: { slide: DataSlide; onChange: (s: DataSlide) => void }) {
  return (
    <div className="space-y-4">
      <Field label="Heading"><TextInput value={slide.heading} onChange={v => onChange({ ...slide, heading: v })} large /></Field>
      <Field label="Description"><TextInput value={slide.description || ''} onChange={v => onChange({ ...slide, description: v })} /></Field>
      <Field label="Chart Type">
        <Select value={slide.chartType} onChange={v => onChange({ ...slide, chartType: v as DataSlide['chartType'] })} options={[
          { value: 'bar', label: 'Bar Chart' }, { value: 'line', label: 'Line Chart' },
          { value: 'pie', label: 'Pie Chart' }, { value: 'radar', label: 'Radar' }, { value: 'stat', label: 'Stat Counter' },
        ]} />
      </Field>
      <Field label="Chart Data (JSON)">
        <TextArea value={JSON.stringify(slide.chartData, null, 2)} onChange={v => { try { onChange({ ...slide, chartData: JSON.parse(v) }) } catch { /* invalid json */ } }} rows={6} />
      </Field>
      <Field label="Source Citation"><TextInput value={slide.source || ''} onChange={v => onChange({ ...slide, source: v })} placeholder="Data source" /></Field>
    </div>
  )
}

function ListEditor({ slide, onChange }: { slide: ListSlide; onChange: (s: ListSlide) => void }) {
  const updateItem = (index: number, field: string, value: string) => {
    const items = [...slide.items]
    items[index] = { ...items[index], [field]: value }
    onChange({ ...slide, items })
  }
  const addItem = () => onChange({ ...slide, items: [...slide.items, { text: '' }] })
  const removeItem = (index: number) => onChange({ ...slide, items: slide.items.filter((_, i) => i !== index) })

  return (
    <div className="space-y-4">
      <Field label="Heading"><TextInput value={slide.heading} onChange={v => onChange({ ...slide, heading: v })} large /></Field>
      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-500">Items</label>
        {slide.items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input type="text" value={item.text} onChange={e => updateItem(i, 'text', e.target.value)} placeholder={`Item ${i + 1}`} className="admin-input flex-1" />
            <input type="text" value={item.detail || ''} onChange={e => updateItem(i, 'detail', e.target.value)} placeholder="Detail" className="admin-input w-32" />
            <button onClick={() => removeItem(i)} className="text-slate-600 hover:text-red-400 px-1">&times;</button>
          </div>
        ))}
        <button onClick={addItem} className="text-xs text-cyan-400 hover:text-cyan-300">+ Add item</button>
      </div>
      <label className="flex items-center gap-2 text-sm text-slate-400">
        <input type="checkbox" checked={slide.reveal || false} onChange={e => onChange({ ...slide, reveal: e.target.checked })} className="rounded" />
        Click-to-reveal items
      </label>
    </div>
  )
}

function ComparisonEditor({ slide, onChange }: { slide: ComparisonSlide; onChange: (s: ComparisonSlide) => void }) {
  return (
    <div className="space-y-4">
      <Field label="Heading"><TextInput value={slide.heading || ''} onChange={v => onChange({ ...slide, heading: v })} /></Field>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <Field label="Before Label"><TextInput value={slide.before.label} onChange={v => onChange({ ...slide, before: { ...slide.before, label: v } })} /></Field>
          {slide.before.items.map((item, i) => (
            <input key={i} type="text" value={item} onChange={e => {
              const items = [...slide.before.items]; items[i] = e.target.value
              onChange({ ...slide, before: { ...slide.before, items } })
            }} className="admin-input w-full" placeholder={`Item ${i + 1}`} />
          ))}
          <button onClick={() => onChange({ ...slide, before: { ...slide.before, items: [...slide.before.items, ''] } })} className="text-xs text-cyan-400">+ Add</button>
        </div>
        <div className="space-y-3">
          <Field label="After Label"><TextInput value={slide.after.label} onChange={v => onChange({ ...slide, after: { ...slide.after, label: v } })} /></Field>
          {slide.after.items.map((item, i) => (
            <input key={i} type="text" value={item} onChange={e => {
              const items = [...slide.after.items]; items[i] = e.target.value
              onChange({ ...slide, after: { ...slide.after, items } })
            }} className="admin-input w-full" placeholder={`Item ${i + 1}`} />
          ))}
          <button onClick={() => onChange({ ...slide, after: { ...slide.after, items: [...slide.after.items, ''] } })} className="text-xs text-cyan-400">+ Add</button>
        </div>
      </div>
    </div>
  )
}

function ClosingEditor({ slide, onChange }: { slide: ClosingSlide; onChange: (s: ClosingSlide) => void }) {
  return (
    <div className="space-y-4">
      <Field label="Heading"><TextInput value={slide.heading} onChange={v => onChange({ ...slide, heading: v })} placeholder="Thank you" large /></Field>
      <Field label="Body"><TextArea value={slide.body || ''} onChange={v => onChange({ ...slide, body: v })} /></Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="CTA Label"><TextInput value={slide.cta?.label || ''} onChange={v => onChange({ ...slide, cta: { label: v, url: slide.cta?.url || '' } })} placeholder="Learn More" /></Field>
        <Field label="CTA URL"><TextInput value={slide.cta?.url || ''} onChange={v => onChange({ ...slide, cta: { label: slide.cta?.label || '', url: v } })} placeholder="https://..." /></Field>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Field label="Email"><TextInput value={slide.contact?.email || ''} onChange={v => onChange({ ...slide, contact: { ...slide.contact, email: v } })} /></Field>
        <Field label="Website"><TextInput value={slide.contact?.website || ''} onChange={v => onChange({ ...slide, contact: { ...slide.contact, website: v } })} /></Field>
        <Field label="LinkedIn"><TextInput value={slide.contact?.linkedin || ''} onChange={v => onChange({ ...slide, contact: { ...slide.contact, linkedin: v } })} /></Field>
      </div>
      <Field label="QR Code URL (generates a scannable QR code on the slide)">
        <TextInput value={slide.qrCodeUrl || ''} onChange={v => onChange({ ...slide, qrCodeUrl: v })} placeholder="https://thehumanfactor.ca/contact" />
      </Field>
    </div>
  )
}

function InteractiveEditor({ slide, onChange }: { slide: InteractiveSlideType; onChange: (s: InteractiveSlideType) => void }) {
  return (
    <div className="space-y-4">
      <Field label="Component Name"><TextInput value={slide.component} onChange={v => onChange({ ...slide, component: v })} placeholder="ImageSlider" /></Field>
      <Field label="Props (JSON)">
        <TextArea value={JSON.stringify(slide.props, null, 2)} onChange={v => { try { onChange({ ...slide, props: JSON.parse(v) }) } catch { /* invalid json */ } }} rows={6} />
      </Field>
    </div>
  )
}

function PollEditor({ slide, onChange }: { slide: PollSlide; onChange: (s: PollSlide) => void }) {
  const updateOption = (index: number, value: string) => {
    const options = [...(slide.options || [])]
    options[index] = value
    onChange({ ...slide, options })
  }
  const addOption = () => onChange({ ...slide, options: [...(slide.options || []), ''] })
  const removeOption = (index: number) => onChange({ ...slide, options: (slide.options || []).filter((_, i) => i !== index) })

  return (
    <div className="space-y-4">
      <Field label="Question"><TextInput value={slide.question} onChange={v => onChange({ ...slide, question: v })} placeholder="What do you think about...?" large /></Field>
      <Field label="Poll Type">
        <Select
          value={slide.pollType}
          onChange={v => onChange({ ...slide, pollType: v as PollSlide['pollType'] })}
          options={[
            { value: 'multiple_choice', label: 'Multiple Choice' },
            { value: 'word_cloud', label: 'Word Cloud' },
            { value: 'rating', label: 'Rating Scale' },
            { value: 'open_ended', label: 'Open-Ended' },
          ]}
        />
      </Field>

      {slide.pollType === 'multiple_choice' && (
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-500">Options</label>
          {(slide.options || []).map((opt, i) => (
            <div key={i} className="flex gap-2">
              <span className="text-cyan-400 font-bold text-sm mt-2">{String.fromCharCode(65 + i)}.</span>
              <input type="text" value={opt} onChange={e => updateOption(i, e.target.value)} placeholder={`Option ${i + 1}`} className="admin-input flex-1" />
              <button onClick={() => removeOption(i)} className="text-slate-600 hover:text-red-400 px-1">&times;</button>
            </div>
          ))}
          <button onClick={addOption} className="text-xs text-cyan-400 hover:text-cyan-300">+ Add option</button>
        </div>
      )}

      {slide.pollType === 'rating' && (
        <div className="grid grid-cols-2 gap-4">
          <Field label="Min Value">
            <input type="number" value={slide.settings?.ratingMin ?? 1} onChange={e => onChange({ ...slide, settings: { ...slide.settings, ratingMin: parseInt(e.target.value) || 1 } })} className="admin-input w-full" />
          </Field>
          <Field label="Max Value">
            <input type="number" value={slide.settings?.ratingMax ?? 5} onChange={e => onChange({ ...slide, settings: { ...slide.settings, ratingMax: parseInt(e.target.value) || 5 } })} className="admin-input w-full" />
          </Field>
        </div>
      )}

      <label className="flex items-center gap-2 text-sm text-slate-400">
        <input type="checkbox" checked={slide.settings?.showResultsLive !== false} onChange={e => onChange({ ...slide, settings: { ...slide.settings, showResultsLive: e.target.checked } })} className="rounded" />
        Show results live on screen
      </label>

      {slide.pollSessionId && (
        <div className="p-3 rounded-lg text-xs" style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)' }}>
          <span className="text-cyan-400 font-medium">Poll Session Linked</span>
          <p className="text-slate-500 mt-1 font-mono text-[10px]">{slide.pollSessionId}</p>
        </div>
      )}
    </div>
  )
}

// ── Main Panel ──

export default function SlideEditorPanel({ slide, onChange }: Props) {
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiLoading, setAiLoading] = useState(false)

  const handleAiRefine = async () => {
    if (!aiPrompt.trim()) return
    setAiLoading(true)
    try {
      const res = await fetch('/api/admin/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'slide_refine', context: { slide, instruction: aiPrompt } }),
      })
      const data = await res.json()
      if (data.result) {
        const refined = typeof data.result === 'string' ? JSON.parse(data.result) : data.result
        onChange({ ...refined, id: slide.id })
        setAiPrompt('')
      }
    } catch (err) {
      console.error('AI refine error:', err)
    }
    setAiLoading(false)
  }

  const renderEditor = () => {
    switch (slide.type) {
      case 'title': return <TitleEditor slide={slide as TitleSlide} onChange={onChange as (s: TitleSlide) => void} />
      case 'section': return <SectionEditor slide={slide as SectionSlide} onChange={onChange as (s: SectionSlide) => void} />
      case 'content': return <ContentEditor slide={slide as ContentSlide} onChange={onChange as (s: ContentSlide) => void} />
      case 'two-column': return <TwoColumnEditor slide={slide as TwoColumnSlide} onChange={onChange as (s: TwoColumnSlide) => void} />
      case 'image': return <ImageEditor slide={slide as ImageSlide} onChange={onChange as (s: ImageSlide) => void} />
      case 'quote': return <QuoteEditor slide={slide as QuoteSlide} onChange={onChange as (s: QuoteSlide) => void} />
      case 'data': return <DataEditor slide={slide as DataSlide} onChange={onChange as (s: DataSlide) => void} />
      case 'list': return <ListEditor slide={slide as ListSlide} onChange={onChange as (s: ListSlide) => void} />
      case 'comparison': return <ComparisonEditor slide={slide as ComparisonSlide} onChange={onChange as (s: ComparisonSlide) => void} />
      case 'interactive': return <InteractiveEditor slide={slide as InteractiveSlideType} onChange={onChange as (s: InteractiveSlideType) => void} />
      case 'closing': return <ClosingEditor slide={slide as ClosingSlide} onChange={onChange as (s: ClosingSlide) => void} />
      case 'poll': return <PollEditor slide={slide as PollSlide} onChange={onChange as (s: PollSlide) => void} />
      default: return <p className="text-slate-500">Unknown slide type</p>
    }
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Slide type badge */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 text-slate-500">
            {SLIDE_TYPE_META[slide.type]?.label || slide.type}
          </span>
        </div>

        {/* Type-specific editor */}
        {renderEditor()}

        {/* Speaker notes */}
        <div className="pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <Field label="Speaker Notes">
            <TextArea
              value={slide.notes || ''}
              onChange={v => onChange({ ...slide, notes: v })}
              placeholder="Notes visible only in presenter mode..."
              rows={3}
            />
          </Field>
        </div>

        {/* AI Refine */}
        <div className="pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex gap-2">
            <input
              type="text"
              value={aiPrompt}
              onChange={e => setAiPrompt(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAiRefine()}
              placeholder="AI: How should I improve this slide?"
              className="admin-input flex-1"
            />
            <button
              onClick={handleAiRefine}
              disabled={aiLoading || !aiPrompt.trim()}
              className="flex items-center gap-1.5 px-3 py-2 bg-purple-500/20 text-purple-400 rounded-lg text-xs font-medium hover:bg-purple-500/30 transition-colors disabled:opacity-50"
            >
              {aiLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              Refine
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
