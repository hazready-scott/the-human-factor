import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { validateSlug } from '@/lib/events/slug'

export async function GET(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const upcoming = searchParams.get('upcoming')

  let query = supabase
    .from('events')
    .select('*, associate:associates(id, name, slug, photo_url), presentation:presentations(id, title, slug)')
    .order('start_date', { ascending: true })

  if (status) query = query.eq('status', status)
  if (upcoming === 'true') query = query.gte('start_date', new Date().toISOString())

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()

  if (body.slug) {
    const v = validateSlug(body.slug)
    if (!v.ok) return NextResponse.json({ error: v.reason }, { status: 400 })

    const { data: existing } = await supabase
      .from('events')
      .select('id')
      .eq('slug', body.slug)
      .maybeSingle()
    if (existing) return NextResponse.json({ error: `Slug "${body.slug}" is already taken.` }, { status: 409 })
  }

  // Default: lock slug for new public events. Explicit slug_locked in body wins.
  if (body.slug_locked === undefined && body.slug && body.is_public) {
    body.slug_locked = true
  }

  const { data, error } = await supabase
    .from('events')
    .insert(body)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
