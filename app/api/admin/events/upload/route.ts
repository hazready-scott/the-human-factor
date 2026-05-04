import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const runtime = 'nodejs'
export const maxDuration = 60

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const PDF_TYPE = 'application/pdf'
const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const MAX_PDF_BYTES = 50 * 1024 * 1024

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const kind = (formData.get('kind') as string) || 'image'
    const slugHint = (formData.get('slug') as string) || 'misc'
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    const isPdf = file.type === PDF_TYPE
    const isImage = IMAGE_TYPES.includes(file.type)

    if (kind === 'pdf' && !isPdf) {
      return NextResponse.json({ error: 'PDF required (got ' + file.type + ')' }, { status: 400 })
    }
    if (kind === 'image' && !isImage) {
      return NextResponse.json({ error: 'Image required (JPEG, PNG, WebP, GIF)' }, { status: 400 })
    }
    if (!isPdf && !isImage) {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 })
    }

    const limit = isPdf ? MAX_PDF_BYTES : MAX_IMAGE_BYTES
    if (file.size > limit) {
      const mb = Math.round(limit / 1024 / 1024)
      return NextResponse.json({ error: `File too large. Max ${mb}MB.` }, { status: 400 })
    }

    const safeSlug = slugHint.replace(/[^a-z0-9-]/gi, '').toLowerCase() || 'misc'
    const ext = file.name.split('.').pop()?.toLowerCase() || (isPdf ? 'pdf' : 'jpg')
    const filename = `${safeSlug}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`

    const buffer = Buffer.from(await file.arrayBuffer())

    let admin
    try { admin = createAdminClient() } catch (err) {
      console.error('[Events Upload] Admin client failed:', err)
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const { error: uploadError } = await admin.storage
      .from('event-assets')
      .upload(filename, buffer, { contentType: file.type, upsert: false })

    if (uploadError) {
      console.error('[Events Upload] Storage error:', uploadError.message)
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    const { data: { publicUrl } } = admin.storage
      .from('event-assets')
      .getPublicUrl(filename)

    return NextResponse.json({ url: publicUrl, kind: isPdf ? 'pdf' : 'image' })
  } catch (err) {
    console.error('[Events Upload] Handler error:', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
