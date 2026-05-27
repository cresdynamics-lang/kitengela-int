import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '.env') })

const prisma = new PrismaClient()

async function createAdmin() {
  const username = 'admin'
  const email = 'admin@kitengela.org'
  const password = 'admin123' // Change this to a secure password
  const fullName = 'Super Admin'

  try {
    const passwordHash = await bcrypt.hash(password, 12)

    const admin = await prisma.admin.upsert({
      where: { username },
      update: {},
      create: {
        username,
        email,
        passwordHash,
        fullName,
        role: 'admin',
        isSuperAdmin: true,
      },
    })

    console.log('Admin created successfully:')
    console.log(`Username: ${admin.username}`)
    console.log(`Email: ${admin.email}`)
    console.log(`Password: ${password}`)
    console.log('Please change the password after first login.')
  } catch (error) {
    console.error('Error creating admin:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()