import type { ImageSlide as ImageSlideType } from '@/lib/presentation/slide-types'

export default function ImageSlide({ slide }: { slide: ImageSlideType }) {
  return (
    <div className="slide-animate relative h-full w-full flex flex-col">
      <div className="flex-1 relative">
        <img
          src={slide.url}
          alt={slide.alt}
          className="absolute inset-0 w-full h-full"
          style={{ objectFit: (slide.fit === 'auto' ? 'scale-down' : slide.fit) || 'cover' }}
        />
      </div>
      {slide.caption && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-[5%] pb-8 pt-16">
          <p className="text-[1.2rem] text-slate-300">{slide.caption}</p>
        </div>
      )}
    </div>
  )
}
