'use client'

import { useState, useEffect } from 'react'
import type { ClosingSlide as ClosingSlideType } from '@/lib/presentation/slide-types'

function QRCode({ url }: { url: string }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!url) return
    import('qrcode').then(QRCodeLib => {
      QRCodeLib.toDataURL(url, {
        width: 200,
        margin: 2,
        color: { dark: '#ffffff', light: '#00000000' },
      }).then(setDataUrl).catch(console.error)
    })
  }, [url])

  if (!dataUrl) return null
  return <img src={dataUrl} alt="QR Code" className="w-[180px] h-[180px]" />
}

export default function ClosingSlide({ slide }: { slide: ClosingSlideType }) {
  const hasQR = !!slide.qrCodeUrl

  return (
    <div className="slide-animate flex flex-col items-center justify-center h-full text-center px-[10%]">
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
      <div className={`flex items-center ${hasQR ? 'gap-16' : 'gap-8'}`}>
        {slide.contact && (
          <div className={`flex ${hasQR ? 'flex-col items-start gap-3' : 'items-center gap-8'} text-[1.1rem] text-slate-500`}>
            {slide.contact.email && <span>{slide.contact.email}</span>}
            {slide.contact.website && <span>{slide.contact.website}</span>}
            {slide.contact.linkedin && <span>{slide.contact.linkedin}</span>}
          </div>
        )}
        {hasQR && <QRCode url={slide.qrCodeUrl!} />}
      </div>
    </div>
  )
}
