'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { Presentation, Slide, SlideType } from '@/lib/presentation/slide-types'

// Slide renderers
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

// Theme CSS variables
const THEMES = {
  default: { bg: '#0f172a', text: '#f8fafc', accent: '#06b6d4' },
  dark: { bg: '#000000', text: '#ffffff', accent: '#06b6d4' },
  light: { bg: '#fafaf9', text: '#1e293b', accent: '#0891b2' },
}

interface Props {
  presentation: Presentation
}

export default function PresentationViewer({ presentation }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  const slides = presentation.slides || []
  const settings = presentation.settings || { theme: 'default', transition: 'fade', transitionSpeed: 300, aspectRatio: '16:9', showSlideNumbers: true, showProgressBar: true }
  const theme = THEMES[settings.theme] || THEMES.default
  const isWide = settings.aspectRatio !== '4:3'
  const slideWidth = 1920
  const slideHeight = isWide ? 1080 : 1440

  // Calculate scale to fit viewport
  useEffect(() => {
    const updateScale = () => {
      const vw = window.innerWidth
      const vh = window.innerHeight
      const scaleX = vw / slideWidth
      const scaleY = vh / slideHeight
      setScale(Math.min(scaleX, scaleY))
    }
    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [slideWidth, slideHeight])

  const goTo = useCallback((index: number) => {
    if (index < 0 || index >= slides.length || isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex(index)
    setTimeout(() => setIsTransitioning(false), settings.transitionSpeed || 300)
  }, [slides.length, isTransitioning, settings.transitionSpeed])

  const next = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo])
  const prev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo])

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
        case 'Enter':
          e.preventDefault()
          next()
          break
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'Backspace':
          e.preventDefault()
          prev()
          break
        case 'Home':
          e.preventDefault()
          goTo(0)
          break
        case 'End':
          e.preventDefault()
          goTo(slides.length - 1)
          break
        case 'f':
        case 'F':
          e.preventDefault()
          if (document.fullscreenElement) {
            document.exitFullscreen()
          } else {
            containerRef.current?.requestFullscreen()
          }
          break
        case 'Escape':
          if (document.fullscreenElement) {
            document.exitFullscreen()
          }
          break
        case 'p':
        case 'P':
          e.preventDefault()
          openPresenterMode()
          break
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [next, prev, goTo, slides.length])

  // Touch/swipe support
  useEffect(() => {
    let touchStartX = 0
    const handleTouchStart = (e: TouchEvent) => { touchStartX = e.touches[0].clientX }
    const handleTouchEnd = (e: TouchEvent) => {
      const diff = touchStartX - e.changedTouches[0].clientX
      if (Math.abs(diff) > 50) {
        if (diff > 0) next()
        else prev()
      }
    }
    const el = containerRef.current
    el?.addEventListener('touchstart', handleTouchStart, { passive: true })
    el?.addEventListener('touchend', handleTouchEnd, { passive: true })
    return () => {
      el?.removeEventListener('touchstart', handleTouchStart)
      el?.removeEventListener('touchend', handleTouchEnd)
    }
  }, [next, prev])

  // BroadcastChannel for presenter mode
  useEffect(() => {
    const channel = new BroadcastChannel(`thf-presentation-${presentation.id}`)
    channel.onmessage = (e) => {
      if (e.data.type === 'navigate') goTo(e.data.slideIndex)
      if (e.data.type === 'sync_request') {
        channel.postMessage({ type: 'sync_response', slideIndex: currentIndex })
      }
    }
    return () => channel.close()
  }, [presentation.id, currentIndex, goTo])

  const openPresenterMode = () => {
    const width = Math.min(1200, window.screen.availWidth * 0.6)
    const height = Math.min(800, window.screen.availHeight * 0.8)
    window.open(
      `/p/${presentation.slug}/presenter${presentation.share_token ? `?token=${presentation.share_token}` : ''}`,
      'presenter-console',
      `width=${width},height=${height},menubar=no,toolbar=no,location=no,status=no`
    )
    containerRef.current?.requestFullscreen?.()
  }

  const currentSlide = slides[currentIndex]
  if (!currentSlide) return null

  const SlideRenderer = SLIDE_RENDERERS[currentSlide.type]
  const bg = currentSlide.background

  return (
    <div
      ref={containerRef}
      className="w-screen h-screen overflow-hidden flex items-center justify-center cursor-none"
      style={{ backgroundColor: theme.bg }}
      onClick={next}
    >
      {/* Slide container at fixed internal resolution, CSS-scaled */}
      <div
        style={{
          width: slideWidth,
          height: slideHeight,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          position: 'relative',
          backgroundColor: bg?.color || theme.bg,
          color: theme.text,
          fontFamily: "'Inter', sans-serif",
          transition: settings.transition === 'fade'
            ? `opacity ${settings.transitionSpeed || 300}ms ease-in-out`
            : settings.transition === 'slide'
            ? `transform ${settings.transitionSpeed || 300}ms ease-in-out`
            : 'none',
        }}
      >
        {/* Background image */}
        {bg?.image && (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${bg.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: bg.opacity ?? 0.3,
            }}
          />
        )}
        {/* Background gradient */}
        {bg?.gradient && (
          <div className="absolute inset-0" style={{ background: bg.gradient }} />
        )}

        {/* Slide content */}
        <div className="relative z-10 w-full h-full">
          {SlideRenderer && <SlideRenderer slide={currentSlide} />}
        </div>
      </div>

      {/* Progress bar */}
      {settings.showProgressBar && (
        <div className="fixed bottom-0 left-0 right-0 h-1 z-50" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${((currentIndex + 1) / slides.length) * 100}%`,
              backgroundColor: theme.accent,
            }}
          />
        </div>
      )}

      {/* Slide number */}
      {settings.showSlideNumbers && (
        <div className="fixed bottom-4 right-6 text-sm z-50" style={{ color: 'rgba(255,255,255,0.3)' }}>
          {currentIndex + 1} / {slides.length}
        </div>
      )}
    </div>
  )
}
