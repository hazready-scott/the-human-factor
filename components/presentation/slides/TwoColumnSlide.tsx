import type { TwoColumnSlide as TwoColumnSlideType } from '@/lib/presentation/slide-types'

export default function TwoColumnSlide({ slide }: { slide: TwoColumnSlideType }) {
  return (
    <div className="flex flex-col h-full px-[5%] py-[5%]">
      {slide.heading && (
        <h2 className="text-[2.5rem] font-bold text-white mb-8">{slide.heading}</h2>
      )}
      <div className="flex-1 grid grid-cols-2 gap-[4%]">
        {[slide.left, slide.right].map((col, i) => (
          <div key={i} className="flex flex-col">
            {col.heading && (
              <h3 className="text-[1.6rem] font-semibold text-cyan-400 mb-4">{col.heading}</h3>
            )}
            <div
              className="text-[1.2rem] leading-relaxed text-slate-300 slide-body flex-1"
              dangerouslySetInnerHTML={{ __html: col.body }}
            />
            {col.image?.url && (
              <img src={col.image.url} alt={col.image.alt || ''} className="mt-4 rounded-lg max-h-[40%] object-contain" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
