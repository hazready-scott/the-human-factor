import type { ComparisonSlide as ComparisonSlideType } from '@/lib/presentation/slide-types'

export default function ComparisonSlide({ slide }: { slide: ComparisonSlideType }) {
  return (
    <div className="flex flex-col h-full px-[5%] py-[5%]">
      {slide.heading && (
        <h2 className="text-[2.5rem] font-bold text-white mb-8">{slide.heading}</h2>
      )}
      <div className="flex-1 grid grid-cols-2 gap-8">
        {/* Before */}
        <div className="rounded-2xl p-8" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <h3 className="text-[1.6rem] font-bold text-red-400 mb-6">{slide.before.label}</h3>
          <ul className="space-y-4">
            {slide.before.items.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-red-500 mt-1">✕</span>
                <span className="text-[1.2rem] text-slate-300">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        {/* After */}
        <div className="rounded-2xl p-8" style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)' }}>
          <h3 className="text-[1.6rem] font-bold text-cyan-400 mb-6">{slide.after.label}</h3>
          <ul className="space-y-4">
            {slide.after.items.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-cyan-400 mt-1">✓</span>
                <span className="text-[1.2rem] text-slate-300">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
