import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Resources | The Human Factor',
  description: 'Articles, insights, and practical guidance on system improvement, AI integration, quality improvement, and human-centered design.',
}

export const revalidate = 60

export default async function ResourcesPage() {
  const supabase = createClient()
  const { data: articles } = await supabase
    .from('articles')
    .select('slug, title, excerpt, cover_image_url, author_name, published_at, tags')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

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
          {!articles || articles.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-500 text-lg">Articles coming soon.</p>
              <p className="text-slate-600 text-sm mt-2">Check back for insights on system improvement and AI integration.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <Link key={article.slug} href={`/resources/${article.slug}`} className="group">
                  <div className="card h-full flex flex-col p-0 overflow-hidden">
                    {article.cover_image_url ? (
                      <img src={article.cover_image_url} alt="" className="w-full h-48 object-cover" />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-[#0c4a6e] to-[#1e3a5f]" />
                    )}
                    <div className="p-6 flex-1 flex flex-col">
                      <h2 className="text-lg font-bold text-white mb-2 group-hover:text-[#06b6d4] transition-colors">{article.title}</h2>
                      {article.excerpt && <p className="text-sm text-slate-500 line-clamp-3 mb-4">{article.excerpt}</p>}
                      <div className="flex items-center justify-between mt-auto pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <span className="text-xs text-slate-600">{article.published_at ? new Date(article.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}</span>
                        <div className="flex gap-1">
                          {article.tags?.slice(0, 2).map((tag: string) => (
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
