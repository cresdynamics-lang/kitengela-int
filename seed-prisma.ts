import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

process.env.DATABASE_URL = process.env.DIRECT_URL || process.env.DATABASE_URL
const prisma = new PrismaClient()

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

async function main() {
  console.log('Seeding photos via Prisma...')
  
  const existingPhotos = await prisma.photo.findMany({ select: { url: true } })
  const existingUrls = new Set(existingPhotos.map(p => p.url))

  let insertedCount = 0

  for (const photo of defaultPhotos) {
    if (existingUrls.has(photo.url)) {
      console.log(`Skipping ${photo.url}, already exists.`)
      continue
    }

    const filename = photo.url.replace('/', '')
    
    await prisma.photo.create({
      data: {
        id: crypto.randomUUID(),
        filename: filename,
        originalName: filename,
        url: photo.url,
        size: 0,
        category: photo.category,
        updatedBy: 'system'
      }
    })

    console.log(`Inserted ${photo.url} as ${photo.category}`)
    insertedCount++
  }

  console.log(`Finished seeding! Inserted ${insertedCount} photos.`)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
