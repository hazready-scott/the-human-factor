'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, ExternalLink, ChevronUp, ChevronDown, X } from 'lucide-react'

interface Credential {
  id: string
  label: string
  category: 'academic' | 'professional' | 'award' | 'certification'
  year: number | null
}

interface Associate {
  id: string
  slug: string
  name: string
  role: string
  title: string
  credentials: Credential[]
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

const CATEGORY_STYLES: Record<string, string> = {
  academic: 'bg-[#1a2744] text-white border border-[#c9944a]',
  professional: 'bg-blue-800 text-white',
  award: 'bg-[#c9944a] text-white',
  certification: 'bg-green-800 text-white',
}

function CredentialPreview({ credentials }: { credentials: Credential[] }) {
  if (credentials.length === 0) return <p className="text-xs text-slate-600">No credentials added</p>
  return (
    <div className="flex flex-wrap gap-2">
      {credentials.map(c => (
        <span key={c.id} className={`px-3 py-1 rounded-full text-[11px] font-medium ${CATEGORY_STYLES[c.category] || 'bg-slate-700 text-white'}`}>
          {c.label.length > 40 ? c.label.substring(0, 37) + '...' : c.label}
          {c.year ? ` (${c.year})` : ''}
        </span>
      ))}
    </div>
  )
}

export default function AssociatesPage() {
  const [associates, setAssociates] = useState<Associate[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Associate | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [credentials, setCredentials] = useState<Credential[]>([])

  const fetchAssociates = async () => {
    const res = await fetch('/api/admin/associates')
    if (res.ok) setAssociates(await res.json())
    setLoading(false)
  }

  useEffect(() => { fetchAssociates() }, [])

  const openForm = (associate?: Associate) => {
    setEditing(associate || null)
    setCredentials(associate?.credentials || [])
    setShowForm(true)
  }

  const addCredential = () => {
    setCredentials(prev => [...prev, {
      id: crypto.randomUUID(),
      label: '',
      category: 'professional',
      year: null,
    }])
  }

  const updateCredential = (id: string, field: string, value: string | number | null) => {
    setCredentials(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c))
  }

  const removeCredential = (id: string) => {
    setCredentials(prev => prev.filter(c => c.id !== id))
  }

  const moveCredential = (index: number, direction: -1 | 1) => {
    const newCreds = [...credentials]
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= newCreds.length) return
    ;[newCreds[index], newCreds[newIndex]] = [newCreds[newIndex], newCreds[index]]
    setCredentials(newCreds)
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const body: Record<string, unknown> = {
      name: form.get('name'),
      slug: form.get('slug'),
      role: form.get('role'),
      title: form.get('title'),
      credentials: credentials.filter(c => c.label.trim()),
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
      setCredentials([])
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
          onClick={() => openForm()}
          className="flex items-center gap-2 px-4 py-2 bg-[#c9944a] text-white rounded-lg text-sm font-semibold hover:bg-[#b07d3a] transition-colors"
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Role</label>
                <input name="role" defaultValue={editing?.role || ''} placeholder="e.g., Associate, Partner" className="admin-input w-full" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Title</label>
                <input name="title" defaultValue={editing?.title || ''} placeholder="e.g., Human Factors Engineer" className="admin-input w-full" />
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

            {/* Credential Manager */}
            <div className="border border-white/10 rounded-lg p-4 mt-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white">Credentials</h3>
                <button type="button" onClick={addCredential} className="flex items-center gap-1 text-xs text-[#c9944a] hover:text-[#d4a85c]">
                  <Plus size={14} /> Add Credential
                </button>
              </div>

              {credentials.length === 0 ? (
                <p className="text-xs text-slate-600">No credentials. Click &quot;Add Credential&quot; to start.</p>
              ) : (
                <div className="space-y-2">
                  {credentials.map((cred, idx) => (
                    <div key={cred.id} className="flex items-center gap-2 bg-white/[0.02] rounded-lg p-2">
                      <div className="flex flex-col gap-0.5">
                        <button type="button" onClick={() => moveCredential(idx, -1)} disabled={idx === 0}
                          className="text-slate-600 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed"><ChevronUp size={12} /></button>
                        <button type="button" onClick={() => moveCredential(idx, 1)} disabled={idx === credentials.length - 1}
                          className="text-slate-600 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed"><ChevronDown size={12} /></button>
                      </div>
                      <input
                        value={cred.label}
                        onChange={e => updateCredential(cred.id, 'label', e.target.value)}
                        placeholder="Credential label..."
                        className="admin-input flex-1 text-xs py-1.5"
                      />
                      <select
                        value={cred.category}
                        onChange={e => updateCredential(cred.id, 'category', e.target.value)}
                        className="admin-input w-32 text-xs py-1.5"
                      >
                        <option value="academic">Academic</option>
                        <option value="professional">Professional</option>
                        <option value="award">Award</option>
                        <option value="certification">Certification</option>
                      </select>
                      <input
                        type="number"
                        value={cred.year || ''}
                        onChange={e => updateCredential(cred.id, 'year', e.target.value ? parseInt(e.target.value) : null)}
                        placeholder="Year"
                        className="admin-input w-20 text-xs py-1.5"
                      />
                      <button type="button" onClick={() => removeCredential(cred.id)} className="text-slate-600 hover:text-red-400">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Live preview */}
              {credentials.filter(c => c.label.trim()).length > 0 && (
                <div className="mt-4 pt-3 border-t border-white/5">
                  <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-2">Preview</p>
                  <CredentialPreview credentials={credentials.filter(c => c.label.trim())} />
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" name="is_active" id="is_active" defaultChecked={editing?.is_active ?? true} className="rounded" />
              <label htmlFor="is_active" className="text-sm text-slate-400">Active (visible on public site)</label>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="px-4 py-2 bg-[#c9944a] text-white rounded-lg text-sm font-semibold hover:bg-[#b07d3a]">
                {editing ? 'Update' : 'Create'} Associate
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditing(null); setCredentials([]) }} className="px-4 py-2 text-slate-400 hover:text-white text-sm">
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
                      <div className="w-10 h-10 rounded-full bg-[#c9944a]/20 flex items-center justify-center text-[#c9944a] font-semibold text-sm">
                        {a.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-white">{a.name}</p>
                      {Array.isArray(a.credentials) && a.credentials.length > 0 && (
                        <p className="text-[10px] text-slate-500">{a.credentials.length} credential{a.credentials.length !== 1 ? 's' : ''}</p>
                      )}
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
                    <a href={`/team/${a.slug}`} target="_blank" rel="noopener" className="text-slate-500 hover:text-[#c9944a] transition-colors">
                      <ExternalLink size={14} />
                    </a>
                    <button onClick={() => openForm(a)} className="text-slate-500 hover:text-[#c9944a] transition-colors">
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
