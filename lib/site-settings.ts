import { createAdminClient } from '@/lib/supabase/admin'

export const SETTING_KEYS = {
  defaultEventHero: 'default_event_hero_url',
} as const

export async function getSetting<T = unknown>(key: string): Promise<T | null> {
  try {
    const admin = createAdminClient()
    const { data, error } = await admin
      .from('site_settings')
      .select('value')
      .eq('key', key)
      .maybeSingle()
    if (error || !data) return null
    return (data.value as T) ?? null
  } catch (err) {
    console.error('[site-settings] getSetting failed:', err)
    return null
  }
}

export async function getDefaultEventHero(): Promise<string | null> {
  const v = await getSetting<{ url?: string } | string>(SETTING_KEYS.defaultEventHero)
  if (!v) return null
  if (typeof v === 'string') return v
  return v.url ?? null
}
