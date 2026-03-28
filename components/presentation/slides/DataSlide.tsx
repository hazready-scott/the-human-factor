'use client'

import { useState, useEffect, useRef } from 'react'
import type { DataSlide as DataSlideType } from '@/lib/presentation/slide-types'

// Animated number counter hook
function useCountUp(target: number, duration = 1500): number {
  const [value, setValue] = useState(0)
  const startTime = useRef<number | null>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    startTime.current = null
    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp
      const elapsed = timestamp - startTime.current
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(target * eased))
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      }
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target, duration])

  return value
}

function StatDisplay({ data }: { data: Record<string, unknown> }) {
  const rawValue = String(data.value || data.stat || '0')
  const numericValue = parseFloat(rawValue.replace(/[^0-9.-]/g, ''))
  const prefix = rawValue.match(/^[^0-9]*/)?.[0] || ''
  const suffix = rawValue.match(/[^0-9]*$/)?.[0] || ''
  const label = String(data.label || data.description || '')
  const trend = data.trend as string | undefined

  const animatedValue = useCountUp(isNaN(numericValue) ? 0 : numericValue)
  const displayValue = isNaN(numericValue) ? rawValue : `${prefix}${animatedValue.toLocaleString()}${suffix}`

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-[6rem] font-bold text-cyan-400 leading-none">{displayValue}</div>
      {label && <div className="text-[1.4rem] text-slate-400 mt-4">{label}</div>}
      {trend && (
        <div className={`text-[1.2rem] mt-2 ${trend.startsWith('+') || trend.startsWith('↑') ? 'text-green-400' : 'text-red-400'}`}>
          {trend}
        </div>
      )}
    </div>
  )
}

function SimpleBarChart({ data }: { data: Record<string, unknown> }) {
  const items = (data.items || data.data || []) as Array<{ label: string; value: number }>
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  if (!Array.isArray(items) || items.length === 0) return null
  const max = Math.max(...items.map(i => i.value || 0), 1)

  return (
    <div className="flex items-end gap-6 h-[60%] px-8">
      {items.map((item, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-3">
          <span className="text-[1.2rem] font-bold text-white transition-opacity duration-500" style={{ opacity: visible ? 1 : 0, transitionDelay: `${i * 150 + 500}ms` }}>
            {item.value}
          </span>
          <div
            className="w-full rounded-t-lg bg-gradient-to-t from-cyan-600 to-cyan-400 transition-all duration-1000 ease-out"
            style={{
              height: visible ? `${(item.value / max) * 100}%` : '0%',
              minHeight: visible ? 4 : 0,
              transitionDelay: `${i * 150}ms`,
            }}
          />
          <span className="text-[0.9rem] text-slate-500 text-center">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

export default function DataSlide({ slide }: { slide: DataSlideType }) {
  return (
    <div className="slide-animate flex flex-col h-full px-[5%] py-[5%]">
      <h2 className="text-[2.5rem] font-bold text-white mb-2">{slide.heading}</h2>
      {slide.description && (
        <p className="text-[1.2rem] text-slate-400 mb-6">{slide.description}</p>
      )}
      <div className="flex-1 flex items-center justify-center">
        {slide.chartType === 'stat' ? (
          <StatDisplay data={slide.chartData} />
        ) : (
          <SimpleBarChart data={slide.chartData} />
        )}
      </div>
      {slide.source && (
        <p className="text-[0.9rem] text-slate-600 mt-4">Source: {slide.source}</p>
      )}
    </div>
  )
}
