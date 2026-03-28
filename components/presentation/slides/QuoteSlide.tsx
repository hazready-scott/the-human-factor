import type { QuoteSlide as QuoteSlideType } from '@/lib/presentation/slide-types'

export default function QuoteSlide({ slide }: { slide: QuoteSlideType }) {
  return (
    <div className="slide-animate flex items-center justify-center h-full px-[12%]">
      {slide.image?.url && (
        <div className="flex-shrink-0 mr-16">
          <img
            src={slide.image.url}
            alt={slide.image.alt || ''}
            className="w-[200px] h-[200px] rounded-full object-cover"
          />
        </div>
      )}
      <div className={`flex flex-col ${slide.image?.url ? 'items-start text-left' : 'items-center text-center'}`}>
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
    </div>
  )
}
