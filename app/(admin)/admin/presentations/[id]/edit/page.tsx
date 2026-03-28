'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import PresentationEditor from '@/components/admin/PresentationEditor'
import type { Presentation } from '@/lib/presentation/slide-types'

export default function EditPresentationPage() {
  const params = useParams()
  const [presentation, setPresentation] = useState<Presentation | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/admin/presentations/${params.id}`)
      .then(r => r.json())
      .then(data => {
        if (data.presentation) setPresentation(data.presentation)
        else setError(data.error || 'Not found')
      })
      .catch(() => setError('Failed to load presentation'))
  }, [params.id])

  if (error) {
    return <div className="text-center py-20 text-red-400">{error}</div>
  }

  if (!presentation) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500">
        <Loader2 size={24} className="animate-spin mr-3" /> Loading...
      </div>
    )
  }

  return <PresentationEditor presentation={presentation} />
}
