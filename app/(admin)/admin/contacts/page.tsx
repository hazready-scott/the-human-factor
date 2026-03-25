'use client'

import { useEffect, useState } from 'react'
import { Search, Plus } from 'lucide-react'

interface Contact {
  id: string
  name: string
  email: string
  organization: string | null
  source: string
  status: string
  created_at: string
}

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-500/20 text-blue-300',
  contacted: 'bg-yellow-500/20 text-yellow-300',
  qualified: 'bg-purple-500/20 text-purple-300',
  proposal: 'bg-cyan-500/20 text-cyan-300',
  client: 'bg-green-500/20 text-green-300',
  archived: 'bg-slate-500/20 text-slate-400',
}

const SOURCE_LABELS: Record<string, string> = {
  contact_form: 'Contact Form',
  quiz_submission: 'Quiz',
  manual: 'Manual',
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sourceFilter, setSourceFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [newContact, setNewContact] = useState({ name: '', email: '', organization: '', phone: '', notes: '' })

  const fetchContacts = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (statusFilter) params.set('status', statusFilter)
    if (sourceFilter) params.set('source', sourceFilter)
    const res = await fetch(`/api/admin/contacts?${params}`)
    const data = await res.json()
    setContacts(data.contacts || [])
    setLoading(false)
  }

  useEffect(() => { fetchContacts() }, [statusFilter, sourceFilter])

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); fetchContacts() }

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch('/api/admin/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newContact),
    })
    setShowAdd(false)
    setNewContact({ name: '', email: '', organization: '', phone: '', notes: '' })
    fetchContacts()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Contacts</h1>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 bg-[#06b6d4] text-white rounded-lg text-sm font-semibold hover:bg-[#0891b2] transition-colors">
          <Plus size={16} /> Add Contact
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search contacts..." className="admin-input pl-10 w-64" />
          </div>
          <button type="submit" className="px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white transition-colors" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>Search</button>
        </form>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="admin-input w-auto">
          <option value="">All Statuses</option>
          {Object.keys(STATUS_COLORS).map(s => <option key={s} value={s} className="capitalize bg-[#111827]">{s}</option>)}
        </select>
        <select value={sourceFilter} onChange={e => setSourceFilter(e.target.value)} className="admin-input w-auto">
          <option value="">All Sources</option>
          {Object.entries(SOURCE_LABELS).map(([k, v]) => <option key={k} value={k} className="bg-[#111827]">{v}</option>)}
        </select>
      </div>

      {/* Add Contact Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center backdrop-blur-sm" onClick={() => setShowAdd(false)}>
          <form onClick={e => e.stopPropagation()} onSubmit={handleAddContact} className="admin-card p-6 w-full max-w-md space-y-4">
            <h2 className="text-lg font-bold text-white">Add Contact</h2>
            <input required placeholder="Name *" value={newContact.name} onChange={e => setNewContact({ ...newContact, name: e.target.value })} className="admin-input" />
            <input required type="email" placeholder="Email *" value={newContact.email} onChange={e => setNewContact({ ...newContact, email: e.target.value })} className="admin-input" />
            <input placeholder="Organization" value={newContact.organization} onChange={e => setNewContact({ ...newContact, organization: e.target.value })} className="admin-input" />
            <input placeholder="Phone" value={newContact.phone} onChange={e => setNewContact({ ...newContact, phone: e.target.value })} className="admin-input" />
            <textarea placeholder="Notes" value={newContact.notes} onChange={e => setNewContact({ ...newContact, notes: e.target.value })} className="admin-input resize-none" rows={3} />
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-2 rounded-lg text-sm text-slate-400" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>Cancel</button>
              <button type="submit" className="flex-1 py-2 bg-[#06b6d4] text-white rounded-lg text-sm font-semibold">Save</button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="admin-card p-0 overflow-hidden">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Organization</th>
              <th>Source</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">Loading...</td></tr>
            ) : contacts.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">No contacts found</td></tr>
            ) : contacts.map(c => (
              <tr key={c.id} onClick={() => window.location.href = `/admin/contacts/${c.id}`}>
                <td className="px-4 py-3 font-medium text-slate-200">{c.name}</td>
                <td className="px-4 py-3 text-slate-400">{c.email}</td>
                <td className="px-4 py-3 text-slate-400">{c.organization || '—'}</td>
                <td className="px-4 py-3"><span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>{SOURCE_LABELS[c.source] || c.source}</span></td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${STATUS_COLORS[c.status] || ''}`}>{c.status}</span></td>
                <td className="px-4 py-3 text-slate-500">{new Date(c.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
