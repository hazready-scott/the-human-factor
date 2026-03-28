import type { InteractiveSlide as InteractiveSlideType } from '@/lib/presentation/slide-types'

export default function InteractiveSlide({ slide }: { slide: InteractiveSlideType }) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-[5%] py-[5%]">
      {slide.heading && (
        <h2 className="text-[2.5rem] font-bold text-white mb-8">{slide.heading}</h2>
      )}
      <div className="text-[1.2rem] text-slate-500">
        Interactive: {slide.component}
      </div>
    </div>
  )
}
