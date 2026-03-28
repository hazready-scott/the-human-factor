import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AudienceView from '@/components/presentation/interactive/AudienceView'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Live Poll | The Human Factor',
  robots: 'noindex, nofollow',
}

export default async function LivePollPage({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { token?: string }
}) {
  const supabase = createClient()
  const { slug } = params
  const { token } = searchParams

  let presentation = null

  // Published presentations are publicly accessible
  const { data: published } = await supabase
    .from('presentations')
    .select('id, title, slug, author_name, settings')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (published) {
    presentation = published
  }

  // Shareable with token
  if (!presentation && token) {
    const { data: shared } = await supabase
      .from('presentations')
      .select('id, title, slug, author_name, settings')
      .eq('slug', slug)
      .eq('status', 'shareable')
      .eq('share_token', token)
      .single()
    if (shared) presentation = shared
  }

  // Authenticated user can access any status
  if (!presentation) {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: authed } = await supabase
        .from('presentations')
        .select('id, title, slug, author_name, settings')
        .eq('slug', slug)
        .single()
      if (authed) presentation = authed
    }
  }

  if (!presentation) notFound()

  return <AudienceView presentation={presentation} />
}
