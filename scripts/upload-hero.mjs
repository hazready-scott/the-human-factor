#!/usr/bin/env node
/**
 * Upload a hero image to Supabase storage.
 * Usage: node scripts/upload-hero.mjs /path/to/image.jpg
 */
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const filePath = process.argv[2]
if (!filePath) {
  console.error('Usage: node scripts/upload-hero.mjs /path/to/image.jpg')
  process.exit(1)
}

const supabase = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const buffer = fs.readFileSync(filePath)
const ext = path.extname(filePath).slice(1)
const contentType = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' }[ext] || 'image/jpeg'

const { error } = await supabase.storage
  .from('article-images')
  .upload('hero-systems.' + ext, buffer, { contentType, upsert: true })

if (error) {
  console.error('Upload failed:', error.message)
  process.exit(1)
}

const { data: { publicUrl } } = supabase.storage
  .from('article-images')
  .getPublicUrl('hero-systems.' + ext)

console.log('Uploaded successfully!')
console.log('Public URL:', publicUrl)
console.log('\nUpdate NEXT_PUBLIC_HERO_IMAGE_URL in .env.local to this URL if desired.')
