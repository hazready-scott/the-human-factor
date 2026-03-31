'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Trash2, Save, StickyNote, Phone, Mail, Users, ArrowRight,
  Info, Plus, Pencil, X, Star, UserPlus, UserMinus,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Contact {
  id: string; name: string; email: string; organization: string | null
  title: string | null; phone: string | null; website: string | null
  address: string | null; message: string | null; source: string; status: string
  notes: string | null; utm_source: string | null; utm_medium: string | null
  utm_campaign: string | null; last_contacted: string | null
  next_followup: string | null; created_at: string; updated_at: string
}

interface Assessment {
  id: string; overall_score: number; dimension_scores: Record<string, { pct: number }>
  industry: string; org_size: string | null; readiness_level: string | null; created_at: string
}

interface ContactNote {
  id: string; content: string; note_type: string; created_at: string
}

interface Person {
  id: string; name: string; email: string | null; role: string | null
  phone: string | null; is_primary: boolean
}

interface Associate {
  assignment_id: string; id: string; name: string; title: string | null
  photo_url: string | null
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const STATUSES = ['new', 'contacted', 'qualified', 'proposal', 'client', 'archived'] as const
const NOTE_TYPES = ['note', 'call', 'email', 'meeting', 'status_change', 'system'] as const

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-500/20 text-blue-300',
  contacted: 'bg-yellow-500/20 text-yellow-300',
  qualified: 'bg-purple-500/20 text-purple-300',
  proposal: 'bg-cyan-500/20 text-cyan-300',
  client: 'bg-green-500/20 text-green-300',
  archived: 'bg-slate-500/20 text-slate-400',
}

const NOTE_TYPE_BORDER: Record<string, string> = {
  note: 'border-l-yellow-400',
  call: 'border-l-green-400',
  email: 'border-l-blue-400',
  meeting: 'border-l-purple-400',
  status_change: 'border-l-cyan-400',
  system: 'border-l-slate-500',
}

const NOTE_TYPE_ICON: Record<string, typeof StickyNote> = {
  note: StickyNote,
  call: Phone,
  email: Mail,
  meeting: Users,
  status_change: ArrowRight,
  system: Info,
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ContactDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  // Core data
  const [contact, setContact] = useState<Contact | null>(null)
  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [timeline, setTimeline] = useState<ContactNote[]>([])
  const [people, setPeople] = useState<Person[]>([])
  const [associates, setAssociates] = useState<Associate[]>([])
  const [allAssociates, setAllAssociates] = useState<Associate[]>([])

  // Editable contact fields
  const [form, setForm] = useState({
    name: '', email: '', organization: '', title: '', phone: '',
    website: '', address: '', status: 'new', next_followup: '',
  })

  // New-note form
  const [newNote, setNewNote] = useState('')
  const [newNoteType, setNewNoteType] = useState<string>('note')
  const [addingNote, setAddingNote] = useState(false)

  // People inline form
  const [showAddPerson, setShowAddPerson] = useState(false)
  const [editingPersonId, setEditingPersonId] = useState<string | null>(null)
  const [personForm, setPersonForm] = useState({ name: '', email: '', role: '', phone: '' })

  // Assign associate
  const [assignId, setAssignId] = useState('')

  // UI state
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  /* ---------- fetch helpers ---------- */

  const fetchContact = useCallback(async () => {
    const res = await fetch(`/api/admin/contacts/${id}`)
    const data = await res.json()
    setContact(data.contact)
    setAssessment(data.assessment ?? null)
    if (data.contact) {
      const c = data.contact as Contact
      setForm({
        name: c.name || '', email: c.email || '', organization: c.organization || '',
        title: c.title || '', phone: c.phone || '', website: c.website || '',
        address: c.address || '', status: c.status || 'new',
        next_followup: c.next_followup ? c.next_followup.slice(0, 10) : '',
      })
    }
  }, [id])

  const fetchTimeline = useCallback(async () => {
    const res = await fetch(`/api/admin/contacts/${id}/notes`)
    const data = await res.json()
    setTimeline(data.notes || [])
  }, [id])

  const fetchPeople = useCallback(async () => {
    const res = await fetch(`/api/admin/contacts/${id}/people`)
    const data = await res.json()
    setPeople(data.people || [])
  }, [id])

  const fetchAssociates = useCallback(async () => {
    const res = await fetch(`/api/admin/contacts/${id}/associates`)
    const data = await res.json()
    setAssociates(data.associates || [])
  }, [id])

  const fetchAllAssociates = useCallback(async () => {
    const res = await fetch('/api/admin/associates')
    const data = await res.json()
    setAllAssociates(data.associates || [])
  }, [])

  useEffect(() => {
    setLoading(true)
    Promise.all([fetchContact(), fetchTimeline(), fetchPeople(), fetchAssociates(), fetchAllAssociates()])
      .finally(() => setLoading(false))
  }, [fetchContact, fetchTimeline, fetchPeople, fetchAssociates, fetchAllAssociates])

  /* ---------- handlers ---------- */

  const handleSave = async () => {
    if (!contact) return
    setSaving(true)

    // If status changed, auto-create a status_change note
    if (form.status !== contact.status) {
      await fetch(`/api/admin/contacts/${id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `Status changed from "${contact.status}" to "${form.status}"`,
          note_type: 'status_change',
        }),
      })
    }

    await fetch(`/api/admin/contacts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    await Promise.all([fetchContact(), fetchTimeline()])
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!confirm('Delete this contact permanently?')) return
    await fetch(`/api/admin/contacts/${id}`, { method: 'DELETE' })
    router.push('/admin/contacts')
  }

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNote.trim()) return
    setAddingNote(true)
    await fetch(`/api/admin/contacts/${id}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: newNote, note_type: newNoteType }),
    })
    setNewNote('')
    setNewNoteType('note')
    await fetchTimeline()
    setAddingNote(false)
  }

  const handleAddPerson = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch(`/api/admin/contacts/${id}/people`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(personForm),
    })
    setPersonForm({ name: '', email: '', role: '', phone: '' })
    setShowAddPerson(false)
    await fetchPeople()
  }

  const handleEditPerson = async (personId: string) => {
    await fetch(`/api/admin/contacts/${id}/people/${personId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(personForm),
    })
    setEditingPersonId(null)
    setPersonForm({ name: '', email: '', role: '', phone: '' })
    await fetchPeople()
  }

  const handleDeletePerson = async (personId: string) => {
    if (!confirm('Remove this person?')) return
    await fetch(`/api/admin/contacts/${id}/people/${personId}`, { method: 'DELETE' })
    await fetchPeople()
  }

  const handleAssignAssociate = async () => {
    if (!assignId) return
    await fetch(`/api/admin/contacts/${id}/associates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ associate_id: assignId }),
    })
    setAssignId('')
    await fetchAssociates()
  }

  const handleUnassignAssociate = async (assignmentId: string) => {
    await fetch(`/api/admin/contacts/${id}/associates/${assignmentId}`, { method: 'DELETE' })
    await fetchAssociates()
  }

  /* ---------- render helpers ---------- */

  const updateForm = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }))
  const updatePersonForm = (key: string, value: string) => setPersonForm(prev => ({ ...prev, [key]: value }))

  if (loading || !contact) {
    return <div className="text-slate-500 text-center py-20">Loading...</div>
  }

  const unassignedAssociates = allAssociates.filter(
    a => !associates.some(assigned => assigned.id === a.id)
  )

  return (
    <div className="max-w-7xl">
      {/* Back link */}
      <Link
        href="/admin/contacts"
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Contacts
      </Link>

      {/* ============================================================ */}
      {/*  HEADER                                                       */}
      {/* ============================================================ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4 min-w-0">
          <div className="min-w-0">
            <input
              value={form.name}
              onChange={e => updateForm('name', e.target.value)}
              className="text-2xl font-bold text-white bg-transparent border-b border-transparent hover:border-white/20 focus:border-[#c9944a] focus:outline-none w-full transition-colors"
            />
            <div className="flex items-center gap-3 mt-1 text-sm text-slate-400">
              <span>{form.email}</span>
              {form.organization && (
                <>
                  <span className="text-slate-600">|</span>
                  <span>{form.organization}</span>
                </>
              )}
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_COLORS[form.status] || ''}`}>
                {form.status}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-[#c9944a] text-white rounded-lg text-sm font-semibold hover:bg-[#b07d3a] disabled:opacity-50 transition-colors"
          >
            <Save size={16} /> {saving ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
            style={{ border: '1px solid rgba(239,68,68,0.2)' }}
          >
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/*  3-COLUMN LAYOUT  (2/3 + 1/3)                                 */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ========== LEFT COLUMN (2/3) ========== */}
        <div className="lg:col-span-2 space-y-6">

          {/* ---- Activity Timeline ---- */}
          <div className="admin-card">
            <h2 className="font-semibold text-white mb-4">Activity Timeline</h2>

            {/* Add Note form */}
            <form onSubmit={handleAddNote} className="mb-6 space-y-3">
              <textarea
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                placeholder="Add a note, log a call, record an email..."
                rows={3}
                className="admin-input resize-none"
              />
              <div className="flex items-center gap-3">
                <select
                  value={newNoteType}
                  onChange={e => setNewNoteType(e.target.value)}
                  className="admin-input w-auto"
                >
                  {NOTE_TYPES.filter(t => t !== 'status_change' && t !== 'system').map(t => (
                    <option key={t} value={t} className="bg-[#111827] capitalize">{t}</option>
                  ))}
                </select>
                <button
                  type="submit"
                  disabled={addingNote || !newNote.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-[#c9944a] text-white rounded-lg text-sm font-semibold hover:bg-[#b07d3a] disabled:opacity-50 transition-colors"
                >
                  <Plus size={14} /> {addingNote ? 'Adding...' : 'Add Note'}
                </button>
              </div>
            </form>

            {/* Timeline entries */}
            {timeline.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-6">No activity yet.</p>
            ) : (
              <div className="space-y-3">
                {timeline.map(note => {
                  const Icon = NOTE_TYPE_ICON[note.note_type] || Info
                  const borderClass = NOTE_TYPE_BORDER[note.note_type] || 'border-l-slate-600'
                  return (
                    <div
                      key={note.id}
                      className={`rounded-lg p-3 border-l-4 ${borderClass}`}
                      style={{ background: 'rgba(255,255,255,0.03)' }}
                    >
                      <div className="flex items-start gap-3">
                        <Icon size={16} className="text-slate-400 mt-0.5 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-slate-200 whitespace-pre-wrap">{note.content}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-slate-500 capitalize">{note.note_type.replace('_', ' ')}</span>
                            <span className="text-xs text-slate-600">
                              {new Date(note.created_at).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* ---- Assessment Results ---- */}
          {assessment && (
            <div className="admin-card">
              <h2 className="font-semibold text-white mb-4">Assessment Results</h2>
              <div className="flex items-center gap-6 mb-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#c9944a]">{assessment.overall_score}%</div>
                  <div className="text-sm text-slate-500 mt-1">{assessment.readiness_level}</div>
                </div>
                <div className="text-sm text-slate-400">
                  <p>Industry: <span className="font-medium text-slate-300 capitalize">{assessment.industry?.replace('_', ' ')}</span></p>
                  {assessment.org_size && <p>Size: <span className="font-medium text-slate-300">{assessment.org_size}</span></p>}
                  <p>Date: <span className="font-medium text-slate-300">{new Date(assessment.created_at).toLocaleDateString()}</span></p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.entries(assessment.dimension_scores).map(([dim, val]) => (
                  <div key={dim} className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <div className="text-xs text-slate-500 capitalize mb-1">{dim}</div>
                    <div className="text-lg font-bold text-white">{val.pct}%</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ========== RIGHT COLUMN (1/3) ========== */}
        <div className="space-y-6">

          {/* ---- Contact Details Card ---- */}
          <div className="admin-card">
            <h2 className="font-semibold text-white mb-4">Contact Details</h2>
            <div className="space-y-3">
              <Field label="Name" value={form.name} onChange={v => updateForm('name', v)} />
              <Field label="Email" value={form.email} onChange={v => updateForm('email', v)} type="email" />
              <Field label="Organization" value={form.organization} onChange={v => updateForm('organization', v)} />
              <Field label="Title" value={form.title} onChange={v => updateForm('title', v)} />
              <Field label="Phone" value={form.phone} onChange={v => updateForm('phone', v)} type="tel" />
              <Field label="Website" value={form.website} onChange={v => updateForm('website', v)} type="url" />
              <Field label="Address" value={form.address} onChange={v => updateForm('address', v)} />

              {/* Source (read-only) */}
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Source</label>
                <div className="text-sm text-slate-300 capitalize">{contact.source.replace('_', ' ')}</div>
              </div>

              {/* Created */}
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Created</label>
                <div className="text-sm text-slate-300">{new Date(contact.created_at).toLocaleString()}</div>
              </div>

              {/* Last contacted */}
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Last Contacted</label>
                <div className="text-sm text-slate-300">
                  {contact.last_contacted ? new Date(contact.last_contacted).toLocaleDateString() : '---'}
                </div>
              </div>

              {/* Next follow-up */}
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Next Follow-up</label>
                <input
                  type="date"
                  value={form.next_followup}
                  onChange={e => updateForm('next_followup', e.target.value)}
                  className="admin-input"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={e => updateForm('status', e.target.value)}
                  className="admin-input capitalize"
                >
                  {STATUSES.map(s => (
                    <option key={s} value={s} className="bg-[#111827] capitalize">{s}</option>
                  ))}
                </select>
              </div>

              {/* Original message */}
              {contact.message && (
                <div className="pt-3 border-t border-white/5">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Original Message</label>
                  <p className="text-sm text-slate-400 leading-relaxed">{contact.message}</p>
                </div>
              )}

              {/* UTM info */}
              {(contact.utm_source || contact.utm_medium || contact.utm_campaign) && (
                <div className="pt-3 border-t border-white/5">
                  <label className="block text-xs font-medium text-slate-500 mb-2">UTM Parameters</label>
                  <dl className="space-y-1 text-xs">
                    {contact.utm_source && (
                      <div className="flex justify-between">
                        <dt className="text-slate-500">Source</dt>
                        <dd className="text-slate-300">{contact.utm_source}</dd>
                      </div>
                    )}
                    {contact.utm_medium && (
                      <div className="flex justify-between">
                        <dt className="text-slate-500">Medium</dt>
                        <dd className="text-slate-300">{contact.utm_medium}</dd>
                      </div>
                    )}
                    {contact.utm_campaign && (
                      <div className="flex justify-between">
                        <dt className="text-slate-500">Campaign</dt>
                        <dd className="text-slate-300">{contact.utm_campaign}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              )}

              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 bg-[#c9944a] text-white rounded-lg text-sm font-semibold hover:bg-[#b07d3a] disabled:opacity-50 transition-colors"
              >
                <Save size={14} /> {saving ? 'Saving...' : 'Save Details'}
              </button>
            </div>
          </div>

          {/* ---- People Card ---- */}
          <div className="admin-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white">People</h2>
              <button
                onClick={() => {
                  setShowAddPerson(true)
                  setEditingPersonId(null)
                  setPersonForm({ name: '', email: '', role: '', phone: '' })
                }}
                className="text-xs flex items-center gap-1 text-[#c9944a] hover:text-[#b07d3a] transition-colors"
              >
                <UserPlus size={14} /> Add Person
              </button>
            </div>

            {/* Add / Edit person inline form */}
            {(showAddPerson || editingPersonId) && (
              <div className="mb-4 p-3 rounded-lg space-y-2" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <input
                  placeholder="Name *"
                  value={personForm.name}
                  onChange={e => updatePersonForm('name', e.target.value)}
                  className="admin-input text-sm"
                  required
                />
                <input
                  placeholder="Email"
                  value={personForm.email}
                  onChange={e => updatePersonForm('email', e.target.value)}
                  className="admin-input text-sm"
                />
                <input
                  placeholder="Role"
                  value={personForm.role}
                  onChange={e => updatePersonForm('role', e.target.value)}
                  className="admin-input text-sm"
                />
                <input
                  placeholder="Phone"
                  value={personForm.phone}
                  onChange={e => updatePersonForm('phone', e.target.value)}
                  className="admin-input text-sm"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => { setShowAddPerson(false); setEditingPersonId(null) }}
                    className="flex-1 py-1.5 rounded-lg text-xs text-slate-400"
                    style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    Cancel
                  </button>
                  {editingPersonId ? (
                    <button
                      onClick={() => handleEditPerson(editingPersonId)}
                      className="flex-1 py-1.5 bg-[#c9944a] text-white rounded-lg text-xs font-semibold hover:bg-[#b07d3a] transition-colors"
                    >
                      Update
                    </button>
                  ) : (
                    <button
                      onClick={handleAddPerson as unknown as () => void}
                      className="flex-1 py-1.5 bg-[#c9944a] text-white rounded-lg text-xs font-semibold hover:bg-[#b07d3a] transition-colors"
                    >
                      Add
                    </button>
                  )}
                </div>
              </div>
            )}

            {people.length === 0 && !showAddPerson ? (
              <p className="text-sm text-slate-500 text-center py-4">No people linked yet.</p>
            ) : (
              <div className="space-y-2">
                {people.map(p => (
                  <div
                    key={p.id}
                    className="flex items-start justify-between p-2 rounded-lg hover:bg-white/[0.03] transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-200">{p.name}</span>
                        {p.is_primary && <Star size={12} className="text-[#c9944a]" />}
                      </div>
                      {p.email && <div className="text-xs text-slate-400">{p.email}</div>}
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        {p.role && <span>{p.role}</span>}
                        {p.phone && <span>{p.phone}</span>}
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => {
                          setEditingPersonId(p.id)
                          setShowAddPerson(false)
                          setPersonForm({
                            name: p.name, email: p.email || '',
                            role: p.role || '', phone: p.phone || '',
                          })
                        }}
                        className="p-1 text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        <Pencil size={12} />
                      </button>
                      <button
                        onClick={() => handleDeletePerson(p.id)}
                        className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ---- Assigned Associates Card ---- */}
          <div className="admin-card">
            <h2 className="font-semibold text-white mb-4">Assigned Associates</h2>

            {associates.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">No associates assigned.</p>
            ) : (
              <div className="space-y-2 mb-4">
                {associates.map(a => (
                  <div
                    key={a.assignment_id}
                    className="flex items-center justify-between p-2 rounded-lg"
                    style={{ background: 'rgba(255,255,255,0.03)' }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {a.photo_url ? (
                        <img
                          src={a.photo_url}
                          alt={a.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#c9944a]/20 flex items-center justify-center text-[#c9944a] text-xs font-bold">
                          {a.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-slate-200 truncate">{a.name}</div>
                        {a.title && <div className="text-xs text-slate-500 truncate">{a.title}</div>}
                      </div>
                    </div>
                    <button
                      onClick={() => handleUnassignAssociate(a.assignment_id)}
                      className="p-1 text-slate-500 hover:text-red-400 transition-colors shrink-0"
                      title="Remove assignment"
                    >
                      <UserMinus size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Assign dropdown */}
            {unassignedAssociates.length > 0 && (
              <div className="flex gap-2">
                <select
                  value={assignId}
                  onChange={e => setAssignId(e.target.value)}
                  className="admin-input text-sm flex-1"
                >
                  <option value="" className="bg-[#111827]">Select associate...</option>
                  {unassignedAssociates.map(a => (
                    <option key={a.id} value={a.id} className="bg-[#111827]">
                      {a.name}{a.title ? ` - ${a.title}` : ''}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAssignAssociate}
                  disabled={!assignId}
                  className="px-3 py-2 bg-[#c9944a] text-white rounded-lg text-xs font-semibold hover:bg-[#b07d3a] disabled:opacity-50 transition-colors"
                >
                  Assign
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Small helper component for editable fields                         */
/* ------------------------------------------------------------------ */

function Field({
  label, value, onChange, type = 'text',
}: {
  label: string; value: string; onChange: (v: string) => void; type?: string
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="admin-input text-sm"
      />
    </div>
  )
}
