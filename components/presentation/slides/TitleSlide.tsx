import type { TitleSlide as TitleSlideType } from '@/lib/presentation/slide-types'

export default function TitleSlide({ slide }: { slide: TitleSlideType }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-[10%]">
      {slide.logo && (
        <img src={slide.logo} alt="" className="h-16 mb-8 object-contain" />
      )}
      <h1 className="text-[4rem] font-bold leading-tight text-white mb-6">
        {slide.title}
      </h1>
      {slide.subtitle && (
        <p className="text-[1.8rem] text-slate-300 mb-8">{slide.subtitle}</p>
      )}
      <div className="flex items-center gap-6 text-[1.2rem] text-slate-500">
        {slide.author && <span>{slide.author}</span>}
        {slide.author && slide.date && <span className="text-slate-700">•</span>}
        {slide.date && <span>{slide.date}</span>}
      </div>
    </div>
  )
}
