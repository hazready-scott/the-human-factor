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
    .from('contact_associates')
    .select('*, associate:associates(id, name, photo_url, title, email)')
    .eq('contact_id', params.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ associates: data })
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { associate_id, role } = body

  if (!associate_id) {
    return NextResponse.json({ error: 'Associate ID is required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('contact_associates')
    .insert({
      contact_id: params.id,
      associate_id,
      role: role || null,
    })
    .select('*, associate:associates(id, name, photo_url, title, email)')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ assignment: data })
}
