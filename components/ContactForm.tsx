'use client'

import { useState } from 'react'

const inputClass = "w-full px-4 py-3 rounded-lg text-sm text-slate-200 transition-colors placeholder:text-slate-600 focus:outline-none focus:border-[#06b6d4]"
const inputStyle = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', organization: '', message: '' })
  const [state, setState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setState('submitting')
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      setState(res.ok ? 'success' : 'error')
    } catch { setState('error') }
  }

  if (state === 'success') {
    return (
      <div className="card text-center py-12">
        <div className="text-4xl mb-4 text-brand-teal">&#10003;</div>
        <h3 className="text-xl font-bold text-white mb-2">Message Sent</h3>
        <p className="text-slate-400">Thank you! We&apos;ve sent a confirmation to your email and will get back to you within 24 hours.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-5">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1 text-slate-300">Name</label>
        <input type="text" id="name" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inputClass} style={inputStyle} placeholder="Your name" />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1 text-slate-300">Email</label>
        <input type="email" id="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className={inputClass} style={inputStyle} placeholder="you@organization.com" />
      </div>
      <div>
        <label htmlFor="organization" className="block text-sm font-medium mb-1 text-slate-300">Organization</label>
        <input type="text" id="organization" value={form.organization} onChange={e => setForm({ ...form, organization: e.target.value })} className={inputClass} style={inputStyle} placeholder="Your organization (optional)" />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-1 text-slate-300">Message</label>
        <textarea id="message" required rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className={`${inputClass} resize-none`} style={inputStyle} placeholder="How can we help?" />
      </div>
      {state === 'error' && <p className="text-sm text-red-400">Something went wrong. Please try again.</p>}
      <button type="submit" disabled={state === 'submitting'} className="btn-primary w-full disabled:opacity-50">
        {state === 'submitting' ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  )
}
