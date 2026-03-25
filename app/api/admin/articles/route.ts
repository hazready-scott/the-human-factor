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
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ articles: data })
}

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { title, content, excerpt, cover_image_url, author_name, status: articleStatus, tags, seo_title, seo_description, seo_keywords } = body

  if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 })

  let slug = body.slug || slugify(title)

  // Ensure unique slug
  const { data: existing } = await supabase.from('articles').select('id').eq('slug', slug).single()
  if (existing) slug = `${slug}-${Date.now()}`

  const { data, error } = await supabase.from('articles').insert({
    title, slug,
    content: content || '',
    excerpt: excerpt || null,
    cover_image_url: cover_image_url || null,
    author_name: author_name || 'The Human Factor',
    status: articleStatus || 'draft',
    published_at: articleStatus === 'published' ? new Date().toISOString() : null,
    tags: tags || [],
    seo_title: seo_title || null,
    seo_description: seo_description || null,
    seo_keywords: seo_keywords || null,
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ article: data })
}
