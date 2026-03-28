import type { SectionSlide as SectionSlideType } from '@/lib/presentation/slide-types'

export default function SectionSlide({ slide }: { slide: SectionSlideType }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-[10%]">
      <div className="w-24 h-1 bg-cyan-500 mb-10 rounded-full" />
      <h2 className="text-[3.5rem] font-bold text-white mb-4">{slide.heading}</h2>
      {slide.subheading && (
        <p className="text-[1.5rem] text-slate-400">{slide.subheading}</p>
      )}
    </div>
  )
}
