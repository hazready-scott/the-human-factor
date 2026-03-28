import type { QuoteSlide as QuoteSlideType } from '@/lib/presentation/slide-types'

export default function QuoteSlide({ slide }: { slide: QuoteSlideType }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-[12%]">
      <div className="text-[5rem] text-cyan-500/30 leading-none mb-4">&ldquo;</div>
      <blockquote className="text-[2.2rem] font-light text-white leading-relaxed italic mb-8">
        {slide.quote}
      </blockquote>
      {(slide.attribution || slide.role) && (
        <div className="text-[1.2rem]">
          {slide.attribution && <span className="text-slate-300 font-medium">{slide.attribution}</span>}
          {slide.role && <span className="text-slate-500 ml-2">— {slide.role}</span>}
        </div>
      )}
    </div>
  )
}
