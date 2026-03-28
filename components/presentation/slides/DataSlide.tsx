'use client'

import type { DataSlide as DataSlideType } from '@/lib/presentation/slide-types'

// Stat counter display
function StatDisplay({ data }: { data: Record<string, unknown> }) {
  const value = String(data.value || data.stat || '0')
  const label = String(data.label || data.description || '')
  const trend = data.trend as string | undefined

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-[6rem] font-bold text-cyan-400 leading-none">{value}</div>
      {label && <div className="text-[1.4rem] text-slate-400 mt-4">{label}</div>}
      {trend && (
        <div className={`text-[1.2rem] mt-2 ${trend.startsWith('+') || trend.startsWith('↑') ? 'text-green-400' : 'text-red-400'}`}>
          {trend}
        </div>
      )}
    </div>
  )
}

// Simple bar chart (pure CSS, no Recharts needed for basic display)
function SimpleBarChart({ data }: { data: Record<string, unknown> }) {
  const items = (data.items || data.data || []) as Array<{ label: string; value: number }>
  if (!Array.isArray(items) || items.length === 0) return null
  const max = Math.max(...items.map(i => i.value || 0), 1)

  return (
    <div className="flex items-end gap-6 h-[60%] px-8">
      {items.map((item, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-3">
          <span className="text-[1.2rem] font-bold text-white">{item.value}</span>
          <div
            className="w-full rounded-t-lg bg-gradient-to-t from-cyan-600 to-cyan-400 transition-all duration-1000"
            style={{ height: `${(item.value / max) * 100}%`, minHeight: 4 }}
          />
          <span className="text-[0.9rem] text-slate-500 text-center">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

export default function DataSlide({ slide }: { slide: DataSlideType }) {
  return (
    <div className="flex flex-col h-full px-[5%] py-[5%]">
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
