import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') || ''
  const readinessLevel = searchParams.get('readiness_level') || ''
  const industry = searchParams.get('industry') || ''

  let query = supabase
    .from('aria_assessments')
    .select('*')
    .order('created_at', { ascending: false })

  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,org_name.ilike.%${search}%`)
  }
  if (readinessLevel) query = query.eq('readiness_level', readinessLevel)
  if (industry) query = query.eq('industry', industry)

  const { data, error } = await query.limit(200)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ assessments: data })
}
