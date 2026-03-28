import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('presentations')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ presentations: data })
}

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { title, subtitle, description, slides, settings, status: presStatus, tags, cover_image_url, author_name } = body

  if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 })

  let slug = body.slug || slugify(title)

  // Ensure unique slug
  const { data: existing } = await supabase.from('presentations').select('id').eq('slug', slug).single()
  if (existing) slug = `${slug}-${Date.now()}`

  // Generate share token for shareable presentations
  const share_token = (presStatus === 'shareable' || presStatus === 'private')
    ? crypto.randomUUID()
    : null

  const { data, error } = await supabase.from('presentations').insert({
    title,
    slug,
    subtitle: subtitle || null,
    description: description || null,
    slides: slides || [],
    settings: settings || {
      theme: 'default',
      transition: 'fade',
      transitionSpeed: 300,
      aspectRatio: '16:9',
      showSlideNumbers: true,
      showProgressBar: true,
      brandColor: '#06b6d4',
      estimatedMinutes: 30,
    },
    status: presStatus || 'draft',
    share_token,
    published_at: presStatus === 'published' ? new Date().toISOString() : null,
    cover_image_url: cover_image_url || null,
    author_name: author_name || 'The Human Factor',
    tags: tags || [],
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ presentation: data })
}
