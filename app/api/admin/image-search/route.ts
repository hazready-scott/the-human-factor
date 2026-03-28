import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')
  if (!query) return NextResponse.json({ error: 'Missing query' }, { status: 400 })

  const accessKey = process.env.UNSPLASH_ACCESS_KEY
  if (!accessKey) {
    return NextResponse.json({ error: 'UNSPLASH_ACCESS_KEY not configured' }, { status: 500 })
  }

  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=9&orientation=landscape`,
      { headers: { Authorization: `Client-ID ${accessKey}` } }
    )
    const data = await res.json()

    const images = (data.results || []).map((img: Record<string, unknown>) => ({
      id: img.id,
      url: (img.urls as Record<string, string>)?.regular,
      thumb: (img.urls as Record<string, string>)?.small,
      alt: (img.alt_description as string) || query,
      credit: (img.user as Record<string, string>)?.name,
      creditLink: (img.user as Record<string, Record<string, string>>)?.links?.html,
      downloadLink: (img.links as Record<string, string>)?.download_location,
    }))

    return NextResponse.json({ images })
  } catch {
    return NextResponse.json({ error: 'Image search failed' }, { status: 500 })
  }
}
