// Reserved top-level paths that must never become event slugs.
// Update this list when you add new top-level routes under app/(public)/.
export const RESERVED_SLUGS = new Set<string>([
  // existing public routes
  'about', 'assessment', 'book', 'contact', 'p', 'resources', 'team',
  // reserved for system / future use
  'admin', 'api', 'login', 'events', 'auth',
  '_next', 'favicon.ico', 'robots.txt', 'sitemap.xml',
])

const SLUG_PATTERN = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/

export type SlugValidation = { ok: true } | { ok: false; reason: string }

export function validateSlug(raw: string): SlugValidation {
  const slug = raw.trim().toLowerCase()
  if (!slug) return { ok: false, reason: 'Slug is required' }
  if (slug.length < 2) return { ok: false, reason: 'Slug must be at least 2 characters' }
  if (slug.length > 60) return { ok: false, reason: 'Slug must be 60 characters or fewer' }
  if (!SLUG_PATTERN.test(slug)) {
    return { ok: false, reason: 'Use lowercase letters, numbers, and hyphens only (no leading/trailing hyphen).' }
  }
  if (RESERVED_SLUGS.has(slug)) {
    return { ok: false, reason: `"${slug}" is a reserved path. Pick another.` }
  }
  return { ok: true }
}

export function suggestSlug(eventName: string): string {
  return eventName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}
