'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'

interface Article {
  id: string; title: string; slug: string; status: string
  published_at: string | null; tags: string[]; created_at: string
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/articles')
      .then(r => r.json())
      .then(data => { setArticles(data.articles || []); setLoading(false) })
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-[#0f172a]">Articles</h1>
        <Link href="/admin/articles/new" className="flex items-center gap-2 px-4 py-2 bg-[#06b6d4] text-white rounded-lg text-sm font-semibold hover:bg-[#0891b2] transition-colors">
          <Plus size={16} /> New Article
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Title</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Status</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Tags</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-400">Loading...</td></tr>
            ) : articles.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-400">No articles yet. Create your first one.</td></tr>
            ) : articles.map(a => (
              <tr key={a.id} className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer" onClick={() => window.location.href = `/admin/articles/${a.id}/edit`}>
                <td className="px-4 py-3 font-medium text-[#0f172a]">{a.title}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${a.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {a.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1 flex-wrap">
                    {a.tags?.slice(0, 3).map(t => <span key={t} className="text-xs px-2 py-0.5 bg-slate-100 rounded-full text-slate-600">{t}</span>)}
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-500">{new Date(a.published_at || a.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
