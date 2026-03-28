import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Resources | The Human Factor',
  description: 'Articles, presentations, and practical guidance on system improvement, AI integration, quality improvement, and human-centered design.',
}

export const revalidate = 60

interface ResourceItem {
  type: 'article' | 'presentation'
  slug: string
  title: string
  excerpt?: string | null
  description?: string | null
  cover_image_url?: string | null
  published_at?: string | null
  tags?: string[] | null
  slideCount?: number
}

export default async function ResourcesPage() {
  const supabase = createClient()

  const [articlesRes, presentationsRes] = await Promise.all([
    supabase
      .from('articles')
      .select('slug, title, excerpt, cover_image_url, author_name, published_at, tags')
      .eq('status', 'published')
      .order('published_at', { ascending: false }),
    supabase
      .from('presentations')
      .select('slug, title, description, cover_image_url, published_at, tags, slides')
      .eq('status', 'published')
      .order('published_at', { ascending: false }),
  ])

  const articles: ResourceItem[] = (articlesRes.data || []).map(a => ({
    type: 'article' as const,
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    cover_image_url: a.cover_image_url,
    published_at: a.published_at,
    tags: a.tags,
  }))

  const presentations: ResourceItem[] = (presentationsRes.data || []).map(p => ({
    type: 'presentation' as const,
    slug: p.slug,
    title: p.title,
    description: p.description,
    cover_image_url: p.cover_image_url,
    published_at: p.published_at,
    tags: p.tags,
    slideCount: Array.isArray(p.slides) ? p.slides.length : 0,
  }))

  // Merge and sort by published_at descending
  const resources = [...articles, ...presentations].sort((a, b) => {
    const dateA = a.published_at ? new Date(a.published_at).getTime() : 0
    const dateB = b.published_at ? new Date(b.published_at).getTime() : 0
    return dateB - dateA
  })

  return (
    <>
      <section className="pt-32 pb-12 px-6 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="accent-bar mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Resources</h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">Practical insights on system improvement, AI integration, and building organizations where people and technology work well together.</p>
        </div>
      </section>

      <section className="section-pad">
        <div className="max-w-6xl mx-auto">
          {resources.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-500 text-lg">Content coming soon.</p>
              <p className="text-slate-600 text-sm mt-2">Check back for insights on system improvement and AI integration.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {resources.map((item) => (
                <Link
                  key={`${item.type}-${item.slug}`}
                  href={item.type === 'article' ? `/resources/${item.slug}` : `/p/${item.slug}`}
                  className="group"
                >
                  <div className="card h-full flex flex-col p-0 overflow-hidden">
                    {item.cover_image_url ? (
                      <div className="relative">
                        <img src={item.cover_image_url} alt="" className="w-full h-48 object-cover" />
                        {item.type === 'presentation' && (
                          <span className="absolute top-3 right-3 text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded bg-purple-500/80 text-white">
                            Presentation
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="relative w-full h-48 bg-gradient-to-br from-[#0c4a6e] to-[#1e3a5f]">
                        {item.type === 'presentation' && (
                          <span className="absolute top-3 right-3 text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded bg-purple-500/80 text-white">
                            Presentation
                          </span>
                        )}
                      </div>
                    )}
                    <div className="p-6 flex-1 flex flex-col">
                      <h2 className="text-lg font-bold text-white mb-2 group-hover:text-[#06b6d4] transition-colors">{item.title}</h2>
                      {(item.excerpt || item.description) && (
                        <p className="text-sm text-slate-500 line-clamp-3 mb-4">{item.excerpt || item.description}</p>
                      )}
                      <div className="flex items-center justify-between mt-auto pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-600">
                            {item.published_at ? new Date(item.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
                          </span>
                          {item.type === 'presentation' && item.slideCount ? (
                            <span className="text-xs text-slate-600">• {item.slideCount} slides</span>
                          ) : null}
                        </div>
                        <div className="flex gap-1">
                          {item.tags?.slice(0, 2).map((tag: string) => (
                            <span key={tag} className="text-xs px-2 py-0.5 rounded-full text-slate-500" style={{ background: 'rgba(255,255,255,0.06)' }}>{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
