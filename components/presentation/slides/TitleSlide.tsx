import type { TitleSlide as TitleSlideType } from '@/lib/presentation/slide-types'

export default function TitleSlide({ slide }: { slide: TitleSlideType }) {
  const hasImage = slide.image?.url
  const isBackground = slide.image?.position === 'background'
  const isSide = slide.image?.position === 'left' || slide.image?.position === 'right'

  if (hasImage && isBackground) {
    return (
      <div className="relative flex flex-col items-center justify-center h-full text-center px-[10%]">
        <img
          src={slide.image!.url}
          alt={slide.image!.alt || ''}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: slide.image!.opacity ?? 0.3 }}
        />
        <div className="slide-animate relative z-10">
          {slide.logo && <img src={slide.logo} alt="" className="h-16 mb-8 object-contain mx-auto" />}
          <h1 className="text-[4rem] font-bold leading-tight text-white mb-6">{slide.title}</h1>
          {slide.subtitle && <p className="text-[1.8rem] text-slate-200 mb-8">{slide.subtitle}</p>}
          <div className="flex items-center justify-center gap-6 text-[1.2rem] text-slate-300">
            {slide.author && <span>{slide.author}</span>}
            {slide.author && slide.date && <span className="text-slate-500">•</span>}
            {slide.date && <span>{slide.date}</span>}
          </div>
        </div>
      </div>
    )
  }

  if (hasImage && isSide) {
    const imageOnLeft = slide.image!.position === 'left'
    return (
      <div className={`slide-animate flex h-full ${imageOnLeft ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className="w-[45%] h-full flex-shrink-0">
          <img src={slide.image!.url} alt={slide.image!.alt || ''} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-center px-[5%]">
          {slide.logo && <img src={slide.logo} alt="" className="h-16 mb-8 object-contain" />}
          <h1 className="text-[3.5rem] font-bold leading-tight text-white mb-6">{slide.title}</h1>
          {slide.subtitle && <p className="text-[1.5rem] text-slate-300 mb-8">{slide.subtitle}</p>}
          <div className="flex items-center gap-6 text-[1.1rem] text-slate-500">
            {slide.author && <span>{slide.author}</span>}
            {slide.author && slide.date && <span className="text-slate-700">•</span>}
            {slide.date && <span>{slide.date}</span>}
          </div>
        </div>
      </div>
    )
  }

  // Default: no image
  return (
    <div className="slide-animate flex flex-col items-center justify-center h-full text-center px-[10%]">
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
