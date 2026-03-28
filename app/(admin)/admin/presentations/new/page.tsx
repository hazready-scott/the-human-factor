'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Sparkles, ChevronRight, ChevronLeft, Check } from 'lucide-react'

interface IntakeData {
  title: string
  subtitle: string
  author: string
  credentials: string
  disclosures: string
  description: string
  keyPoints: string
  audience: string
  tone: string
  duration: number
  presentationType: string
}

interface Approach {
  title: string
  storyline: string
  slideCount: number
  structure: string[]
}

const INITIAL: IntakeData = {
  title: '',
  subtitle: '',
  author: 'Scott Ramey',
  credentials: '',
  disclosures: '',
  description: '',
  keyPoints: '',
  audience: '',
  tone: 'Professional',
  duration: 30,
  presentationType: 'Conference Talk',
}

const TONES = ['Professional', 'Academic', 'Conversational', 'Inspirational', 'Technical']
const TYPES = ['Conference Talk', 'Webinar', 'Workshop', 'Pitch Deck', 'Training', 'Marketing', 'Lecture']

export default function NewPresentationPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [data, setData] = useState<IntakeData>(INITIAL)
  const [generating, setGenerating] = useState(false)
  const [approaches, setApproaches] = useState<Approach[] | null>(null)
  const [selectedApproach, setSelectedApproach] = useState<number | null>(null)
  const [building, setBuilding] = useState(false)

  const update = (field: keyof IntakeData, value: string | number) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  const canNext = () => {
    if (step === 0) return data.title.trim() && data.description.trim()
    if (step === 1) return data.audience.trim()
    return true
  }

  const handleGenerateApproaches = async () => {
    setGenerating(true)
    try {
      const res = await fetch('/api/admin/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'presentation_approaches',
          context: data,
        }),
      })
      const result = await res.json()
      if (result.result) {
        const parsed = typeof result.result === 'string' ? JSON.parse(result.result) : result.result
        setApproaches(Array.isArray(parsed) ? parsed : [parsed])
        setStep(3)
      }
    } catch (err) {
      console.error('Approach generation error:', err)
      alert('Failed to generate approaches')
    }
    setGenerating(false)
  }

  const handleBuildPresentation = async () => {
    if (selectedApproach === null || !approaches) return
    setBuilding(true)
    try {
      const approach = approaches[selectedApproach]
      const res = await fetch('/api/admin/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'presentation_outline',
          context: {
            ...data,
            topic: data.title,
            selectedApproach: approach,
          },
        }),
      })
      const result = await res.json()
      if (result.result) {
        const slides = typeof result.result === 'string' ? JSON.parse(result.result) : result.result

        // Create the presentation with generated slides
        const createRes = await fetch('/api/admin/presentations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: data.title,
            subtitle: data.subtitle || null,
            description: data.description,
            author_name: data.author,
            slides: Array.isArray(slides) ? slides : [],
            settings: {
              theme: 'default',
              transition: 'fade',
              transitionSpeed: 300,
              aspectRatio: '16:9',
              showSlideNumbers: true,
              showProgressBar: true,
              brandColor: '#06b6d4',
              estimatedMinutes: data.duration,
              credentials: data.credentials,
              disclosures: data.disclosures,
            },
          }),
        })
        const createData = await createRes.json()
        if (createRes.ok && createData.presentation) {
          router.push(`/admin/presentations/${createData.presentation.id}/edit`)
        } else {
          alert(createData.error || 'Failed to create presentation')
        }
      }
    } catch (err) {
      console.error('Build error:', err)
      alert('Failed to build presentation')
    }
    setBuilding(false)
  }

  const steps = [
    { label: 'Topic', icon: '1' },
    { label: 'Audience', icon: '2' },
    { label: 'Review', icon: '3' },
    { label: 'Approach', icon: '4' },
  ]

  return (
    <div className="max-w-3xl mx-auto mt-8">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 mb-10">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              i === step ? 'bg-cyan-500 text-white' : i < step ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-slate-600'
            }`}>
              {i < step ? <Check size={14} /> : s.icon}
            </div>
            <span className={`text-xs ${i === step ? 'text-white' : 'text-slate-600'}`}>{s.label}</span>
            {i < steps.length - 1 && <div className="w-8 h-px bg-white/10" />}
          </div>
        ))}
      </div>

      {/* Step 0: Topic & Purpose */}
      {step === 0 && (
        <div className="admin-card space-y-5">
          <h2 className="text-xl font-bold text-white">Tell me about your presentation</h2>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Title</label>
            <input type="text" value={data.title} onChange={e => update('title', e.target.value)} placeholder="e.g., Research to Reality: AI Emergency Intelligence" className="admin-input w-full text-lg" autoFocus />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Subtitle / Event (optional)</label>
            <input type="text" value={data.subtitle} onChange={e => update('subtitle', e.target.value)} placeholder="e.g., CRHNet 2026 Symposium" className="admin-input w-full" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Author / Presenter</label>
              <input type="text" value={data.author} onChange={e => update('author', e.target.value)} className="admin-input w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Credentials</label>
              <input type="text" value={data.credentials} onChange={e => update('credentials', e.target.value)} placeholder="PhD(c), MASc, etc." className="admin-input w-full" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Disclosures / Conflicts of Interest</label>
            <textarea value={data.disclosures} onChange={e => update('disclosures', e.target.value)} placeholder="e.g., Co-founder of HazReady Corporation. Research funded by NSERC Alliance Grant." className="admin-input w-full" rows={2} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Describe your presentation</label>
            <textarea value={data.description} onChange={e => update('description', e.target.value)} placeholder="Tell me what this presentation is about, what story you want to tell, what problem you're addressing..." className="admin-input w-full" rows={4} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Learning Objectives / Key Points (one per line)</label>
            <textarea value={data.keyPoints} onChange={e => update('keyPoints', e.target.value)} placeholder="- Understand how AI can augment emergency decision-making&#10;- Learn the human factors principles behind effective AI integration&#10;- See real-world examples of AI tools in resource-constrained agencies" className="admin-input w-full" rows={4} />
          </div>
        </div>
      )}

      {/* Step 1: Audience & Format */}
      {step === 1 && (
        <div className="admin-card space-y-5">
          <h2 className="text-xl font-bold text-white">Who is this for?</h2>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Target Audience</label>
            <textarea value={data.audience} onChange={e => update('audience', e.target.value)} placeholder="Who will be in the room? What do they know? What do they care about?" className="admin-input w-full" rows={3} />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Type</label>
              <select value={data.presentationType} onChange={e => update('presentationType', e.target.value)} className="admin-input w-full">
                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Tone</label>
              <select value={data.tone} onChange={e => update('tone', e.target.value)} className="admin-input w-full">
                {TONES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Duration (min)</label>
              <input type="number" value={data.duration} onChange={e => update('duration', parseInt(e.target.value) || 30)} className="admin-input w-full" />
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Review & Generate */}
      {step === 2 && (
        <div className="admin-card space-y-5">
          <h2 className="text-xl font-bold text-white">Review & Generate Approaches</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Title:</span><span className="text-white font-medium">{data.title}</span></div>
            {data.subtitle && <div className="flex justify-between"><span className="text-slate-500">Subtitle:</span><span className="text-slate-300">{data.subtitle}</span></div>}
            <div className="flex justify-between"><span className="text-slate-500">Author:</span><span className="text-slate-300">{data.author} {data.credentials && `(${data.credentials})`}</span></div>
            {data.disclosures && <div><span className="text-slate-500">Disclosures:</span><p className="text-slate-400 mt-1">{data.disclosures}</p></div>}
            <div><span className="text-slate-500">Description:</span><p className="text-slate-300 mt-1">{data.description}</p></div>
            {data.keyPoints && <div><span className="text-slate-500">Key Points:</span><p className="text-slate-300 mt-1 whitespace-pre-line">{data.keyPoints}</p></div>}
            <div className="flex gap-6">
              <span className="text-slate-500">Audience: <span className="text-slate-300">{data.audience}</span></span>
            </div>
            <div className="flex gap-6">
              <span className="text-slate-500">Type: <span className="text-slate-300">{data.presentationType}</span></span>
              <span className="text-slate-500">Tone: <span className="text-slate-300">{data.tone}</span></span>
              <span className="text-slate-500">Duration: <span className="text-slate-300">{data.duration} min</span></span>
            </div>
          </div>

          <button
            onClick={handleGenerateApproaches}
            disabled={generating}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-500/20 text-purple-300 rounded-lg font-semibold hover:bg-purple-500/30 transition-colors disabled:opacity-50"
          >
            {generating ? <><Loader2 size={18} className="animate-spin" /> Generating 3 approaches...</> : <><Sparkles size={18} /> Generate Presentation Approaches</>}
          </button>
        </div>
      )}

      {/* Step 3: Choose Approach */}
      {step === 3 && approaches && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white mb-6">Choose Your Approach</h2>

          {approaches.map((approach, i) => (
            <button
              key={i}
              onClick={() => setSelectedApproach(i)}
              className={`w-full text-left admin-card transition-all ${
                selectedApproach === i ? 'ring-2 ring-cyan-500 bg-cyan-500/5' : 'hover:bg-white/5'
              }`}
            >
              <h3 className="text-lg font-bold text-white mb-2">{approach.title || `Approach ${i + 1}`}</h3>
              <p className="text-sm text-slate-400 mb-3">{approach.storyline}</p>
              {approach.structure && approach.structure.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {approach.structure.map((item, j) => (
                    <span key={j} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-500">{item}</span>
                  ))}
                </div>
              )}
              {approach.slideCount && (
                <p className="text-xs text-slate-600 mt-2">{approach.slideCount} slides</p>
              )}
            </button>
          ))}

          <button
            onClick={handleBuildPresentation}
            disabled={selectedApproach === null || building}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#06b6d4] text-white rounded-lg font-semibold hover:bg-[#0891b2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {building ? <><Loader2 size={18} className="animate-spin" /> Building presentation...</> : 'Build This Presentation'}
          </button>
        </div>
      )}

      {/* Navigation */}
      {step < 3 && (
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="flex items-center gap-1 px-4 py-2 text-sm text-slate-500 hover:text-white transition-colors disabled:opacity-30"
          >
            <ChevronLeft size={16} /> Back
          </button>
          {step < 2 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canNext()}
              className="flex items-center gap-1 px-4 py-2 bg-[#06b6d4] text-white rounded-lg text-sm font-semibold hover:bg-[#0891b2] transition-colors disabled:opacity-50"
            >
              Next <ChevronRight size={16} />
            </button>
          ) : null}
        </div>
      )}
    </div>
  )
}
