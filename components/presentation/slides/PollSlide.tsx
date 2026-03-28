'use client'

import { useState, useEffect } from 'react'
import type { PollSlide as PollSlideType } from '@/lib/presentation/slide-types'
import { usePollRealtime } from '@/lib/presentation/use-poll-realtime'
import LiveResults from '../interactive/LiveResults'

function QRCode({ url }: { url: string }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!url) return
    import('qrcode').then(QRCodeLib => {
      QRCodeLib.toDataURL(url, {
        width: 280,
        margin: 2,
        color: { dark: '#ffffff', light: '#00000000' },
      }).then(setDataUrl).catch(console.error)
    })
  }, [url])

  if (!dataUrl) return null
  return <img src={dataUrl} alt="Scan to participate" className="w-[220px] h-[220px]" />
}

interface Props {
  slide: PollSlideType
  slug?: string
}

export default function PollSlide({ slide, slug }: Props) {
  const { results, totalResponses, isConnected } = usePollRealtime(
    slide.pollSessionId,
    slide.pollType,
    slug || ''
  )

  const joinUrl = typeof window !== 'undefined' && slug
    ? `${window.location.origin}/p/${slug}/live`
    : ''

  const showResults = slide.settings?.showResultsLive !== false && totalResponses > 0

  return (
    <div className="flex h-full">
      {/* Left side: Question + Results */}
      <div className="flex-1 flex flex-col justify-center px-[6%] py-[4%]">
        <div className="flex items-center gap-4 mb-6">
          <span className="text-[0.9rem] font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400">
            Live Poll
          </span>
          {isConnected && (
            <span className="flex items-center gap-1.5 text-[0.8rem] text-green-400">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Live
            </span>
          )}
          {totalResponses > 0 && (
            <span className="text-[0.9rem] text-slate-500">
              {totalResponses} response{totalResponses !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        <h2 className="text-[2.8rem] font-bold text-white mb-10 leading-tight">
          {slide.question}
        </h2>

        {showResults ? (
          <div className="flex-1 flex items-center">
            <LiveResults
              pollType={slide.pollType}
              results={results}
              options={slide.options}
            />
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center">
            {slide.pollType === 'multiple_choice' && slide.options && (
              <div className="w-full space-y-3 mb-8">
                {slide.options.map((opt, i) => (
                  <div
                    key={i}
                    className="px-6 py-4 rounded-xl text-[1.3rem] text-slate-300 font-medium"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    <span className="text-cyan-400 mr-3 font-bold">{String.fromCharCode(65 + i)}.</span>
                    {opt}
                  </div>
                ))}
              </div>
            )}
            <p className="text-[1.2rem] text-slate-500 animate-pulse">
              Waiting for responses...
            </p>
          </div>
        )}
      </div>

      {/* Right side: QR Code + Join instructions */}
      <div className="w-[320px] flex flex-col items-center justify-center px-8" style={{ borderLeft: '1px solid rgba(255,255,255,0.08)' }}>
        {joinUrl && (
          <>
            <QRCode url={joinUrl} />
            <p className="text-[1rem] text-slate-400 mt-6 mb-2 text-center">Scan to vote</p>
            <p className="text-[0.8rem] text-slate-600 text-center font-mono break-all">{joinUrl}</p>
          </>
        )}
      </div>
    </div>
  )
}
