import type { ContentSlide as ContentSlideType } from '@/lib/presentation/slide-types'

export default function ContentSlide({ slide }: { slide: ContentSlideType }) {
  const hasImage = slide.image?.url
  const imgPosition = slide.image?.position || 'right'
  const imgSize = slide.image?.size || 'medium'
  const imgWidth = imgSize === 'small' ? 'w-[30%]' : imgSize === 'large' ? 'w-[50%]' : 'w-[40%]'

  if (hasImage && imgPosition !== 'bottom') {
    const isLeft = imgPosition === 'left'
    return (
      <div className={`flex h-full ${isLeft ? 'flex-row-reverse' : 'flex-row'} items-center gap-[4%] px-[5%] py-[5%]`}>
        <div className="flex-1 min-w-0">
          <h2 className="text-[2.8rem] font-bold text-white mb-6">{slide.heading}</h2>
          <div
            className="text-[1.4rem] leading-relaxed text-slate-300 slide-body"
            dangerouslySetInnerHTML={{ __html: slide.body }}
          />
        </div>
        <div className={`${imgWidth} flex-shrink-0`}>
          <img src={slide.image!.url} alt={slide.image!.alt || ''} className="w-full h-auto rounded-xl shadow-2xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col justify-center h-full px-[5%] py-[5%]">
      <h2 className="text-[2.8rem] font-bold text-white mb-6">{slide.heading}</h2>
      <div
        className="text-[1.4rem] leading-relaxed text-slate-300 slide-body"
        dangerouslySetInnerHTML={{ __html: slide.body }}
      />
      {hasImage && imgPosition === 'bottom' && (
        <div className="mt-8 flex justify-center">
          <img src={slide.image!.url} alt={slide.image!.alt || ''} className="max-h-[40%] rounded-xl shadow-2xl" />
        </div>
      )}
    </div>
  )
}
