import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Metadata } from 'next'
import AssociateProfiles from '@/components/AssociateProfiles'

export const metadata: Metadata = {
  title: 'Our Specialists — The Human Factor',
  description: 'Meet the specialists at The Human Factor — experienced practitioners in human factors engineering, systems design, AI strategy, and emergency services.',
}

export const revalidate = 60

export default async function TeamPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <p className="eyebrow">Our Team</p>
        <h1 className="text-4xl font-bold text-white mb-4">Our Specialists</h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          The Human Factor brings together experienced practitioners from emergency services, healthcare, and technology. Each member of our team is a specialist who has worked in the field — not just studied it.
        </p>
      </div>

      <AssociateProfiles />
    </div>
  )
}
