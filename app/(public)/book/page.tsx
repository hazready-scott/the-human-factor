import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Book a Conversation — The Human Factor',
  description: 'Schedule a free 30-minute conversation to discuss system improvement, AI integration, or human factors engineering for your organization.',
}

export default function BookingPage() {
  // Google Calendar appointment scheduling embed
  // The URL is configured in the admin settings; fallback to a placeholder
  const calendarUrl = process.env.NEXT_PUBLIC_GOOGLE_BOOKING_URL

  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="accent-bar mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-white mb-4">Book a Conversation</h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Schedule a free 30-minute call to discuss your organization&apos;s needs — system improvement, AI integration, quality improvement, or human factors engineering.
          </p>
        </div>

        {calendarUrl ? (
          <div className="rounded-2xl overflow-hidden border border-white/10" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <iframe
              src={calendarUrl}
              style={{ border: 0, width: '100%', height: '680px' }}
              title="Schedule a meeting"
              className="bg-white rounded-2xl"
            />
          </div>
        ) : (
          <div className="card text-center py-16">
            <h2 className="text-xl font-bold text-white mb-4">Coming Soon</h2>
            <p className="text-slate-400 mb-6">Online booking will be available shortly. In the meantime, please reach out directly.</p>
            <a href="mailto:info@thehumanfactor.ca?subject=Meeting%20Request" className="btn-primary">
              Email Us to Schedule
            </a>
          </div>
        )}

        <div className="mt-12 text-center">
          <p className="text-sm text-slate-500">
            Prefer email? Reach us at{' '}
            <a href="mailto:info@thehumanfactor.ca" className="text-cyan-400 hover:text-cyan-300">info@thehumanfactor.ca</a>
          </p>
        </div>
      </div>
    </div>
  )
}
