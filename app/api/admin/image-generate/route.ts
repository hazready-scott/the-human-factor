import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const apiKey = process.env.GOOGLE_AI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'GOOGLE_AI_API_KEY not configured' }, { status: 500 })
  }

  const { prompt } = await request.json()
  if (!prompt) return NextResponse.json({ error: 'Missing prompt' }, { status: 400 })

  try {
    // Call Imagen 3 via Gemini API
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instances: [{ prompt: `Professional presentation slide image: ${prompt}. No text, no words, no letters. High quality, clean, modern.` }],
          parameters: {
            sampleCount: 1,
            aspectRatio: '16:9',
            safetyFilterLevel: 'block_few',
          },
        }),
      }
    )

    if (!res.ok) {
      const errText = await res.text()
      console.error('Imagen API error:', res.status, errText)
      return NextResponse.json({ error: `Imagen API error: ${res.status}` }, { status: 500 })
    }

    const data = await res.json()
    const prediction = data.predictions?.[0]
    if (!prediction?.bytesBase64Encoded) {
      return NextResponse.json({ error: 'No image generated' }, { status: 500 })
    }

    // Upload to Supabase Storage
    const adminClient = createAdminClient()
    const buffer = Buffer.from(prediction.bytesBase64Encoded, 'base64')
    const filename = `generated/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.png`

    const { error: uploadError } = await adminClient.storage
      .from('article-images')
      .upload(filename, buffer, { contentType: 'image/png', upsert: true })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json({ error: 'Failed to save generated image' }, { status: 500 })
    }

    const { data: urlData } = adminClient.storage.from('article-images').getPublicUrl(filename)

    return NextResponse.json({ url: urlData.publicUrl })
  } catch (err) {
    console.error('Image generation error:', err)
    return NextResponse.json({ error: 'Image generation failed' }, { status: 500 })
  }
}
