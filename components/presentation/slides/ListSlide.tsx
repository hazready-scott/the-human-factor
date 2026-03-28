import type { ListSlide as ListSlideType } from '@/lib/presentation/slide-types'

export default function ListSlide({ slide }: { slide: ListSlideType }) {
  return (
    <div className="flex flex-col justify-center h-full px-[8%] py-[5%]">
      <h2 className="text-[2.5rem] font-bold text-white mb-8">{slide.heading}</h2>
      <ul className="space-y-5">
        {slide.items.map((item, i) => (
          <li key={i} className="flex items-start gap-4">
            <span className="w-2 h-2 rounded-full bg-cyan-500 mt-3 flex-shrink-0" />
            <div>
              <span className="text-[1.4rem] text-slate-200">{item.text}</span>
              {item.detail && (
                <p className="text-[1rem] text-slate-500 mt-1">{item.detail}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
