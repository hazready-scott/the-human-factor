import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PresentationViewer from '@/components/presentation/PresentationViewer'
import type { Metadata } from 'next'

export const revalidate = 60

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const supabase = createClient()
  const { data } = await supabase
    .from('presentations')
    .select('title, seo_title, seo_description, seo_keywords, cover_image_url')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single()

  if (!data) return { title: 'Presentation' }

  return {
    title: data.seo_title || data.title,
    description: data.seo_description || undefined,
    keywords: data.seo_keywords || undefined,
    openGraph: {
      title: data.seo_title || data.title,
      description: data.seo_description || undefined,
      images: data.cover_image_url ? [data.cover_image_url] : undefined,
    },
  }
}

export default async function PresentationPage({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { token?: string }
}) {
  const supabase = createClient()
  const { slug } = params
  const { token } = searchParams

  // Try published first (public access)
  let { data: presentation } = await supabase
    .from('presentations')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

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

  // Try private/draft with auth
  if (!presentation) {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data } = await supabase
        .from('presentations')
        .select('*')
        .eq('slug', slug)
        .in('status', ['private', 'draft', 'shareable'])
        .single()
      presentation = data
    }
  }

  if (!presentation) notFound()

  return <PresentationViewer presentation={presentation} />
}
