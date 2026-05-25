import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'
import dotenv from 'dotenv'

dotenv.config()

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing Supabase credentials in .env')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})

const defaultPhotos = [
  { url: '/whatsapp-13.jpeg', category: 'hero' },
  { url: '/whatsapp-17.jpeg', category: 'hero' },
  { url: '/whatsapp-18.jpeg', category: 'hero' },
  
  { url: '/whatsapp-14.jpeg', category: 'foundation' },
  { url: '/whatsapp-15.jpeg', category: 'foundation' },
  { url: '/whatsapp-16.jpeg', category: 'foundation' },
  
  { url: '/whatsapp-5.jpeg', category: 'reach' },
  { url: '/whatsapp-10.jpeg', category: 'reach' },
  { url: '/whatsapp-19.jpeg', category: 'reach' },
  
  { url: '/whatsapp-1.jpeg', category: 'prayer' },
  { url: '/whatsapp-2.jpeg', category: 'prayer' },
  { url: '/whatsapp-4.jpeg', category: 'prayer' },
  
  { url: '/whatsapp-7.jpeg', category: 'giving' },
  { url: '/whatsapp-11.jpeg', category: 'giving' },
  { url: '/whatsapp-12.jpeg', category: 'giving' },
  
  { url: '/bible-study.jpeg', category: 'about' },
  { url: '/mission-vision.jpeg', category: 'about' },
  { url: '/core-values.jpeg', category: 'about' },
  
  { url: '/Rev.Evans1.jpeg', category: 'leadership' },
  { url: '/Rev.Evans2.jpeg', category: 'leadership' },
  { url: '/Rev.Evans3.jpeg', category: 'leadership' },

  { url: '/bible-study.jpeg', category: 'discipleship' },
]

async function seedPhotos() {
  console.log('Seeding photos...')
  
  // Clear existing static seeds if needed (optional)
  // For now, we'll just insert if they don't already exist.
  const { data: existingPhotos } = await supabase.from('photos').select('url')
  const existingUrls = new Set(existingPhotos?.map(p => p.url) || [])

  let insertedCount = 0

  for (const photo of defaultPhotos) {
    if (existingUrls.has(photo.url)) {
      console.log(`Skipping ${photo.url}, already exists.`)
      continue
    }

    const filename = photo.url.replace('/', '')
    
    const { error } = await supabase.from('photos').insert({
      id: crypto.randomUUID(),
      filename: filename,
      original_name: filename,
      url: photo.url,
      size: 0,
      category: photo.category,
      upload_date: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      updated_by: 'system',
    })

    if (error) {
      console.error(`Error inserting ${photo.url}:`, error.message)
    } else {
      console.log(`Inserted ${photo.url} as ${photo.category}`)
      insertedCount++
    }
  }

  console.log(`Finished seeding! Inserted ${insertedCount} photos.`)
}

seedPhotos().catch(console.error)
