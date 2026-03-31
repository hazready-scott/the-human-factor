'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Plus, Pencil, Trash2, ExternalLink, ChevronUp, ChevronDown, X, Upload, ImageIcon } from 'lucide-react'

interface Credential {
  id: string
  label: string
  category: 'academic' | 'professional' | 'award' | 'certification'
  year: number | null
  is_visible: boolean
}

interface Publication {
  id: string
  year: number | null
  name: string
  doi: string
  url: string
  is_visible: boolean
}

interface Associate {
  id: string
  slug: string
  name: string
  role: string
  title: string
  credentials: Credential[]
  publications: Publication[]
  bio: string
  photo_url: string
  email: string
  phone: string
  linkedin: string
  website: string
  specialties: string[]
  booking_url: string
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

function PhotoUpload({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const uploadFile = useCallback(async (file: File) => {
    setError('')
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowed.includes(file.type)) {
      setError('Use JPEG, PNG, WebP, or GIF.')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('Max 2MB.')
      return
    }
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Upload failed')
        return
      }
      const { url } = await res.json()
      onChange(url)
    } catch {
      setError('Upload failed')
    } finally {
      setUploading(false)
    }
  }, [onChange])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) uploadFile(file)
  }, [uploadFile])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) uploadFile(file)
  }

  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1">Photo</label>
      <div className="flex items-start gap-4">
        {/* Preview */}
        {value ? (
          <img src={value} alt="Profile" className="w-20 h-20 rounded-full object-cover ring-2 ring-white/10 flex-shrink-0" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 ring-2 ring-white/10">
            <ImageIcon size={24} className="text-slate-600" />
          </div>
        )}

        {/* Drop zone */}
        <div
          className={`flex-1 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
            dragOver ? 'border-[#c9944a] bg-[#c9944a]/5' : 'border-white/10 hover:border-white/20'
          }`}
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input ref={inputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          {uploading ? (
            <p className="text-xs text-slate-400">Uploading...</p>
          ) : (
            <>
              <Upload size={18} className="mx-auto text-slate-500 mb-1" />
              <p className="text-xs text-slate-400">Drag & drop or click to upload</p>
              <p className="text-[10px] text-slate-600 mt-1">JPEG, PNG, WebP, GIF — max 2MB</p>
            </>
          )}
        </div>
      </div>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
      {/* Hidden field for form submission */}
      <input type="hidden" name="photo_url" value={value} />
    </div>
  )
}

export default function AssociatesPage() {
  const [associates, setAssociates] = useState<Associate[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Associate | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [credentials, setCredentials] = useState<Credential[]>([])
  const [publications, setPublications] = useState<Publication[]>([])
  const [photoUrl, setPhotoUrl] = useState('')

  const fetchAssociates = async () => {
    const res = await fetch('/api/admin/associates')
    if (res.ok) setAssociates(await res.json())
    setLoading(false)
  }

  useEffect(() => { fetchAssociates() }, [])

  const openForm = (associate?: Associate) => {
    setEditing(associate || null)
    setCredentials(associate?.credentials || [])
    setPublications(associate?.publications || [])
    setPhotoUrl(associate?.photo_url || '')
    setShowForm(true)
  }

  // --- Credentials ---
  const addCredential = () => {
    setCredentials(prev => [...prev, { id: crypto.randomUUID(), label: '', category: 'professional', year: null, is_visible: true }])
  }
  const updateCredential = (id: string, field: string, value: string | number | boolean | null) => {
    setCredentials(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c))
  }
  const removeCredential = (id: string) => {
    setCredentials(prev => prev.filter(c => c.id !== id))
  }
  const moveCredential = (index: number, direction: -1 | 1) => {
    const arr = [...credentials]
    const ni = index + direction
    if (ni < 0 || ni >= arr.length) return
    ;[arr[index], arr[ni]] = [arr[ni], arr[index]]
    setCredentials(arr)
  }

  // --- Publications ---
  const addPublication = () => {
    setPublications(prev => [...prev, { id: crypto.randomUUID(), year: null, name: '', doi: '', url: '', is_visible: true }])
  }
  const updatePublication = (id: string, field: string, value: string | number | boolean | null) => {
    setPublications(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p))
  }
  const removePublication = (id: string) => {
    setPublications(prev => prev.filter(p => p.id !== id))
  }
  const movePublication = (index: number, direction: -1 | 1) => {
    const arr = [...publications]
    const ni = index + direction
    if (ni < 0 || ni >= arr.length) return
    ;[arr[index], arr[ni]] = [arr[ni], arr[index]]
    setPublications(arr)
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
      publications: publications.filter(p => p.name.trim()),
      bio: form.get('bio'),
      photo_url: photoUrl,
      email: form.get('email'),
      phone: form.get('phone'),
      linkedin: form.get('linkedin'),
      website: form.get('website'),
      specialties: (form.get('specialties') as string)?.split(',').map(s => s.trim()).filter(Boolean) || [],
      booking_url: form.get('booking_url') || '',
      is_active: form.get('is_active') === 'on',
    }

    const url = editing ? `/api/admin/associates/${editing.id}` : '/api/admin/associates'
    const method = editing ? 'PATCH' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    if (res.ok) {
      setShowForm(false)
      setEditing(null)
      setCredentials([])
      setPublications([])
      setPhotoUrl('')
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

            {/* Photo Upload */}
            <PhotoUpload value={photoUrl} onChange={setPhotoUrl} />

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
              <label className="block text-xs font-medium text-slate-500 mb-1">Google Booking Calendar URL</label>
              <input name="booking_url" defaultValue={editing?.booking_url || ''} placeholder="https://calendar.app.google/..." className="admin-input w-full" />
              <p className="text-[10px] text-slate-600 mt-1">Paste Google Calendar appointment booking link. Displays on public profile page.</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Specialties (comma-separated)</label>
              <input name="specialties" defaultValue={editing?.specialties?.join(', ') || ''} placeholder="Human Factors, AI Integration, Patient Safety" className="admin-input w-full" />
            </div>

            {/* ===== Credential Manager ===== */}
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
                    <div key={cred.id} className={`rounded-lg p-3 space-y-2 ${cred.is_visible !== false ? 'bg-white/[0.03]' : 'bg-white/[0.01] opacity-50'}`}>
                      {/* Row 1: Label (full width) */}
                      <input
                        value={cred.label}
                        onChange={e => updateCredential(cred.id, 'label', e.target.value)}
                        placeholder="Credential label..."
                        className="w-full text-sm py-2 px-3 rounded bg-white/5 border border-white/10 text-slate-200 focus:outline-none focus:border-[#c9944a]"
                      />
                      {/* Row 2: Controls */}
                      <div className="flex items-center gap-2">
                        <select
                          value={cred.category}
                          onChange={e => updateCredential(cred.id, 'category', e.target.value)}
                          className="text-xs py-1.5 px-2 rounded bg-white/5 border border-white/10 text-slate-300 focus:outline-none focus:border-[#c9944a]"
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
                          className="w-16 text-xs py-1.5 px-2 rounded bg-white/5 border border-white/10 text-slate-300 focus:outline-none focus:border-[#c9944a]"
                        />
                        <label className="flex items-center gap-1 text-xs text-slate-500 cursor-pointer ml-auto">
                          <input
                            type="checkbox"
                            checked={cred.is_visible !== false}
                            onChange={e => updateCredential(cred.id, 'is_visible', e.target.checked)}
                          />
                          Visible
                        </label>
                        <div className="flex items-center gap-0.5">
                          <button type="button" onClick={() => moveCredential(idx, -1)} disabled={idx === 0}
                            className="text-slate-600 hover:text-white disabled:opacity-20 p-0.5"><ChevronUp size={14} /></button>
                          <button type="button" onClick={() => moveCredential(idx, 1)} disabled={idx === credentials.length - 1}
                            className="text-slate-600 hover:text-white disabled:opacity-20 p-0.5"><ChevronDown size={14} /></button>
                        </div>
                        <button type="button" onClick={() => removeCredential(cred.id)} className="text-slate-600 hover:text-red-400 p-0.5">
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Live preview */}
              {credentials.filter(c => c.label.trim()).length > 0 && (
                <div className="mt-4 pt-3 border-t border-white/5">
                  <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-2">Preview</p>
                  <CredentialPreview credentials={credentials.filter(c => c.label.trim() && c.is_visible !== false)} />
                </div>
              )}
            </div>

            {/* ===== Publications Manager ===== */}
            <div className="border border-white/10 rounded-lg p-4 mt-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white">Relevant Publications</h3>
                <button type="button" onClick={addPublication} className="flex items-center gap-1 text-xs text-[#c9944a] hover:text-[#d4a85c]">
                  <Plus size={14} /> Add Publication
                </button>
              </div>

              {publications.length === 0 ? (
                <p className="text-xs text-slate-600">No publications. Click &quot;Add Publication&quot; to start.</p>
              ) : (
                <div className="space-y-2">
                  {publications.map((pub, idx) => (
                    <div key={pub.id} className={`rounded-lg p-3 space-y-2 ${pub.is_visible !== false ? 'bg-white/[0.03]' : 'bg-white/[0.01] opacity-50'}`}>
                      {/* Row 1: Publication name (full width) */}
                      <input
                        value={pub.name}
                        onChange={e => updatePublication(pub.id, 'name', e.target.value)}
                        placeholder="Publication title..."
                        className="w-full text-sm py-2 px-3 rounded bg-white/5 border border-white/10 text-slate-200 focus:outline-none focus:border-[#c9944a]"
                      />
                      {/* Row 2: Year, DOI, URL */}
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="number"
                          value={pub.year || ''}
                          onChange={e => updatePublication(pub.id, 'year', e.target.value ? parseInt(e.target.value) : null)}
                          placeholder="Year"
                          className="text-xs py-1.5 px-2 rounded bg-white/5 border border-white/10 text-slate-300 focus:outline-none focus:border-[#c9944a]"
                        />
                        <input
                          value={pub.doi}
                          onChange={e => updatePublication(pub.id, 'doi', e.target.value)}
                          placeholder="DOI (10.xxxx/...)"
                          className="text-xs py-1.5 px-2 rounded bg-white/5 border border-white/10 text-slate-300 focus:outline-none focus:border-[#c9944a]"
                        />
                        <input
                          value={pub.url}
                          onChange={e => updatePublication(pub.id, 'url', e.target.value)}
                          placeholder="URL (https://...)"
                          className="text-xs py-1.5 px-2 rounded bg-white/5 border border-white/10 text-slate-300 focus:outline-none focus:border-[#c9944a]"
                        />
                      </div>
                      {/* Row 3: Controls */}
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-1 text-xs text-slate-500 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={pub.is_visible !== false}
                            onChange={e => updatePublication(pub.id, 'is_visible', e.target.checked)}
                          />
                          Visible
                        </label>
                        <div className="flex items-center gap-0.5 ml-auto">
                          <button type="button" onClick={() => movePublication(idx, -1)} disabled={idx === 0}
                            className="text-slate-600 hover:text-white disabled:opacity-20 p-0.5"><ChevronUp size={14} /></button>
                          <button type="button" onClick={() => movePublication(idx, 1)} disabled={idx === publications.length - 1}
                            className="text-slate-600 hover:text-white disabled:opacity-20 p-0.5"><ChevronDown size={14} /></button>
                        </div>
                        <button type="button" onClick={() => removePublication(pub.id)} className="text-slate-600 hover:text-red-400 p-0.5">
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
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
              <button type="button" onClick={() => { setShowForm(false); setEditing(null); setCredentials([]); setPublications([]); setPhotoUrl('') }} className="px-4 py-2 text-slate-400 hover:text-white text-sm">
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
