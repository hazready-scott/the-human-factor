'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, ExternalLink } from 'lucide-react'

interface Associate {
  id: string
  slug: string
  name: string
  role: string
  title: string
  credentials: string
  bio: string
  photo_url: string
  email: string
  phone: string
  linkedin: string
  website: string
  specialties: string[]
  is_active: boolean
  sort_order: number
}

export default function AssociatesPage() {
  const [associates, setAssociates] = useState<Associate[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Associate | null>(null)
  const [showForm, setShowForm] = useState(false)

  const fetchAssociates = async () => {
    const res = await fetch('/api/admin/associates')
    if (res.ok) setAssociates(await res.json())
    setLoading(false)
  }

  useEffect(() => { fetchAssociates() }, [])

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const body: Record<string, unknown> = {
      name: form.get('name'),
      slug: form.get('slug'),
      role: form.get('role'),
      title: form.get('title'),
      credentials: form.get('credentials'),
      bio: form.get('bio'),
      photo_url: form.get('photo_url'),
      email: form.get('email'),
      phone: form.get('phone'),
      linkedin: form.get('linkedin'),
      website: form.get('website'),
      specialties: (form.get('specialties') as string)?.split(',').map(s => s.trim()).filter(Boolean) || [],
      is_active: form.get('is_active') === 'on',
    }

    const url = editing ? `/api/admin/associates/${editing.id}` : '/api/admin/associates'
    const method = editing ? 'PATCH' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    if (res.ok) {
      setShowForm(false)
      setEditing(null)
      fetchAssociates()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this associate?')) return
    await fetch(`/api/admin/associates/${id}`, { method: 'DELETE' })
    fetchAssociates()
  }

  if (loading) return <div className="p-8 text-slate-500">Loading...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Associates</h1>
        <button
          onClick={() => { setEditing(null); setShowForm(true) }}
          className="flex items-center gap-2 px-4 py-2 bg-[#06b6d4] text-white rounded-lg text-sm font-semibold hover:bg-[#0891b2] transition-colors"
        >
          <Plus size={16} /> Add Associate
        </button>
      </div>

      {showForm && (
        <div className="admin-card p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">{editing ? 'Edit' : 'Add'} Associate</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Name *</label>
                <input name="name" defaultValue={editing?.name || ''} required className="admin-input w-full" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Slug</label>
                <input name="slug" defaultValue={editing?.slug || ''} placeholder="auto-generated" className="admin-input w-full" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Role</label>
                <input name="role" defaultValue={editing?.role || ''} placeholder="e.g., Associate, Partner" className="admin-input w-full" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Title</label>
                <input name="title" defaultValue={editing?.title || ''} placeholder="e.g., Human Factors Engineer" className="admin-input w-full" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Credentials</label>
                <input name="credentials" defaultValue={editing?.credentials || ''} placeholder="e.g., PhD, P.Eng." className="admin-input w-full" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Bio</label>
              <textarea name="bio" defaultValue={editing?.bio || ''} rows={4} className="admin-input w-full resize-y" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Photo URL</label>
              <input name="photo_url" defaultValue={editing?.photo_url || ''} className="admin-input w-full" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Email</label>
                <input name="email" type="email" defaultValue={editing?.email || ''} className="admin-input w-full" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Phone</label>
                <input name="phone" defaultValue={editing?.phone || ''} className="admin-input w-full" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">LinkedIn</label>
                <input name="linkedin" defaultValue={editing?.linkedin || ''} placeholder="https://linkedin.com/in/..." className="admin-input w-full" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Website</label>
                <input name="website" defaultValue={editing?.website || ''} className="admin-input w-full" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Specialties (comma-separated)</label>
              <input name="specialties" defaultValue={editing?.specialties?.join(', ') || ''} placeholder="Human Factors, AI Integration, Patient Safety" className="admin-input w-full" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="is_active" id="is_active" defaultChecked={editing?.is_active ?? true} className="rounded" />
              <label htmlFor="is_active" className="text-sm text-slate-400">Active (visible on public site)</label>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="px-4 py-2 bg-[#06b6d4] text-white rounded-lg text-sm font-semibold hover:bg-[#0891b2]">
                {editing ? 'Update' : 'Create'} Associate
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditing(null) }} className="px-4 py-2 text-slate-400 hover:text-white text-sm">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-card p-0 overflow-hidden">
        <table className="admin-table w-full">
          <thead>
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Associate</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Role / Title</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {associates.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-600">No associates yet</td></tr>
            ) : associates.map(a => (
              <tr key={a.id} className="border-t border-white/5 hover:bg-white/[0.02]">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {a.photo_url ? (
                      <img src={a.photo_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-semibold text-sm">
                        {a.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-white">{a.name}</p>
                      {a.credentials && <p className="text-[10px] text-slate-500">{a.credentials}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-slate-300">{a.role || '—'}</p>
                  <p className="text-xs text-slate-500">{a.title || ''}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs ${a.is_active ? 'bg-green-500/20 text-green-300' : 'bg-slate-500/20 text-slate-400'}`}>
                    {a.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <a href={`/team/${a.slug}`} target="_blank" rel="noopener" className="text-slate-500 hover:text-cyan-400 transition-colors">
                      <ExternalLink size={14} />
                    </a>
                    <button onClick={() => { setEditing(a); setShowForm(true) }} className="text-slate-500 hover:text-cyan-400 transition-colors">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDelete(a.id)} className="text-slate-500 hover:text-red-400 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
