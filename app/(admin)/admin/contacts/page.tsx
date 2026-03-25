'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
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
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  qualified: 'bg-purple-100 text-purple-700',
  proposal: 'bg-cyan-100 text-cyan-700',
  client: 'bg-green-100 text-green-700',
  archived: 'bg-slate-100 text-slate-500',
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
        <h1 className="text-2xl font-bold text-[#0f172a]">Contacts</h1>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 bg-[#06b6d4] text-white rounded-lg text-sm font-semibold hover:bg-[#0891b2] transition-colors">
          <Plus size={16} /> Add Contact
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search contacts..." className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-cyan-500 w-64" />
          </div>
          <button type="submit" className="px-3 py-2 bg-slate-100 rounded-lg text-sm hover:bg-slate-200">Search</button>
        </form>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm">
          <option value="">All Statuses</option>
          {Object.keys(STATUS_COLORS).map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
        <select value={sourceFilter} onChange={e => setSourceFilter(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm">
          <option value="">All Sources</option>
          {Object.entries(SOURCE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {/* Add Contact Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setShowAdd(false)}>
          <form onClick={e => e.stopPropagation()} onSubmit={handleAddContact} className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
            <h2 className="text-lg font-bold text-[#0f172a]">Add Contact</h2>
            <input required placeholder="Name *" value={newContact.name} onChange={e => setNewContact({ ...newContact, name: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
            <input required type="email" placeholder="Email *" value={newContact.email} onChange={e => setNewContact({ ...newContact, email: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
            <input placeholder="Organization" value={newContact.organization} onChange={e => setNewContact({ ...newContact, organization: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
            <input placeholder="Phone" value={newContact.phone} onChange={e => setNewContact({ ...newContact, phone: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
            <textarea placeholder="Notes" value={newContact.notes} onChange={e => setNewContact({ ...newContact, notes: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" rows={3} />
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-2 border border-slate-200 rounded-lg text-sm">Cancel</button>
              <button type="submit" className="flex-1 py-2 bg-[#06b6d4] text-white rounded-lg text-sm font-semibold">Save</button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Name</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Email</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Organization</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Source</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Status</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400">Loading...</td></tr>
            ) : contacts.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400">No contacts found</td></tr>
            ) : contacts.map(c => (
              <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer" onClick={() => window.location.href = `/admin/contacts/${c.id}`}>
                <td className="px-4 py-3 font-medium text-[#0f172a]">{c.name}</td>
                <td className="px-4 py-3 text-slate-600">{c.email}</td>
                <td className="px-4 py-3 text-slate-600">{c.organization || '—'}</td>
                <td className="px-4 py-3"><span className="text-xs px-2 py-1 bg-slate-100 rounded-full">{SOURCE_LABELS[c.source] || c.source}</span></td>
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
