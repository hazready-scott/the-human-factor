import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'

export const revalidate = 60

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const supabase = createClient()
  const { data: article } = await supabase
    .from('articles')
    .select('title, seo_title, seo_description, seo_keywords, excerpt')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single()

  if (!article) return {}
  return {
    title: `${article.seo_title || article.title} | The Human Factor`,
    description: article.seo_description || article.excerpt || '',
    keywords: article.seo_keywords || undefined,
  }
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const supabase = createClient()
  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single()

  if (!article) notFound()

  return (
    <>
      <section className="pt-32 pb-12 px-6 text-white">
        <div className="max-w-3xl mx-auto">
          <Link href="/resources" className="text-sm text-slate-500 hover:text-white transition-colors mb-4 inline-block">&larr; Back to Resources</Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{article.title}</h1>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span>{article.author_name}</span>
            <span>&middot;</span>
            <span>{article.published_at ? new Date(article.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}</span>
          </div>
          {article.tags?.length > 0 && (
            <div className="flex gap-2 mt-4">
              {article.tags.map((tag: string) => (
                <span key={tag} className="text-xs px-3 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>{tag}</span>
              ))}
            </div>
          )}
        </div>
      </section>

      {article.cover_image_url && (
        <div className="max-w-4xl mx-auto px-6 -mt-6">
          <img src={article.cover_image_url} alt="" className="w-full h-64 md:h-96 object-cover rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }} />
        </div>
      )}

      <section className="section-pad">
        <div className="max-w-3xl mx-auto">
          <div
            className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-slate-300 prose-a:text-[#06b6d4] prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-blockquote:border-white/10 prose-blockquote:text-slate-400"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>
      </section>
    </>
  )
}
