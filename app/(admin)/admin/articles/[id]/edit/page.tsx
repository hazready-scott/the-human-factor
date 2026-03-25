'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import ArticleEditor from '@/components/admin/ArticleEditor'

export default function EditArticlePage() {
  const params = useParams()
  const [article, setArticle] = useState(null)

  useEffect(() => {
    fetch(`/api/admin/articles/${params.id}`)
      .then(r => r.json())
      .then(data => setArticle(data.article))
  }, [params.id])

  if (!article) return <div className="text-slate-400 text-center py-20">Loading...</div>

  return <ArticleEditor article={article} mode="edit" />
}
