'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Calendar, MapPin } from 'lucide-react'

interface Event {
  id: string
  title: string
  description: string
  event_type: string
  venue: string
  city: string
  province_state: string
  country: string
  start_date: string
  end_date: string
  presentation_id: string | null
  associate_id: string | null
  external_url: string
  is_public: boolean
  status: string
  notes: string
  associate?: { id: string; name: string; slug: string }
  presentation?: { id: string; title: string; slug: string }
}

interface Associate {
  id: string
  name: string
}

interface Presentation {
  id: string
  title: string
}

const EVENT_TYPES = [
  { value: 'presentation', label: 'Presentation' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'keynote', label: 'Keynote' },
  { value: 'webinar', label: 'Webinar' },
  { value: 'conference', label: 'Conference' },
  { value: 'training', label: 'Training' },
  { value: 'other', label: 'Other' },
]

const STATUS_OPTIONS = [
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

const STATUS_COLORS: Record<string, string> = {
  scheduled: 'bg-yellow-500/20 text-yellow-300',
  confirmed: 'bg-green-500/20 text-green-300',
  completed: 'bg-blue-500/20 text-blue-300',
  cancelled: 'bg-red-500/20 text-red-300',
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [associates, setAssociates] = useState<Associate[]>([])
  const [presentations, setPresentations] = useState<Presentation[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Event | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming')

  const fetchAll = async () => {
    const [evRes, assocRes, presRes] = await Promise.all([
      fetch('/api/admin/events'),
      fetch('/api/admin/associates'),
      fetch('/api/admin/presentations'),
    ])
    if (evRes.ok) setEvents(await evRes.json())
    if (assocRes.ok) setAssociates(await assocRes.json())
    if (presRes.ok) {
      const presData = await presRes.json()
      setPresentations(Array.isArray(presData) ? presData : presData.presentations || [])
    }
    setLoading(false)
  }

  useEffect(() => { fetchAll() }, [])

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const body: Record<string, unknown> = {
      title: form.get('title'),
      description: form.get('description'),
      event_type: form.get('event_type'),
      venue: form.get('venue'),
      city: form.get('city'),
      province_state: form.get('province_state'),
      country: form.get('country') || 'Canada',
      start_date: form.get('start_date'),
      end_date: form.get('end_date') || null,
      presentation_id: form.get('presentation_id') || null,
      associate_id: form.get('associate_id') || null,
      external_url: form.get('external_url'),
      is_public: form.get('is_public') === 'on',
      status: form.get('status'),
      notes: form.get('notes'),
    }

    const url = editing ? `/api/admin/events/${editing.id}` : '/api/admin/events'
    const method = editing ? 'PATCH' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    if (res.ok) {
      setShowForm(false)
      setEditing(null)
      fetchAll()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this event?')) return
    await fetch(`/api/admin/events/${id}`, { method: 'DELETE' })
    fetchAll()
  }

  const now = new Date().toISOString()
  const filteredEvents = filter === 'all' ? events
    : filter === 'upcoming' ? events.filter(e => e.start_date >= now && e.status !== 'cancelled')
    : events.filter(e => e.start_date < now || e.status === 'completed')

  if (loading) return <div className="p-8 text-slate-500">Loading...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Events & Speaking</h1>
        <button
          onClick={() => { setEditing(null); setShowForm(true) }}
          className="flex items-center gap-2 px-4 py-2 bg-[#06b6d4] text-white rounded-lg text-sm font-semibold hover:bg-[#0891b2] transition-colors"
        >
          <Plus size={16} /> Add Event
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-6">
        {(['upcoming', 'past', 'all'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === f ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white'}`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {showForm && (
        <div className="admin-card p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">{editing ? 'Edit' : 'Add'} Event</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Title *</label>
                <input name="title" defaultValue={editing?.title || ''} required className="admin-input w-full" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Type</label>
                <select name="event_type" defaultValue={editing?.event_type || 'presentation'} className="admin-input w-full">
                  {EVENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Description</label>
              <textarea name="description" defaultValue={editing?.description || ''} rows={3} className="admin-input w-full resize-y" />
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Venue</label>
                <input name="venue" defaultValue={editing?.venue || ''} className="admin-input w-full" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">City</label>
                <input name="city" defaultValue={editing?.city || ''} className="admin-input w-full" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Province/State</label>
                <input name="province_state" defaultValue={editing?.province_state || ''} className="admin-input w-full" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Country</label>
                <input name="country" defaultValue={editing?.country || 'Canada'} className="admin-input w-full" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Start Date *</label>
                <input name="start_date" type="datetime-local" defaultValue={editing?.start_date?.slice(0, 16) || ''} required className="admin-input w-full" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">End Date</label>
                <input name="end_date" type="datetime-local" defaultValue={editing?.end_date?.slice(0, 16) || ''} className="admin-input w-full" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
                <select name="status" defaultValue={editing?.status || 'scheduled'} className="admin-input w-full">
                  {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Presenter</label>
                <select name="associate_id" defaultValue={editing?.associate_id || ''} className="admin-input w-full">
                  <option value="">— None —</option>
                  {associates.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Linked Presentation</label>
                <select name="presentation_id" defaultValue={editing?.presentation_id || ''} className="admin-input w-full">
                  <option value="">— None —</option>
                  {presentations.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">External URL</label>
              <input name="external_url" defaultValue={editing?.external_url || ''} placeholder="https://..." className="admin-input w-full" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Notes (internal)</label>
              <textarea name="notes" defaultValue={editing?.notes || ''} rows={2} className="admin-input w-full resize-y" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="is_public" id="is_public" defaultChecked={editing?.is_public ?? true} className="rounded" />
              <label htmlFor="is_public" className="text-sm text-slate-400">Visible on public site</label>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="px-4 py-2 bg-[#06b6d4] text-white rounded-lg text-sm font-semibold hover:bg-[#0891b2]">
                {editing ? 'Update' : 'Create'} Event
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditing(null) }} className="px-4 py-2 text-slate-400 hover:text-white text-sm">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Events list */}
      <div className="space-y-3">
        {filteredEvents.length === 0 ? (
          <div className="admin-card p-12 text-center text-slate-600">No {filter} events</div>
        ) : filteredEvents.map(ev => (
          <div key={ev.id} className="admin-card p-4 flex items-start gap-4 group">
            <div className="flex-shrink-0 w-16 text-center">
              <div className="text-2xl font-bold text-white">{new Date(ev.start_date).getDate()}</div>
              <div className="text-xs text-slate-500 uppercase">{new Date(ev.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-semibold text-white truncate">{ev.title}</h3>
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${STATUS_COLORS[ev.status] || 'bg-slate-500/20 text-slate-400'}`}>
                  {ev.status}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-slate-500">{ev.event_type}</span>
              </div>
              {(ev.venue || ev.city) && (
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin size={10} />
                  {[ev.venue, ev.city, ev.province_state].filter(Boolean).join(', ')}
                </p>
              )}
              {ev.associate && <p className="text-xs text-cyan-400/70 mt-0.5">{ev.associate.name}</p>}
              {ev.presentation && <p className="text-xs text-slate-600 mt-0.5">Deck: {ev.presentation.title}</p>}
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => { setEditing(ev); setShowForm(true) }} className="text-slate-500 hover:text-cyan-400 transition-colors">
                <Pencil size={14} />
              </button>
              <button onClick={() => handleDelete(ev.id)} className="text-slate-500 hover:text-red-400 transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
