import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PresenterConsole from '@/components/presentation/PresenterConsole'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  robots: 'noindex, nofollow',
}

export default async function PresenterPage({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { token?: string }
}) {
  const supabase = createClient()
  const { slug } = params
  const { token } = searchParams

  // Must be authenticated or have valid share token
  let presentation = null

  // Try with auth first
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const { data } = await supabase
      .from('presentations')
      .select('*')
      .eq('slug', slug)
      .single()
    presentation = data
  }

  // Try shareable with token
  if (!presentation && token) {
    const { data } = await supabase
      .from('presentations')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'shareable')
      .eq('share_token', token)
      .single()
    presentation = data
  }

  if (!presentation) notFound()

  return <PresenterConsole presentation={presentation} />
}
