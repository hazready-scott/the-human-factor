'use client'

import { useState } from 'react'

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', organization: '', message: '' })
  const [state, setState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setState('submitting')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setState(res.ok ? 'success' : 'error')
    } catch {
      setState('error')
    }
  }

  if (state === 'success') {
    return (
      <div className="card text-center py-12">
        <div className="text-4xl mb-4">&#10003;</div>
        <h3 className="text-xl font-bold text-[#0f172a] mb-2">Message Sent</h3>
        <p className="text-slate-500">
          Thank you! We&apos;ve sent a confirmation to your email and will get back
          to you within 24 hours.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-5">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1" style={{ color: 'var(--color-primary)' }}>Name</label>
        <input type="text" id="name" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-brand-light-gray focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-colors" placeholder="Your name" />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1" style={{ color: 'var(--color-primary)' }}>Email</label>
        <input type="email" id="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-brand-light-gray focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-colors" placeholder="you@organization.com" />
      </div>
      <div>
        <label htmlFor="organization" className="block text-sm font-medium mb-1" style={{ color: 'var(--color-primary)' }}>Organization</label>
        <input type="text" id="organization" value={form.organization} onChange={e => setForm({ ...form, organization: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-brand-light-gray focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-colors" placeholder="Your organization (optional)" />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-1" style={{ color: 'var(--color-primary)' }}>Message</label>
        <textarea id="message" required rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-brand-light-gray focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-colors resize-none" placeholder="How can we help?" />
      </div>
      {state === 'error' && <p className="text-sm text-red-600">Something went wrong. Please try again.</p>}
      <button type="submit" disabled={state === 'submitting'} className="btn-primary w-full disabled:opacity-50">
        {state === 'submitting' ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  )
}
