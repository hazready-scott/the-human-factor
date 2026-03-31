import { createClient } from '@/lib/supabase/server'
import { AssociateCardClient } from './AssociateCardClient'

export interface Credential {
  id: string
  label: string
  category: 'academic' | 'professional' | 'award' | 'certification'
  year: number | null
  is_visible?: boolean
}

export interface Publication {
  id: string
  year: number | null
  name: string
  doi: string
  url: string
  is_visible?: boolean
}

export interface Associate {
  id: string
  slug: string
  name: string
  title: string
  bio: string
  photo_url: string
  email?: string
  phone?: string
  linkedin?: string
  website?: string
  credentials: Credential[]
  publications: Publication[]
  specialties: string[]
  is_active: boolean
  sort_order: number
}

export default async function AssociateProfiles() {
  const supabase = createClient()
  const { data: associates } = await supabase
    .from('associates')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })

  if (!associates || associates.length === 0) {
    return <p className="text-center text-slate-500">Team profiles coming soon.</p>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {associates.map((a) => (
        <AssociateCardClient key={a.id} associate={a as Associate} />
      ))}
    </div>
  )
}
