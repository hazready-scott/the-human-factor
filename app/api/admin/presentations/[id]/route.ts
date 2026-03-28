import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('presentations')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ presentation: data })
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const updates: Record<string, unknown> = {}

  const fields = [
    'title', 'slug', 'subtitle', 'description', 'slides', 'settings',
    'status', 'cover_image_url', 'author_name', 'tags',
    'seo_title', 'seo_description', 'seo_keywords',
    'social_post_text', 'social_hashtags',
  ]
  for (const field of fields) {
    if (body[field] !== undefined) updates[field] = body[field]
  }

  // Set published_at when publishing for the first time
  if (body.status === 'published') {
    const { data: current } = await supabase.from('presentations').select('published_at').eq('id', params.id).single()
    if (current && !current.published_at) {
      updates.published_at = new Date().toISOString()
    }
  }

  // Generate share token if switching to shareable/private
  if (body.status === 'shareable' || body.status === 'private') {
    const { data: current } = await supabase.from('presentations').select('share_token').eq('id', params.id).single()
    if (current && !current.share_token) {
      updates.share_token = crypto.randomUUID()
    }
  }

  const { data, error } = await supabase
    .from('presentations')
    .update(updates)
    .eq('id', params.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ presentation: data })
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { error } = await supabase.from('presentations').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
