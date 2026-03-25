import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  // Auth check via session client
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Use JPEG, PNG, WebP, or GIF.' }, { status: 400 })
    }

    // Validate size (4MB to stay within Vercel limits)
    if (file.size > 4 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Maximum 4MB.' }, { status: 400 })
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`

    // Convert to buffer and upload via admin client (bypasses RLS)
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const admin = createAdminClient()
    const { error } = await admin.storage
      .from('article-images')
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (error) {
      console.error('Supabase upload error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const { data: { publicUrl } } = admin.storage
      .from('article-images')
      .getPublicUrl(filename)

    return NextResponse.json({ url: publicUrl })
  } catch (err) {
    console.error('Upload handler error:', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
