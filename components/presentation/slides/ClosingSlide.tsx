import type { ClosingSlide as ClosingSlideType } from '@/lib/presentation/slide-types'

export default function ClosingSlide({ slide }: { slide: ClosingSlideType }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-[10%]">
      <h2 className="text-[3.5rem] font-bold text-white mb-6">{slide.heading}</h2>
      {slide.body && (
        <p className="text-[1.5rem] text-slate-300 mb-10 max-w-[70%]">{slide.body}</p>
      )}
      {slide.cta?.label && (
        <a
          href={slide.cta.url || '#'}
          target="_blank"
          rel="noopener"
          className="inline-block px-10 py-4 bg-cyan-500 text-white text-[1.3rem] font-semibold rounded-xl hover:bg-cyan-600 transition-colors mb-10"
        >
          {slide.cta.label}
        </a>
      )}
      {slide.contact && (
        <div className="flex items-center gap-8 text-[1.1rem] text-slate-500">
          {slide.contact.email && <span>{slide.contact.email}</span>}
          {slide.contact.website && <span>{slide.contact.website}</span>}
          {slide.contact.linkedin && <span>{slide.contact.linkedin}</span>}
        </div>
      )}
    </div>
  )
}
