import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// POST: Submit a poll response (no auth required)
export async function POST(
  request: Request,
  { params }: { params: { slug: string; pollId: string } }
) {
  const admin = createAdminClient()

  // Validate poll exists and is active
  const { data: poll } = await admin
    .from('poll_sessions')
    .select('id, status, poll_type, options')
    .eq('id', params.pollId)
    .single()

  if (!poll) {
    return NextResponse.json({ error: 'Poll not found' }, { status: 404 })
  }

  if (poll.status !== 'active') {
    return NextResponse.json({ error: 'Poll is not active' }, { status: 400 })
  }

  const body = await request.json()
  const { respondent_id, response } = body

  if (!respondent_id || !response) {
    return NextResponse.json({ error: 'Missing respondent_id or response' }, { status: 400 })
  }

  // Validate response format based on poll type
  if (poll.poll_type === 'multiple_choice') {
    const choice = response.choice
    const options = (poll.options as string[]) || []
    if (!choice || !options.includes(choice)) {
      return NextResponse.json({ error: 'Invalid choice' }, { status: 400 })
    }
  } else if (poll.poll_type === 'rating') {
    if (typeof response.value !== 'number') {
      return NextResponse.json({ error: 'Invalid rating value' }, { status: 400 })
    }
  } else if (poll.poll_type === 'word_cloud' || poll.poll_type === 'open_ended') {
    if (!response.text || typeof response.text !== 'string') {
      return NextResponse.json({ error: 'Invalid text response' }, { status: 400 })
    }
  }

  // Upsert: allows changing vote
  const { error } = await admin
    .from('poll_responses')
    .upsert(
      {
        session_id: params.pollId,
        respondent_id,
        response,
      },
      { onConflict: 'session_id,respondent_id' }
    )

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
