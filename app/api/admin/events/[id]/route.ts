import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { validateSlug } from '@/lib/events/slug'

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()

  // Load current row to check slug_locked + diff slug changes
  const { data: current, error: fetchError } = await supabase
    .from('events')
    .select('id, slug, slug_locked, is_public')
    .eq('id', params.id)
    .single()
  if (fetchError || !current) return NextResponse.json({ error: 'Event not found' }, { status: 404 })

  const slugChanging = body.slug !== undefined && body.slug !== current.slug

  if (slugChanging) {
    // Reject slug edit when the DB-side lock is on, unless this same request
    // explicitly unlocks the slug (slug_locked: false).
    if (current.slug_locked && body.slug_locked !== false) {
      return NextResponse.json({ error: 'Slug is locked. Uncheck "Lock URL" to rename.' }, { status: 400 })
    }
    if (body.slug) {
      const v = validateSlug(body.slug)
      if (!v.ok) return NextResponse.json({ error: v.reason }, { status: 400 })

      const { data: collision } = await supabase
        .from('events')
        .select('id')
        .eq('slug', body.slug)
        .neq('id', params.id)
        .maybeSingle()
      if (collision) return NextResponse.json({ error: `Slug "${body.slug}" is already taken.` }, { status: 409 })
    }
  }

  // Auto-lock on first publish only if the caller hasn't expressed an opinion.
  if (body.slug_locked === undefined) {
    const willBePublic = body.is_public ?? current.is_public
    const finalSlug = body.slug !== undefined ? body.slug : current.slug
    if (willBePublic && finalSlug && !current.slug_locked) {
      body.slug_locked = true
    }
  }

  const { data, error } = await supabase
    .from('events')
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq('id', params.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { error } = await supabase.from('events').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
