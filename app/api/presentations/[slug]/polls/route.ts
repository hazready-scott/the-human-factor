import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET: List poll sessions for a presentation (public for active/closed)
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const admin = createAdminClient()

  // Find presentation by slug
  const { data: presentation } = await admin
    .from('presentations')
    .select('id')
    .eq('slug', params.slug)
    .single()

  if (!presentation) {
    return NextResponse.json({ error: 'Presentation not found' }, { status: 404 })
  }

  const { data: polls, error } = await admin
    .from('poll_sessions')
    .select('*')
    .eq('presentation_id', presentation.id)
    .order('slide_index', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ polls })
}

// POST: Create a poll session (admin only)
export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()

  const { data: presentation } = await admin
    .from('presentations')
    .select('id')
    .eq('slug', params.slug)
    .single()

  if (!presentation) {
    return NextResponse.json({ error: 'Presentation not found' }, { status: 404 })
  }

  const body = await request.json()
  const { question, poll_type, options, settings, slide_index } = body

  const { data: poll, error } = await admin
    .from('poll_sessions')
    .insert({
      presentation_id: presentation.id,
      slide_index: slide_index ?? 0,
      question,
      poll_type: poll_type || 'multiple_choice',
      options: options || [],
      settings: settings || {},
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ poll })
}
