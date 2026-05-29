/**
 * Create or update a Supabase admin with a bcrypt password hash.
 *
 * Usage (from project root):
 *   node scripts/seed-supabase-admin.mjs
 *
 * Requires in .env or environment:
 *   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 * Optional: ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_EMAIL
 */
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import { createClient } from '@supabase/supabase-js'

dotenv.config()

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
const username = (process.env.ADMIN_USERNAME || 'admin').trim().toLowerCase()
const email = (process.env.ADMIN_EMAIL || 'admin@voshkitengela.org').trim().toLowerCase()
const password = (process.env.ADMIN_PASSWORD || 'admin123').trim()

if (!url || !key) {
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env')
  process.exit(1)
}

if (password.length < 6) {
  console.error('ADMIN_PASSWORD must be at least 6 characters')
  process.exit(1)
}

const sb = createClient(url, key, { auth: { persistSession: false } })
const passwordHash = await bcrypt.hash(password, 12)

const { data: existing } = await sb.from('admins').select('id').ilike('username', username).maybeSingle()

const row = {
  username,
  email,
  password_hash: passwordHash,
  full_name: 'Church Admin',
  role: 'admin',
  is_super_admin: true,
  updated_at: new Date().toISOString(),
}

let error
if (existing?.id) {
  ;({ error } = await sb.from('admins').update(row).eq('id', existing.id))
} else {
  ;({ error } = await sb.from('admins').insert({ ...row, id: crypto.randomUUID() }))
}

if (error) {
  console.error('Failed to seed admin:', error.message)
  process.exit(1)
}

console.log('Admin ready in Supabase:')
console.log(`  Username: ${username}`)
console.log(`  Email:    ${email}`)
console.log(`  Password: (value of ADMIN_PASSWORD)`)
