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
    // Use Gemini 2.0 Flash with image generation capability
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Generate a professional presentation slide background image for this concept: ${prompt}. The image must contain absolutely NO text, NO words, NO letters, NO numbers. It should be high quality, clean, modern, and suitable for a 16:9 presentation slide.`
            }]
          }],
          generationConfig: {
            responseModalities: ['TEXT', 'IMAGE'],
          },
        }),
      }
    )

    if (!res.ok) {
      const errText = await res.text()
      console.error('Gemini API error:', res.status, errText)
      return NextResponse.json({ error: `Image generation error: ${res.status}` }, { status: 500 })
    }

    const data = await res.json()

    // Find the image part in the response
    const candidates = data.candidates || []
    let imageData: string | null = null
    let mimeType = 'image/png'

    for (const candidate of candidates) {
      const parts = candidate.content?.parts || []
      for (const part of parts) {
        if (part.inlineData?.data) {
          imageData = part.inlineData.data
          mimeType = part.inlineData.mimeType || 'image/png'
          break
        }
      }
      if (imageData) break
    }

    if (!imageData) {
      console.error('No image in response:', JSON.stringify(data).substring(0, 500))
      return NextResponse.json({ error: 'No image generated — try a different concept' }, { status: 500 })
    }

    // Upload to Supabase Storage
    const adminClient = createAdminClient()
    const buffer = Buffer.from(imageData, 'base64')
    const ext = mimeType.includes('jpeg') || mimeType.includes('jpg') ? 'jpg' : 'png'
    const filename = `generated/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

    const { error: uploadError } = await adminClient.storage
      .from('article-images')
      .upload(filename, buffer, { contentType: mimeType, upsert: true })

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
