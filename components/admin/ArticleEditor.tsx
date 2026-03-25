'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import {
  Bold, Italic, Underline as UnderlineIcon, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Code, Link as LinkIcon, ImageIcon,
  AlignLeft, AlignCenter, AlignRight, Save, Trash2, Eye, Sparkles,
} from 'lucide-react'

interface Article {
  id?: string
  title: string
  slug: string
  excerpt: string
  content: string
  cover_image_url: string
  author_name: string
  status: 'draft' | 'published'
  tags: string[]
  seo_title: string
  seo_description: string
  seo_keywords: string
}

const DEFAULT_ARTICLE: Article = {
  title: '', slug: '', excerpt: '', content: '', cover_image_url: '',
  author_name: 'The Human Factor', status: 'draft', tags: [],
  seo_title: '', seo_description: '', seo_keywords: '',
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
}

function ToolbarButton({ onClick, active, children, title }: { onClick: () => void; active?: boolean; children: React.ReactNode; title: string }) {
  return (
    <button type="button" onClick={onClick} title={title}
      className={`p-2 rounded transition-colors ${active ? 'bg-cyan-500/20 text-[#06b6d4]' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}>
      {children}
    </button>
  )
}

export default function ArticleEditor({ article: initial, mode }: { article?: Article; mode: 'create' | 'edit' }) {
  const router = useRouter()
  const [article, setArticle] = useState<Article>({ ...DEFAULT_ARTICLE, ...initial })
  const [saving, setSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [tagsInput, setTagsInput] = useState(article.tags.join(', '))
  const [aiLoading, setAiLoading] = useState(false)
  const [showAiMenu, setShowAiMenu] = useState(false)
  const aiMenuRef = useRef<HTMLDivElement>(null)

  // Close AI menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (aiMenuRef.current && !aiMenuRef.current.contains(e.target as Node)) setShowAiMenu(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const callAI = async (action: string, context: Record<string, string>) => {
    setAiLoading(true)
    setShowAiMenu(false)
    try {
      const res = await fetch('/api/admin/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, context }),
      })
      if (!res.ok) {
        const err = await res.json()
        alert(err.error || 'AI generation failed')
        return null
      }
      return await res.json()
    } catch {
      alert('AI generation failed')
      return null
    } finally {
      setAiLoading(false)
    }
  }

  const handleAiDraft = async () => {
    const topic = window.prompt('What should the article be about?')
    if (!topic) return
    const data = await callAI('draft', { topic })
    if (data?.result && editor) {
      editor.commands.setContent(data.result)
      setArticle(prev => ({ ...prev, content: data.result }))
    }
  }

  const handleAiOutline = async () => {
    const topic = window.prompt('What topic should the outline cover?')
    if (!topic) return
    const data = await callAI('outline', { topic })
    if (data?.result && editor) {
      editor.commands.setContent(data.result)
      setArticle(prev => ({ ...prev, content: data.result }))
    }
  }

  const handleAiImprove = async () => {
    if (!article.content || article.content === '<p></p>') return alert('Write some content first')
    const data = await callAI('improve', { content: article.content })
    if (data?.result && editor) {
      editor.commands.setContent(data.result)
      setArticle(prev => ({ ...prev, content: data.result }))
    }
  }

  const handleAiSeo = async () => {
    if (!article.title) return alert('Add a title first')
    const data = await callAI('seo', { title: article.title, content: article.content })
    if (data?.result && data.type === 'json') {
      setArticle(prev => ({
        ...prev,
        seo_title: data.result.seo_title || prev.seo_title,
        seo_description: data.result.seo_description || prev.seo_description,
        seo_keywords: data.result.seo_keywords || prev.seo_keywords,
      }))
    }
  }

  const handleAiExcerpt = async () => {
    if (!article.content || article.content === '<p></p>') return alert('Write some content first')
    const data = await callAI('excerpt', { title: article.title, content: article.content })
    if (data?.result) {
      setArticle(prev => ({ ...prev, excerpt: data.result }))
    }
  }

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
      Placeholder.configure({ placeholder: 'Start writing your article...' }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: article.content,
    onUpdate: ({ editor }) => {
      setArticle(prev => ({ ...prev, content: editor.getHTML() }))
    },
    editorProps: {
      attributes: {
        class: 'prose prose-slate max-w-none min-h-[400px] p-4 focus:outline-none',
      },
    },
  })

  const handleTitleChange = (title: string) => {
    setArticle(prev => ({
      ...prev,
      title,
      slug: mode === 'create' ? slugify(title) : prev.slug,
    }))
  }

  const setLink = useCallback(() => {
    if (!editor) return
    const url = window.prompt('Enter URL:')
    if (url) editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  const addImage = useCallback(() => {
    if (!editor) return
    const url = window.prompt('Enter image URL:')
    if (url) editor.chain().focus().setImage({ src: url }).run()
  }, [editor])

  const handleSave = async () => {
    if (!article.title) return alert('Title is required')
    setSaving(true)

    const payload = {
      ...article,
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
    }

    const url = mode === 'edit' ? `/api/admin/articles/${article.id}` : '/api/admin/articles'
    const method = mode === 'edit' ? 'PATCH' : 'POST'

    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    const data = await res.json()
    setSaving(false)

    if (res.ok) {
      router.push('/admin/articles')
      router.refresh()
    } else {
      alert(data.error || 'Failed to save')
    }
  }

  const handleDelete = async () => {
    if (!article.id || !confirm('Delete this article permanently?')) return
    await fetch(`/api/admin/articles/${article.id}`, { method: 'DELETE' })
    router.push('/admin/articles')
  }

  if (!editor) return null

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">
          {mode === 'create' ? 'New Article' : 'Edit Article'}
        </h1>
        <div className="flex gap-3">
          <button onClick={() => setShowPreview(!showPreview)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white transition-colors" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
            <Eye size={16} /> {showPreview ? 'Editor' : 'Preview'}
          </button>
          <div className="relative" ref={aiMenuRef}>
            <button
              onClick={() => setShowAiMenu(!showAiMenu)}
              disabled={aiLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-purple-400 hover:text-purple-300 disabled:opacity-50 transition-colors"
              style={{ border: '1px solid rgba(139,92,246,0.3)' }}
            >
              <Sparkles size={16} className={aiLoading ? 'animate-spin' : ''} />
              {aiLoading ? 'Generating...' : 'AI Assist'}
            </button>
            {showAiMenu && (
              <div className="absolute right-0 top-full mt-1 w-56 rounded-xl shadow-2xl z-50 py-1 border" style={{ background: '#1e293b', borderColor: 'rgba(255,255,255,0.1)' }}>
                {[
                  { label: 'Draft from topic...', action: handleAiDraft, desc: 'Generate a full article' },
                  { label: 'Generate outline...', action: handleAiOutline, desc: 'Create article structure' },
                  { label: 'Improve content', action: handleAiImprove, desc: 'Polish existing text' },
                  { label: 'Generate SEO', action: handleAiSeo, desc: 'Fill SEO fields' },
                  { label: 'Generate excerpt', action: handleAiExcerpt, desc: 'Create card summary' },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={item.action}
                    className="w-full text-left px-4 py-2.5 hover:bg-white/5 transition-colors"
                  >
                    <div className="text-sm font-medium text-slate-200">{item.label}</div>
                    <div className="text-xs text-slate-500">{item.desc}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
          {mode === 'edit' && (
            <button onClick={handleDelete} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors" style={{ border: '1px solid rgba(239,68,68,0.2)' }}>
              <Trash2 size={16} /> Delete
            </button>
          )}
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-[#06b6d4] text-white rounded-lg text-sm font-semibold hover:bg-[#0891b2] disabled:opacity-50">
            <Save size={16} /> {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-4">
          <input value={article.title} onChange={e => handleTitleChange(e.target.value)} placeholder="Article title"
            className="admin-input text-2xl font-bold" />

          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Slug:</span>
            <input value={article.slug} onChange={e => setArticle(prev => ({ ...prev, slug: e.target.value }))}
              className="admin-input flex-1 py-1 text-sm" />
          </div>

          {showPreview ? (
            <div className="bg-white rounded-xl p-6">
              <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
            </div>
          ) : (
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
              {/* Toolbar */}
              <div className="flex flex-wrap gap-0.5 p-2 border-b" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}>
                <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold"><Bold size={16} /></ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic"><Italic size={16} /></ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline"><UnderlineIcon size={16} /></ToolbarButton>
                <div className="w-px mx-1" style={{ background: 'rgba(255,255,255,0.08)' }} />
                <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="Heading 1"><Heading1 size={16} /></ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading 2"><Heading2 size={16} /></ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Heading 3"><Heading3 size={16} /></ToolbarButton>
                <div className="w-px mx-1" style={{ background: 'rgba(255,255,255,0.08)' }} />
                <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet List"><List size={16} /></ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered List"><ListOrdered size={16} /></ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Quote"><Quote size={16} /></ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Code"><Code size={16} /></ToolbarButton>
                <div className="w-px mx-1" style={{ background: 'rgba(255,255,255,0.08)' }} />
                <ToolbarButton onClick={setLink} active={editor.isActive('link')} title="Link"><LinkIcon size={16} /></ToolbarButton>
                <ToolbarButton onClick={addImage} title="Image"><ImageIcon size={16} /></ToolbarButton>
                <div className="w-px mx-1" style={{ background: 'rgba(255,255,255,0.08)' }} />
                <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Align Left"><AlignLeft size={16} /></ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Align Center"><AlignCenter size={16} /></ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Align Right"><AlignRight size={16} /></ToolbarButton>
              </div>
              <EditorContent editor={editor} />
            </div>
          )}

          <textarea value={article.excerpt} onChange={e => setArticle(prev => ({ ...prev, excerpt: e.target.value }))}
            placeholder="Article excerpt (shown on cards)" rows={3}
            className="admin-input resize-none" />
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Status */}
          <div className="admin-card p-4">
            <h3 className="font-semibold text-white mb-3">Publish</h3>
            <div className="flex gap-2">
              <button onClick={() => setArticle(prev => ({ ...prev, status: 'draft' }))}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${article.status === 'draft' ? 'bg-yellow-500/20 text-yellow-300' : 'text-slate-500'}`}
                style={article.status !== 'draft' ? { background: 'rgba(255,255,255,0.03)' } : {}}>
                Draft
              </button>
              <button onClick={() => setArticle(prev => ({ ...prev, status: 'published' }))}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${article.status === 'published' ? 'bg-green-500/20 text-green-300' : 'text-slate-500'}`}
                style={article.status !== 'published' ? { background: 'rgba(255,255,255,0.03)' } : {}}>
                Published
              </button>
            </div>
          </div>

          {/* Cover Image */}
          <div className="admin-card p-4">
            <h3 className="font-semibold text-white mb-3">Cover Image</h3>
            <input value={article.cover_image_url} onChange={e => setArticle(prev => ({ ...prev, cover_image_url: e.target.value }))}
              placeholder="Image URL" className="admin-input text-sm" />
            {article.cover_image_url && (
              <img src={article.cover_image_url} alt="" className="mt-2 rounded-lg w-full h-32 object-cover" />
            )}
          </div>

          {/* Tags */}
          <div className="admin-card p-4">
            <h3 className="font-semibold text-white mb-3">Tags</h3>
            <input value={tagsInput} onChange={e => setTagsInput(e.target.value)}
              placeholder="Comma-separated tags" className="admin-input text-sm" />
          </div>

          {/* Author */}
          <div className="admin-card p-4">
            <h3 className="font-semibold text-white mb-3">Author</h3>
            <input value={article.author_name} onChange={e => setArticle(prev => ({ ...prev, author_name: e.target.value }))}
              className="admin-input text-sm" />
          </div>

          {/* SEO */}
          <div className="admin-card p-4">
            <h3 className="font-semibold text-white mb-3">SEO</h3>
            <div className="space-y-3">
              <input value={article.seo_title} onChange={e => setArticle(prev => ({ ...prev, seo_title: e.target.value }))}
                placeholder="SEO Title" className="admin-input text-sm" />
              <textarea value={article.seo_description} onChange={e => setArticle(prev => ({ ...prev, seo_description: e.target.value }))}
                placeholder="SEO Description" rows={3} className="admin-input text-sm resize-none" />
              <input value={article.seo_keywords} onChange={e => setArticle(prev => ({ ...prev, seo_keywords: e.target.value }))}
                placeholder="SEO Keywords" className="admin-input text-sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
