interface Props {
  pdfUrl: string
  allowDownload: boolean
}

// Best-effort: appending #toolbar=0 hides the native PDF viewer toolbar (incl. download button)
// in Chrome/Edge/Safari when the PDF is served same-origin or with permissive CORS. A determined
// user can still grab the URL from devtools — true hard-block requires a custom PDF.js viewer.
export default function EventPdfEmbed({ pdfUrl, allowDownload }: Props) {
  const src = allowDownload ? pdfUrl : `${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`

  return (
    <div className="w-full">
      <div className="relative w-full rounded-lg overflow-hidden bg-black/40 border border-white/10" style={{ aspectRatio: '16 / 10' }}>
        <iframe
          src={src}
          title="Event slides"
          className="absolute inset-0 w-full h-full"
        />
      </div>
      {allowDownload && (
        <div className="mt-3">
          <a
            href={pdfUrl}
            download
            className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300"
          >
            Download slides (PDF)
          </a>
        </div>
      )}
    </div>
  )
}
