'use client'

import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { Copy, Download, Check } from 'lucide-react'

interface Props {
  slug: string
  baseUrl?: string
}

export default function EventQrPanel({ slug, baseUrl }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const origin = baseUrl
    || (typeof window !== 'undefined' ? window.location.origin : 'https://thehumanfactor.ca')
  const url = `${origin}/${slug}`

  useEffect(() => {
    if (!canvasRef.current || !slug) return
    QRCode.toCanvas(canvasRef.current, url, {
      width: 320,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' },
      errorCorrectionLevel: 'M',
    }).catch(err => setError(err instanceof Error ? err.message : 'QR generation failed'))
  }, [url, slug])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setError('Copy failed')
    }
  }

  const handleDownload = async () => {
    try {
      const dataUrl = await QRCode.toDataURL(url, {
        width: 1024,
        margin: 4,
        color: { dark: '#000000', light: '#ffffff' },
        errorCorrectionLevel: 'M',
      })
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = `qr-${slug}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Download failed')
    }
  }

  if (!slug) return null

  return (
    <div className="rounded-lg p-4 border border-white/10 bg-black/30">
      <div className="flex items-start gap-4">
        <div className="bg-white p-2 rounded">
          <canvas ref={canvasRef} className="block" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Public URL</p>
          <p className="text-sm text-white font-mono break-all mb-3">{url}</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-200 rounded text-xs border border-white/10"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? 'Copied' : 'Copy URL'}
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#06b6d4] hover:bg-[#0891b2] text-white rounded text-xs font-semibold"
            >
              <Download size={12} />
              Download QR (1024px)
            </button>
          </div>
          {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
          <p className="mt-3 text-[11px] text-slate-600">
            Embed the QR on your slides so attendees can land on this page directly.
          </p>
        </div>
      </div>
    </div>
  )
}
