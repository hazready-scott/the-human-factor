import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET: Get poll details + aggregated results (public)
export async function GET(
  request: Request,
  { params }: { params: { slug: string; pollId: string } }
) {
  const admin = createAdminClient()

  const { data: poll } = await admin
    .from('poll_sessions')
    .select('*')
    .eq('id', params.pollId)
    .single()

  if (!poll) {
    return NextResponse.json({ error: 'Poll not found' }, { status: 404 })
  }

  // Aggregate results
  const { data: responses } = await admin
    .from('poll_responses')
    .select('response')
    .eq('session_id', params.pollId)

  const totalResponses = responses?.length || 0
  let results: Record<string, unknown> = {}

  if (poll.poll_type === 'multiple_choice') {
    const counts: Record<string, number> = {}
    for (const r of responses || []) {
      const choice = (r.response as { choice: string }).choice
      counts[choice] = (counts[choice] || 0) + 1
    }
    results = { counts, total: totalResponses }
  } else if (poll.poll_type === 'word_cloud') {
    const words: Record<string, number> = {}
    for (const r of responses || []) {
      const word = ((r.response as { text: string }).text || '').toLowerCase().trim()
      if (word) words[word] = (words[word] || 0) + 1
    }
    results = { words, total: totalResponses }
  } else if (poll.poll_type === 'rating') {
    const values = (responses || []).map(r => (r.response as { value: number }).value).filter(v => typeof v === 'number')
    const avg = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0
    const distribution: Record<number, number> = {}
    for (const v of values) distribution[v] = (distribution[v] || 0) + 1
    results = { average: Math.round(avg * 10) / 10, distribution, total: totalResponses }
  } else if (poll.poll_type === 'open_ended') {
    const texts = (responses || []).map(r => (r.response as { text: string }).text).filter(Boolean)
    results = { responses: texts.slice(-50), total: totalResponses }
  }

  return NextResponse.json({ poll, results, totalResponses })
}

// PATCH: Update poll status (admin only)
export async function PATCH(
  request: Request,
  { params }: { params: { slug: string; pollId: string } }
) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()
  const body = await request.json()
  const { status } = body

  if (!['waiting', 'active', 'closed'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const { data: poll, error } = await admin
    .from('poll_sessions')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', params.pollId)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ poll })
}
