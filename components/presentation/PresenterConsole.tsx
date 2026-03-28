'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { Presentation, Slide, SlideType } from '@/lib/presentation/slide-types'

import TitleSlideRenderer from './slides/TitleSlide'
import SectionSlideRenderer from './slides/SectionSlide'
import ContentSlideRenderer from './slides/ContentSlide'
import TwoColumnSlideRenderer from './slides/TwoColumnSlide'
import ImageSlideRenderer from './slides/ImageSlide'
import QuoteSlideRenderer from './slides/QuoteSlide'
import DataSlideRenderer from './slides/DataSlide'
import ListSlideRenderer from './slides/ListSlide'
import ComparisonSlideRenderer from './slides/ComparisonSlide'
import InteractiveSlideRenderer from './slides/InteractiveSlide'
import ClosingSlideRenderer from './slides/ClosingSlide'

/* eslint-disable @typescript-eslint/no-explicit-any */
const SLIDE_RENDERERS: Record<SlideType, React.ComponentType<{ slide: any }>> = {
  title: TitleSlideRenderer,
  section: SectionSlideRenderer,
  content: ContentSlideRenderer,
  'two-column': TwoColumnSlideRenderer,
  image: ImageSlideRenderer,
  quote: QuoteSlideRenderer,
  data: DataSlideRenderer,
  list: ListSlideRenderer,
  comparison: ComparisonSlideRenderer,
  interactive: InteractiveSlideRenderer,
  closing: ClosingSlideRenderer,
}
/* eslint-enable @typescript-eslint/no-explicit-any */

interface Props {
  presentation: Presentation
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function MiniSlide({ slide, label }: { slide: Slide; label?: string }) {
  const Renderer = SLIDE_RENDERERS[slide.type]
  return (
    <div className="relative rounded-lg overflow-hidden" style={{ background: '#0f172a', aspectRatio: '16/9' }}>
      <div style={{ width: 1920, height: 1080, transform: 'scale(0.15)', transformOrigin: 'top left' }}>
        {Renderer && <Renderer slide={slide} />}
      </div>
      {label && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-[10px] text-slate-400 px-2 py-0.5 text-center">
          {label}
        </div>
      )}
    </div>
  )
}

export default function PresenterConsole({ presentation }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [connected, setConnected] = useState(false)
  const channelRef = useRef<BroadcastChannel | null>(null)
  const startTimeRef = useRef(Date.now())

  const slides = presentation.slides || []
  const currentSlide = slides[currentIndex]
  const nextSlide = slides[currentIndex + 1]
  const estimatedMinutes = presentation.settings?.estimatedMinutes || 30

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // BroadcastChannel
  useEffect(() => {
    const channel = new BroadcastChannel(`thf-presentation-${presentation.id}`)
    channelRef.current = channel

    channel.onmessage = (e) => {
      if (e.data.type === 'sync_response') {
        setCurrentIndex(e.data.slideIndex)
        setConnected(true)
      }
    }

    // Request sync from audience window
    channel.postMessage({ type: 'sync_request' })

    // If no response in 2s, assume disconnected
    const timeout = setTimeout(() => {
      if (!connected) setConnected(false)
    }, 2000)

    return () => {
      clearTimeout(timeout)
      channel.close()
    }
  }, [presentation.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const navigate = useCallback((index: number) => {
    if (index < 0 || index >= slides.length) return
    setCurrentIndex(index)
    channelRef.current?.postMessage({ type: 'navigate', slideIndex: index })
  }, [slides.length])

  // Keyboard
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight': case ' ': case 'Enter':
          e.preventDefault(); navigate(currentIndex + 1); break
        case 'ArrowLeft': case 'Backspace':
          e.preventDefault(); navigate(currentIndex - 1); break
        case 'Home': e.preventDefault(); navigate(0); break
        case 'End': e.preventDefault(); navigate(slides.length - 1); break
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [currentIndex, navigate, slides.length])

  // Pace indicator
  const expectedProgress = elapsed / (estimatedMinutes * 60)
  const actualProgress = (currentIndex + 1) / slides.length
  const paceRatio = actualProgress / (expectedProgress || 0.01)
  const paceColor = paceRatio > 1.2 ? 'text-green-400' : paceRatio > 0.8 ? 'text-yellow-400' : 'text-red-400'
  const paceLabel = paceRatio > 1.2 ? 'Ahead' : paceRatio > 0.8 ? 'On pace' : 'Behind'

  const CurrentRenderer = currentSlide ? SLIDE_RENDERERS[currentSlide.type] : null
  const NextRenderer = nextSlide ? SLIDE_RENDERERS[nextSlide.type] : null

  return (
    <div className="flex flex-col h-screen bg-[#0a0e1a] text-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-semibold truncate max-w-[300px]">{presentation.title}</h1>
          <span className={`text-xs px-2 py-0.5 rounded ${connected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {connected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className={paceColor}>{paceLabel}</span>
          <span className="font-mono">{formatTime(elapsed)}</span>
          <span className="text-slate-500">Slide {currentIndex + 1} of {slides.length}</span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 min-h-0">
        {/* Current slide (60%) */}
        <div className="w-[60%] p-4 flex flex-col">
          <div className="flex-1 relative rounded-xl overflow-hidden border-2 border-cyan-500/30" style={{ background: '#0f172a' }}>
            <div style={{ width: 1920, height: 1080, transform: 'scale(0.38)', transformOrigin: 'top left' }}>
              {CurrentRenderer && currentSlide && <CurrentRenderer slide={currentSlide} />}
            </div>
          </div>
        </div>

        {/* Right panel (40%) */}
        <div className="w-[40%] flex flex-col p-4 gap-4">
          {/* Next slide preview */}
          <div className="flex-shrink-0">
            <p className="text-[10px] uppercase tracking-wider text-slate-600 mb-1">Next</p>
            <div className="relative rounded-lg overflow-hidden border border-white/10 opacity-60" style={{ background: '#0f172a', aspectRatio: '16/9' }}>
              {NextRenderer && nextSlide ? (
                <div style={{ width: 1920, height: 1080, transform: 'scale(0.22)', transformOrigin: 'top left' }}>
                  <NextRenderer slide={nextSlide} />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-600 text-sm">End of presentation</div>
              )}
            </div>
          </div>

          {/* Speaker notes */}
          <div className="flex-1 min-h-0">
            <p className="text-[10px] uppercase tracking-wider text-slate-600 mb-1">Notes</p>
            <div className="h-full overflow-y-auto rounded-lg p-3 text-sm leading-relaxed text-slate-300" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              {currentSlide?.notes || <span className="text-slate-600 italic">No speaker notes for this slide</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar: navigation + thumbnails */}
      <div className="flex-shrink-0 border-t border-white/10 px-4 py-2">
        {/* Navigation controls */}
        <div className="flex items-center justify-center gap-4 mb-2">
          <button onClick={() => navigate(0)} className="text-xs text-slate-500 hover:text-white px-2 py-1">⟨⟨</button>
          <button onClick={() => navigate(currentIndex - 1)} disabled={currentIndex === 0} className="px-4 py-1.5 bg-white/10 text-white rounded text-sm hover:bg-white/20 disabled:opacity-30">← Prev</button>
          <span className="text-sm text-slate-400 min-w-[80px] text-center">{currentIndex + 1} / {slides.length}</span>
          <button onClick={() => navigate(currentIndex + 1)} disabled={currentIndex >= slides.length - 1} className="px-4 py-1.5 bg-white/10 text-white rounded text-sm hover:bg-white/20 disabled:opacity-30">Next →</button>
          <button onClick={() => navigate(slides.length - 1)} className="text-xs text-slate-500 hover:text-white px-2 py-1">⟩⟩</button>
        </div>

        {/* Thumbnail strip */}
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              onClick={() => navigate(i)}
              className={`flex-shrink-0 w-20 rounded overflow-hidden transition-all ${
                i === currentIndex ? 'ring-2 ring-cyan-500 opacity-100' : 'opacity-40 hover:opacity-70'
              }`}
              style={{ aspectRatio: '16/9', background: '#0f172a' }}
            >
              <div className="w-full h-full flex items-center justify-center text-[8px] text-slate-600">
                {i + 1}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
