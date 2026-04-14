import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

const images = [
  // Hero
  { filename: 'Carousel1.jpg', category: 'hero' },
  { filename: 'Carousel2.jpg', category: 'hero' },
  { filename: 'Carousel4.jpg', category: 'hero' },
  { filename: 'Carousell3.jpeg', category: 'hero' },
  
  // Foundation
  { filename: 'churchcorevalues.jpeg', category: 'foundation' },
  { filename: 'mission and vission.jpeg', category: 'foundation' },
  { filename: 'biblestudysundaymorning.jpeg', category: 'foundation' },
  
  // Reach
  { filename: 'latestoutreach.jpeg', category: 'reach' },
  { filename: 'latestoutrach.jpeg', category: 'reach' },
  { filename: 'WhatsApp Image 2026-04-08 at 13.57.53.jpeg', category: 'reach' },
  
  // Prayer
  { filename: 'churchpraying.jpg', category: 'prayer' },
  { filename: 'manpraying.jpg', category: 'prayer' },
  { filename: 'Morningprayers.jpg', category: 'prayer' },
  { filename: 'fromheartprayesr.jpg', category: 'prayer' },
  
  // Giving
  { filename: 'handstogether unity.jpg', category: 'giving' },
  { filename: 'womanpraying.jpg', category: 'giving' },
  { filename: 'WhatsApp Image 2026-04-08 at 13.57.55 (1).jpeg', category: 'giving' },
  
  // General/Gallery
  { filename: 'WhatsApp Image 2026-04-08 at 13.57.45.jpeg', category: 'general' },
  { filename: 'WhatsApp Image 2026-04-08 at 13.57.46.jpeg', category: 'general' },
  { filename: 'WhatsApp Image 2026-04-08 at 13.57.54 (1).jpeg', category: 'general' },
  { filename: 'WhatsApp Image 2026-04-08 at 13.57.54.jpeg', category: 'general' },
  { filename: 'WhatsApp Image 2026-04-08 at 13.57.55 (2).jpeg', category: 'general' },
  { filename: 'WhatsApp Image 2026-04-08 at 13.57.55.jpeg', category: 'general' },
  { filename: 'WhatsApp Image 2026-04-08 at 13.57.56 (2).jpeg', category: 'general' },
  { filename: 'WhatsApp Image 2026-04-08 at 13.57.56.jpeg', category: 'general' },
  { filename: 'WhatsApp Image 2026-04-08 at 13.57.57 (1).jpeg', category: 'general' },
  { filename: 'WhatsApp Image 2026-04-08 at 13.57.57 (2).jpeg', category: 'general' },
  { filename: 'WhatsApp Image 2026-04-08 at 13.57.57.jpeg', category: 'general' },
  { filename: 'WhatsApp Image 2026-04-08 at 13.57.58 (1).jpeg', category: 'general' },
  { filename: 'WhatsApp Image 2026-04-08 at 13.57.58 (2).jpeg', category: 'general' },
  { filename: 'WhatsApp Image 2026-04-08 at 13.57.58.jpeg', category: 'general' },
  { filename: 'WhatsApp Image 2026-04-08 at 13.57.59 (2).jpeg', category: 'general' },
  { filename: 'WhatsApp Image 2026-04-08 at 13.57.59.jpeg', category: 'general' },
  { filename: 'WhatsApp Image 2026-04-08 at 13.58.00.jpeg', category: 'general' },
  { filename: 'sermontimenoteteking.jpg', category: 'general' },
  { filename: 'sundayservices.jpeg', category: 'general' },
  { filename: 'preachinghour.jpg', category: 'general' },
  { filename: 'midweekservicefriday.jpeg', category: 'general' },
  { filename: 'midweekwednesday.jpeg', category: 'general' },
  { filename: 'onlineconnectthurday.jpeg', category: 'general' },
  { filename: 'Past.Nancy.Sai.jpeg', category: 'general' },
  { filename: 'PastorNancySai.jpeg', category: 'general' },
  { filename: 'Rev.Evans1.jpeg', category: 'general' },
  { filename: 'Rev.Evans2.jpeg', category: 'general' },
  { filename: 'Rev.Evans3.jpeg', category: 'general' },
  { filename: 'praiseandworshipdancing.jpg', category: 'general' }
]

async function seed() {
  console.log('Seeding existing images...')
  
  for (const img of images) {
    const photoData = {
      id: img.filename,
      filename: img.filename,
      original_name: img.filename,
      url: `/${img.filename}`, // Historical images are in /public root
      size: 0,
      category: img.category,
      upload_date: new Date().toISOString()
    }
    
    // UPSERT to avoid duplicates
    const { error } = await supabase
      .from('photos')
      .upsert(photoData, { onConflict: 'id' })
      
    if (error) {
      console.error(`Error seeding ${img.filename}:`, error.message)
    } else {
      console.log(`Successfully seeded ${img.filename}`)
    }
  }
}

seed()
