'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Trash2, Save } from 'lucide-react'
import Link from 'next/link'

interface Contact {
  id: string; name: string; email: string; organization: string | null
  phone: string | null; message: string | null; source: string; status: string
  notes: string | null; utm_source: string | null; utm_medium: string | null
  utm_campaign: string | null; created_at: string; updated_at: string
}

interface Assessment {
  id: string; overall_score: number; dimension_scores: Record<string, { pct: number }>
  industry: string; org_size: string | null; readiness_level: string | null; created_at: string
}

const STATUSES = ['new', 'contacted', 'qualified', 'proposal', 'client', 'archived']

export default function ContactDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [contact, setContact] = useState<Contact | null>(null)
  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/contacts/${params.id}`)
      .then(r => r.json())
      .then(data => {
        setContact(data.contact)
        setAssessment(data.assessment)
        setNotes(data.contact?.notes || '')
        setStatus(data.contact?.status || 'new')
      })
  }, [params.id])

  const handleSave = async () => {
    setSaving(true)
    await fetch(`/api/admin/contacts/${params.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes }),
    })
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!confirm('Delete this contact permanently?')) return
    await fetch(`/api/admin/contacts/${params.id}`, { method: 'DELETE' })
    router.push('/admin/contacts')
  }

  if (!contact) return <div className="text-slate-400 text-center py-20">Loading...</div>

  return (
    <div className="max-w-4xl">
      <Link href="/admin/contacts" className="flex items-center gap-2 text-sm text-slate-500 hover:text-[#0f172a] mb-6">
        <ArrowLeft size={16} /> Back to Contacts
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">{contact.name}</h1>
          <p className="text-slate-500">{contact.email}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-[#06b6d4] text-white rounded-lg text-sm font-semibold hover:bg-[#0891b2] disabled:opacity-50">
            <Save size={16} /> {saving ? 'Saving...' : 'Save'}
          </button>
          <button onClick={handleDelete} className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm hover:bg-red-50">
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Info */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-[#0f172a] mb-4">Contact Information</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-slate-500">Organization</dt><dd className="font-medium">{contact.organization || '—'}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Phone</dt><dd className="font-medium">{contact.phone || '—'}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Source</dt><dd className="font-medium capitalize">{contact.source.replace('_', ' ')}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Created</dt><dd className="font-medium">{new Date(contact.created_at).toLocaleString()}</dd></div>
            {contact.utm_source && <div className="flex justify-between"><dt className="text-slate-500">UTM Source</dt><dd className="font-medium">{contact.utm_source}</dd></div>}
          </dl>
          {contact.message && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-medium text-slate-500 mb-2">Message</h3>
              <p className="text-sm text-[#0f172a] leading-relaxed">{contact.message}</p>
            </div>
          )}
        </div>

        {/* Status & Notes */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-[#0f172a] mb-4">CRM Status</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm capitalize">
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Notes</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={6} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm resize-none" placeholder="Internal notes..." />
            </div>
          </div>
        </div>

        {/* Assessment Results */}
        {assessment && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 lg:col-span-2">
            <h2 className="font-semibold text-[#0f172a] mb-4">Assessment Results</h2>
            <div className="flex items-center gap-6 mb-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-[#06b6d4]">{assessment.overall_score}%</div>
                <div className="text-sm text-slate-500 mt-1">{assessment.readiness_level}</div>
              </div>
              <div className="text-sm text-slate-600">
                <p>Industry: <span className="font-medium capitalize">{assessment.industry?.replace('_', ' ')}</span></p>
                {assessment.org_size && <p>Size: <span className="font-medium">{assessment.org_size}</span></p>}
                <p>Date: <span className="font-medium">{new Date(assessment.created_at).toLocaleDateString()}</span></p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.entries(assessment.dimension_scores).map(([dim, val]) => (
                <div key={dim} className="bg-slate-50 rounded-lg p-3">
                  <div className="text-xs text-slate-500 capitalize mb-1">{dim}</div>
                  <div className="text-lg font-bold text-[#0f172a]">{val.pct}%</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
