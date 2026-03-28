// ── Slide Type Definitions ──

export type SlideType =
  | 'title'
  | 'section'
  | 'content'
  | 'two-column'
  | 'image'
  | 'quote'
  | 'data'
  | 'list'
  | 'comparison'
  | 'interactive'
  | 'closing'

export interface SlideBackground {
  color?: string
  image?: string
  opacity?: number
  gradient?: string
}

export interface BaseSlide {
  id: string
  type: SlideType
  notes?: string
  transition?: 'fade' | 'slide' | 'none'
  background?: SlideBackground
}

export interface TitleSlide extends BaseSlide {
  type: 'title'
  title: string
  subtitle?: string
  author?: string
  date?: string
  logo?: string
}

export interface SectionSlide extends BaseSlide {
  type: 'section'
  heading: string
  subheading?: string
}

export interface ContentSlide extends BaseSlide {
  type: 'content'
  heading: string
  body: string
  image?: {
    url: string
    alt: string
    position: 'right' | 'left' | 'bottom'
    size: 'small' | 'medium' | 'large'
  }
  reveal?: boolean
}

export interface TwoColumnSlide extends BaseSlide {
  type: 'two-column'
  heading?: string
  left: {
    heading?: string
    body: string
    image?: { url: string; alt: string }
  }
  right: {
    heading?: string
    body: string
    image?: { url: string; alt: string }
  }
}

export interface ImageSlide extends BaseSlide {
  type: 'image'
  url: string
  alt: string
  caption?: string
  fit: 'cover' | 'contain' | 'auto'
}

export interface QuoteSlide extends BaseSlide {
  type: 'quote'
  quote: string
  attribution?: string
  role?: string
}

export interface DataSlide extends BaseSlide {
  type: 'data'
  heading: string
  description?: string
  chartType: 'bar' | 'line' | 'pie' | 'radar' | 'stat'
  chartData: Record<string, unknown>
  chartConfig?: Record<string, unknown>
  source?: string
}

export interface ListSlide extends BaseSlide {
  type: 'list'
  heading: string
  items: Array<{
    text: string
    icon?: string
    detail?: string
  }>
  reveal?: boolean
}

export interface ComparisonSlide extends BaseSlide {
  type: 'comparison'
  heading?: string
  before: { label: string; items: string[] }
  after: { label: string; items: string[] }
}

export interface InteractiveSlide extends BaseSlide {
  type: 'interactive'
  heading?: string
  component: string
  props: Record<string, unknown>
}

export interface ClosingSlide extends BaseSlide {
  type: 'closing'
  heading: string
  body?: string
  cta?: { label: string; url: string }
  contact?: {
    email?: string
    website?: string
    linkedin?: string
  }
}

export type Slide =
  | TitleSlide
  | SectionSlide
  | ContentSlide
  | TwoColumnSlide
  | ImageSlide
  | QuoteSlide
  | DataSlide
  | ListSlide
  | ComparisonSlide
  | InteractiveSlide
  | ClosingSlide

// ── Presentation Settings ──

export interface PresentationSettings {
  theme: 'default' | 'dark' | 'light'
  transition: 'fade' | 'slide' | 'none'
  transitionSpeed: number
  aspectRatio: '16:9' | '4:3'
  showSlideNumbers: boolean
  showProgressBar: boolean
  brandColor: string
  estimatedMinutes: number
}

export interface Presentation {
  id: string
  title: string
  slug: string
  subtitle?: string
  description?: string
  slides: Slide[]
  settings: PresentationSettings
  status: 'draft' | 'published' | 'private' | 'shareable'
  share_token?: string | null
  published_at?: string | null
  cover_image_url?: string | null
  author_name: string
  tags: string[]
  seo_title?: string | null
  seo_description?: string | null
  seo_keywords?: string | null
  social_post_text?: string | null
  social_hashtags?: string | null
  created_at: string
  updated_at: string
}

// ── Slide Type Metadata ──

export const SLIDE_TYPE_META: Record<SlideType, { label: string; description: string }> = {
  title: { label: 'Title', description: 'Opening title slide' },
  section: { label: 'Section', description: 'Section divider' },
  content: { label: 'Content', description: 'Text + optional image' },
  'two-column': { label: 'Two Column', description: 'Side-by-side layout' },
  image: { label: 'Image', description: 'Full-bleed image' },
  quote: { label: 'Quote', description: 'Pull quote / callout' },
  data: { label: 'Data', description: 'Chart / visualization' },
  list: { label: 'List', description: 'Bullet points' },
  comparison: { label: 'Comparison', description: 'Before / after' },
  interactive: { label: 'Interactive', description: 'Custom element' },
  closing: { label: 'Closing', description: 'CTA / contact' },
}

// ── Factory for creating new slides ──

export function createSlide(type: SlideType): Slide {
  const base = { id: crypto.randomUUID(), type, notes: '' }

  switch (type) {
    case 'title':
      return { ...base, type: 'title', title: '', subtitle: '', author: 'The Human Factor', date: '' }
    case 'section':
      return { ...base, type: 'section', heading: '', subheading: '' }
    case 'content':
      return { ...base, type: 'content', heading: '', body: '' }
    case 'two-column':
      return { ...base, type: 'two-column', left: { body: '' }, right: { body: '' } }
    case 'image':
      return { ...base, type: 'image', url: '', alt: '', fit: 'cover' }
    case 'quote':
      return { ...base, type: 'quote', quote: '' }
    case 'data':
      return { ...base, type: 'data', heading: '', chartType: 'bar', chartData: { labels: [], values: [] } }
    case 'list':
      return { ...base, type: 'list', heading: '', items: [{ text: '' }] }
    case 'comparison':
      return { ...base, type: 'comparison', before: { label: 'Before', items: [''] }, after: { label: 'After', items: [''] } }
    case 'interactive':
      return { ...base, type: 'interactive', component: '', props: {} }
    case 'closing':
      return { ...base, type: 'closing', heading: '' }
  }
}
