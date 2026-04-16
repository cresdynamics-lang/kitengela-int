import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { getSupabaseAdmin, isSupabaseConfigured } from '../server/supabase'

// Log environment on startup
console.log('API Server Starting...')
console.log('NODE_ENV:', process.env.NODE_ENV)
console.log('VERCEL:', process.env.VERCEL)
console.log('SUPABASE_URL configured:', !!process.env.SUPABASE_URL)
console.log('SUPABASE_SERVICE_ROLE_KEY configured:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)
console.log('isSupabaseConfigured:', isSupabaseConfigured)

// Define login schema inline to avoid import issues
const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(6),
})

const app = express()
app.set('trust proxy', true)
app.use(cors({ origin: true, credentials: true }))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

// Request logging and path normalization
app.use((_req, _res, next) => {
  const originalUrl = _req.url
  
  // Normalization: Ensure req.url starts with /api if it's missing (Vercel mapping)
  if (!_req.url.startsWith('/api') && !_req.url.startsWith('/uploads')) {
    _req.url = '/api' + (_req.url.startsWith('/') ? '' : '/') + _req.url
  }

  // Robustness: Handle double /api/api
  if (_req.url.startsWith('/api/api/')) {
    _req.url = _req.url.slice(4)
  }
  
  if (process.env.NODE_ENV !== 'production') {
    console.log(`${_req.method} ${originalUrl} -> ${_req.url}`)
  }
  next()
})

// Explicit OPTIONS handler for CORS preflight
app.options('*', (_req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.sendStatus(200)
})

// Configure multer for file uploads
const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (_req, _file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, _file.fieldname + '-' + uniqueSuffix + path.extname(_file.originalname))
  }
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, _file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/
    const extname = allowedTypes.test(path.extname(_file.originalname).toLowerCase())
    cb(null, extname)
  }
})

const PORT = Number(process.env.PORT) || 3001
const ENV_ADMIN_TOKEN = 'env-admin-token'

const normalizeIdentifier = (value: string | undefined) => (value || '').trim().toLowerCase()

const getEnvAdmin = () => {
  const username = normalizeIdentifier(process.env.ADMIN_USERNAME)
  const email = normalizeIdentifier(process.env.ADMIN_EMAIL)
  const password = process.env.ADMIN_PASSWORD || ''
  if (!username || !password) return null
  return {
    id: ENV_ADMIN_TOKEN,
    username,
    email: email || `${username}@local.admin`,
    role: 'admin',
    isSuperAdmin: true,
    password,
  }
}

// ===================== SUPABASE DB HELPERS =====================

async function dbQuery<T>(table: string, options: {
  select?: string
  match?: Record<string, any>
  order?: { column: string; ascending?: boolean }[]
  limit?: number
  eq?: [string, any][]
  filter?: (q: any) => any
} = {}): Promise<T[]> {
  const sb = getSupabaseAdmin()
  let q = sb.from(table).select(options.select || '*')
  
  if (options.eq) {
    for (const [col, val] of options.eq) {
      q = q.eq(col, val)
    }
  }
  if (options.match) {
    q = q.match(options.match)
  }
  if (options.filter) {
    q = options.filter(q)
  }
  if (options.order) {
    for (const o of options.order) {
      q = q.order(o.column, { ascending: o.ascending ?? true })
    }
  }
  if (options.limit) {
    q = q.limit(options.limit)
  }

  const { data, error } = await q
  if (error) throw new Error(error.message)
  return (data || []) as T[]
}

import crypto from 'crypto'

async function dbInsert<T>(table: string, record: Record<string, any>): Promise<T> {
  // Handle special case for photos table which uses upload_date instead of created_at
  const isPhotosTable = table === 'photos'
  
  const recordWithId = {
    id: record.id || crypto.randomUUID(),
    ...record,
    ...(isPhotosTable 
      ? { upload_date: record.upload_date || new Date().toISOString() }
      : { created_at: record.created_at || new Date().toISOString() }
    ),
    updated_at: record.updated_at || new Date().toISOString()
  }

  const { data, error } = await getSupabaseAdmin()
    .from(table)
    .insert(recordWithId as any)
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data as T
}

async function dbUpdate<T>(table: string, id: string, record: Record<string, any>): Promise<T> {
  const sb = getSupabaseAdmin()
  const { data, error } = await (sb.from(table) as any).update(record).eq('id', id).select().single()
  if (error) throw new Error(error.message)
  return data as T
}

async function dbDelete(table: string, id: string): Promise<void> {
  const { error } = await getSupabaseAdmin()
    .from(table)
    .delete()
    .eq('id', id)
  if (error) throw new Error(error.message)
}

// ===================== AUTH =====================

const getAdminFromToken = async (authHeader: string | undefined) => {
  if (!authHeader?.startsWith('Bearer ')) return null
  const token = authHeader.slice(7)
  const envAdmin = getEnvAdmin()
  if (token === ENV_ADMIN_TOKEN && envAdmin) {
    return { id: envAdmin.id, username: envAdmin.username, email: envAdmin.email, role: envAdmin.role, isSuperAdmin: envAdmin.isSuperAdmin }
  }
  // Try DB lookup for non-env admins
  try {
    const admins = await dbQuery<any>('admins', { eq: [['id', token]], limit: 1 })
    return admins[0] || null
  } catch {
    return null
  }
}

const parseContacts = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean)
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) return []
    try {
      const parsed = JSON.parse(trimmed)
      if (Array.isArray(parsed)) return parsed.map((v) => String(v).trim()).filter(Boolean)
    } catch { /* */ }
    return trimmed.split(',').map((v) => v.trim()).filter(Boolean)
  }
  return []
}

// ===================== PUBLIC API =====================

// Debug endpoint to check environment variables
app.get('/api/debug', async (_req, res) => {
  const envStatus = {
    SUPABASE_URL: !!process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    SUPABASE_ANON_KEY: !!process.env.SUPABASE_ANON_KEY,
    DATABASE_URL: !!process.env.DATABASE_URL,
    isSupabaseConfigured: isSupabaseConfigured,
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  }
  
  console.log('Environment check:', envStatus)
  
  res.json({ 
    success: true, 
    env: envStatus,
    message: 'Check server logs for full environment details'
  })
})

app.get('/api/public/photos', async (_req, res) => {
  try {
    const photos = await dbQuery<any>('photos', { order: [{ column: 'upload_date', ascending: false }] })
    res.json({ success: true, data: photos })
  } catch (e: any) {
    console.error('GET public/photos:', e.message)
    res.status(500).json({ success: false, error: 'Failed to fetch photos' })
  }
})

app.get('/api/public/site', async (_req, res) => {
  try {
    const rows = await dbQuery<any>('site_settings', { order: [{ column: 'updated_at', ascending: false }], limit: 1 })
    res.json({ success: true, data: rows[0] || null })
  } catch (e: any) {
    console.error('GET site_settings:', e.message)
    res.status(500).json({ success: false, error: 'Failed to fetch site settings' })
  }
})

app.get('/api/public/live', async (_req, res) => {
  try {
    console.log('Fetching live streams...')
    const rows = await dbQuery<any>('live_streams', { order: [{ column: 'updated_at', ascending: false }], limit: 1 })
    console.log('Live streams result:', rows)
    res.json({ success: true, data: rows[0] || null })
  } catch (e: any) {
    console.error('GET live_streams error:', e.message)
    console.error('Full error:', e)
    res.status(503).json({ success: false, error: 'Database unavailable. Check Supabase credentials.' })
  }
})

app.get('/api/public/programs/weekly', async (_req, res) => {
  try {
    const rows = await dbQuery<any>('programs', {
      eq: [['is_active', true]],
      order: [{ column: 'day' }, { column: 'order_index' }]
    })
    res.json({ success: true, data: rows })
  } catch (e: any) {
    console.error('GET programs:', e.message)
    res.status(503).json({ success: false, error: 'Database unavailable.' })
  }
})

app.get('/api/public/programs', async (req, res) => {
  try {
    const day = req.query.day as string | undefined
    const rows = await dbQuery<any>('programs', {
      eq: day ? [['day', day], ['is_active', true]] : [['is_active', true]],
      order: [{ column: 'day' }, { column: 'order_index' }]
    })
    res.json({ success: true, data: rows })
  } catch (e: any) {
    console.error('GET programs by day:', e.message)
    res.status(500).json({ success: false, error: 'Failed to fetch programs' })
  }
})

app.get('/api/public/sermons', async (_req, res) => {
  try {
    const rows = await dbQuery<any>('sermons', { order: [{ column: 'date', ascending: false }] })
    res.json({ success: true, data: rows })
  } catch (e: any) {
    console.error('GET sermons:', e.message)
    res.status(503).json({ success: false, error: 'Database unavailable.' })
  }
})

app.get('/api/public/sermons/source', async (_req, res) => {
  try {
    const rows = await dbQuery<any>('sermon_sources', { order: [{ column: 'updated_at', ascending: false }], limit: 1 })
    res.json({ success: true, data: rows[0] || null })
  } catch (e: any) {
    console.error('GET sermon_sources:', e.message)
    res.status(500).json({ success: false, error: 'Failed to fetch sermon source' })
  }
})

app.get('/api/public/leaders', async (_req, res) => {
  try {
    const rows = await dbQuery<any>('leaders', { order: [{ column: 'order_index' }] })
    res.json({ success: true, data: rows })
  } catch (e: any) {
    console.error('GET leaders:', e.message)
    res.status(500).json({ success: false, error: 'Failed to fetch leaders' })
  }
})

app.get('/api/public/links', async (_req, res) => {
  try {
    const rows = await dbQuery<any>('update_links', { eq: [['is_active', true]], order: [{ column: 'order_index' }] })
    res.json({ success: true, data: rows })
  } catch (e: any) {
    console.error('GET update_links:', e.message)
    res.status(500).json({ success: false, error: 'Failed to fetch links' })
  }
})

app.get('/api/public/events', async (_req, res) => {
  try {
    const rows = await dbQuery<any>('events', { order: [{ column: 'date' }] })
    res.json({ success: true, data: rows })
  } catch (e: any) {
    console.error('GET events:', e.message)
    res.status(500).json({ success: false, error: 'Failed to fetch events' })
  }
})

app.get('/api/public/events/upcoming', async (_req, res) => {
  try {
    const rows = await dbQuery<any>('events', { eq: [['is_upcoming', true]], order: [{ column: 'date' }] })
    res.json({ success: true, data: rows })
  } catch (e: any) {
    console.error('GET upcoming events:', e.message)
    res.status(500).json({ success: false, error: 'Failed to fetch upcoming events' })
  }
})

app.post('/api/public/contact', async (_req, res) => {
  res.json({ success: true, data: { message: 'Thank you for your message.' } })
})

// ===================== ADMIN LOGIN =====================

app.post('/api/admin/login', async (req, res) => {
  try {
    console.log('Login attempt received')
    const body = loginSchema.parse(req.body || {})
    const normalizedLogin = normalizeIdentifier(body.username)

    const envAdmin = getEnvAdmin()
    console.log('Env admin configured:', !!envAdmin)
    
    if (
      envAdmin &&
      body.password === envAdmin.password &&
      (normalizedLogin === envAdmin.username || normalizedLogin === envAdmin.email)
    ) {
      console.log('Login successful with env admin')
      return res.json({
        success: true,
        data: {
          token: ENV_ADMIN_TOKEN,
          admin: { id: envAdmin.id, username: envAdmin.username, email: envAdmin.email, role: envAdmin.role, isSuperAdmin: envAdmin.isSuperAdmin },
        },
      })
    }

    // Try DB admin lookup only if Supabase is configured
    if (isSupabaseConfigured) {
      try {
        const admins = await dbQuery<any>('admins', {
          filter: (q: any) => q.or(`username.eq.${body.username},email.eq.${body.username}`),
          limit: 1
        })
        const admin = admins[0]
        if (!admin) return res.status(401).json({ success: false, error: 'Invalid credentials' })
        const isValid = await bcrypt.compare(body.password, admin.password_hash)
        if (!isValid) return res.status(401).json({ success: false, error: 'Invalid credentials' })
        return res.json({
          success: true,
          data: {
            token: admin.id,
            admin: { id: admin.id, username: admin.username, email: admin.email, role: admin.role, isSuperAdmin: admin.is_super_admin },
          },
        })
      } catch (dbErr: any) {
        console.error('DB login lookup failed:', dbErr.message)
      }
    }

    return res.status(401).json({ success: false, error: 'Invalid credentials' })
  } catch (err: any) {
    if (err?.name === 'ZodError') return res.status(400).json({ success: false, error: 'Username and password are required.' })
    console.error('Login error:', err)
    res.status(500).json({ success: false, error: 'Login failed. Please try again.' })
  }
})

// ===================== ADMIN PROGRAMS =====================

app.get('/api/admin/programs', async (req, res) => {
  const admin = await getAdminFromToken(req.headers.authorization)
  if (!admin) return res.status(401).json({ error: 'Unauthorized' })
  try {
    const rows = await dbQuery<any>('programs', { order: [{ column: 'day' }, { column: 'order_index' }] })
    res.json({ success: true, data: rows })
  } catch (e: any) {
    console.error('GET admin/programs:', e.message)
    res.status(500).json({ success: false, error: 'Failed to fetch programs' })
  }
})

app.post('/api/admin/programs', async (req, res) => {
  const admin = await getAdminFromToken(req.headers.authorization)
  if (!admin) return res.status(401).json({ error: 'Unauthorized' })
  try {
    const body = req.body || {}
    const row = await dbInsert<any>('programs', {
      title: body.title, day: body.day, start_time: body.startTime, end_time: body.endTime,
      venue: body.venue, contacts: parseContacts(body.contacts),
      description: body.description ?? null, poster_image_url: body.posterImageUrl ?? null,
      is_active: typeof body.isActive === 'boolean' ? body.isActive : true,
      order_index: typeof body.orderIndex === 'number' ? body.orderIndex : 0,
      updated_by: admin.id,
    })
    res.json({ success: true, data: row })
  } catch (e: any) {
    console.error('POST admin/programs:', e.message)
    res.status(500).json({ success: false, error: 'Failed to create program' })
  }
})

app.put('/api/admin/programs/:id', async (req, res) => {
  const admin = await getAdminFromToken(req.headers.authorization)
  if (!admin) return res.status(401).json({ error: 'Unauthorized' })
  try {
    const body = req.body || {}
    const row = await dbUpdate<any>('programs', req.params.id, {
      title: body.title, day: body.day, start_time: body.startTime, end_time: body.endTime,
      venue: body.venue, contacts: parseContacts(body.contacts),
      description: body.description ?? null, poster_image_url: body.posterImageUrl ?? null,
      is_active: typeof body.isActive === 'boolean' ? body.isActive : undefined,
      order_index: typeof body.orderIndex === 'number' ? body.orderIndex : undefined,
      updated_by: admin.id,
    })
    res.json({ success: true, data: row })
  } catch (e: any) {
    console.error('PUT admin/programs:', e.message)
    res.status(500).json({ success: false, error: 'Failed to update program' })
  }
})

app.delete('/api/admin/programs/:id', async (req, res) => {
  const admin = await getAdminFromToken(req.headers.authorization)
  if (!admin) return res.status(401).json({ error: 'Unauthorized' })
  try {
    await dbDelete('programs', req.params.id)
    res.json({ success: true })
  } catch (e: any) {
    console.error('DELETE admin/programs:', e.message)
    res.status(500).json({ success: false, error: 'Failed to delete program' })
  }
})

// ===================== ADMIN LIVE STREAM =====================

app.get('/api/admin/live', async (req, res) => {
  const admin = await getAdminFromToken(req.headers.authorization)
  if (!admin) return res.status(401).json({ error: 'Unauthorized' })
  try {
    const rows = await dbQuery<any>('live_streams', { order: [{ column: 'updated_at', ascending: false }], limit: 1 })
    res.json({ success: true, data: rows[0] || null })
  } catch (e: any) {
    console.error('GET admin/live:', e.message)
    res.status(500).json({ success: false, error: 'Failed to fetch live' })
  }
})

app.put('/api/admin/live', async (req, res) => {
  const admin = await getAdminFromToken(req.headers.authorization)
  if (!admin) return res.status(401).json({ error: 'Unauthorized' })
  try {
    const body = req.body || {}
    const existingRows = await dbQuery<any>('live_streams', { order: [{ column: 'updated_at', ascending: false }], limit: 1 })
    const existing = existingRows[0]
    const data = {
      is_live: typeof body.isLive === 'boolean' ? body.isLive : false,
      platform: body.platform ?? null,
      youtube_live_url: body.youtubeLiveUrl ?? null,
      facebook_live_url: body.facebookLiveUrl ?? null,
      google_meet_url: body.googleMeetUrl ?? null,
      title: body.title ?? null,
      schedule_time: body.scheduleTime ? new Date(body.scheduleTime).toISOString() : null,
      updated_by: admin.id,
    }
    let row
    if (existing) {
      row = await dbUpdate<any>('live_streams', existing.id, data)
    } else {
      row = await dbInsert<any>('live_streams', data)
    }
    res.json({ success: true, data: row })
  } catch (e: any) {
    console.error('PUT admin/live:', e.message)
    res.status(500).json({ success: false, error: 'Failed to update live stream' })
  }
})

// ===================== ADMIN SERMONS =====================

app.get('/api/admin/sermons', async (req, res) => {
  const admin = await getAdminFromToken(req.headers.authorization)
  if (!admin) return res.status(401).json({ error: 'Unauthorized' })
  try {
    const rows = await dbQuery<any>('sermons', { order: [{ column: 'date', ascending: false }] })
    res.json({ success: true, data: rows })
  } catch (e: any) {
    console.error('GET admin/sermons:', e.message)
    res.status(500).json({ success: false, error: 'Failed to fetch sermons' })
  }
})

app.post('/api/admin/sermons', async (req, res) => {
  const admin = await getAdminFromToken(req.headers.authorization)
  if (!admin) return res.status(401).json({ error: 'Unauthorized' })
  try {
    const body = req.body || {}
    const row = await dbInsert<any>('sermons', {
      title: body.title, description: body.description ?? null,
      speaker: body.speaker ?? null,
      date: body.date ? new Date(body.date).toISOString() : new Date().toISOString(),
      video_url: body.videoUrl ?? body.video_url ?? null,
      audio_url: body.audioUrl ?? body.audio_url ?? null,
      thumbnail_url: body.thumbnailUrl ?? body.thumbnail_url ?? null,
      duration: body.duration ?? null, views: 0, updated_by: admin.id,
    })
    res.json({ success: true, data: row })
  } catch (e: any) {
    console.error('POST admin/sermons:', e.message)
    res.status(500).json({ success: false, error: 'Failed to create sermon' })
  }
})

app.put('/api/admin/sermons/:id', async (req, res) => {
  const admin = await getAdminFromToken(req.headers.authorization)
  if (!admin) return res.status(401).json({ error: 'Unauthorized' })
  try {
    const body = req.body || {}
    const row = await dbUpdate<any>('sermons', req.params.id, {
      title: body.title, description: body.description ?? null,
      speaker: body.speaker ?? null,
      date: body.date ? new Date(body.date).toISOString() : undefined,
      video_url: body.videoUrl ?? body.video_url ?? null,
      audio_url: body.audioUrl ?? body.audio_url ?? null,
      thumbnail_url: body.thumbnailUrl ?? body.thumbnail_url ?? null,
      duration: body.duration ?? null, updated_by: admin.id,
    })
    res.json({ success: true, data: row })
  } catch (e: any) {
    console.error('PUT admin/sermons:', e.message)
    res.status(500).json({ success: false, error: 'Failed to update sermon' })
  }
})

app.delete('/api/admin/sermons/:id', async (req, res) => {
  const admin = await getAdminFromToken(req.headers.authorization)
  if (!admin) return res.status(401).json({ error: 'Unauthorized' })
  try {
    await dbDelete('sermons', req.params.id)
    res.json({ success: true })
  } catch (e: any) {
    console.error('DELETE admin/sermons:', e.message)
    res.status(500).json({ success: false, error: 'Failed to delete sermon' })
  }
})

// ===================== ADMIN UPDATE LINKS =====================

const mapUpdateLinkInput = (body: any) => ({
  title: body?.title, url: body?.url,
  description: body?.description ?? '',
  category: body?.category ?? 'General',
  is_active: typeof body?.is_active === 'boolean' ? body.is_active : body?.isActive ?? true,
  order_index: typeof body?.display_order === 'number' ? body.display_order : typeof body?.orderIndex === 'number' ? body.orderIndex : 0,
})

app.get('/api/admin/update-links', async (req, res) => {
  const admin = await getAdminFromToken(req.headers.authorization)
  if (!admin) return res.status(401).json({ error: 'Unauthorized' })
  try {
    const rows = await dbQuery<any>('update_links', { order: [{ column: 'order_index' }] })
    res.json({ success: true, data: rows })
  } catch (e: any) {
    console.error('GET admin/update-links:', e.message)
    res.status(500).json({ success: false, error: 'Failed to fetch links' })
  }
})

app.post('/api/admin/update-links', async (req, res) => {
  const admin = await getAdminFromToken(req.headers.authorization)
  if (!admin) return res.status(401).json({ error: 'Unauthorized' })
  try {
    const row = await dbInsert<any>('update_links', { ...mapUpdateLinkInput(req.body), updated_by: admin.id })
    res.json({ success: true, data: row })
  } catch (e: any) {
    console.error('POST admin/update-links:', e.message)
    res.status(500).json({ success: false, error: 'Failed to create link' })
  }
})

app.put('/api/admin/update-links/:id', async (req, res) => {
  const admin = await getAdminFromToken(req.headers.authorization)
  if (!admin) return res.status(401).json({ error: 'Unauthorized' })
  try {
    const row = await dbUpdate<any>('update_links', req.params.id, { ...mapUpdateLinkInput(req.body), updated_by: admin.id })
    res.json({ success: true, data: row })
  } catch (e: any) {
    console.error('PUT admin/update-links:', e.message)
    res.status(500).json({ success: false, error: 'Failed to update link' })
  }
})

app.delete('/api/admin/update-links/:id', async (req, res) => {
  const admin = await getAdminFromToken(req.headers.authorization)
  if (!admin) return res.status(401).json({ error: 'Unauthorized' })
  try {
    await dbDelete('update_links', req.params.id)
    res.json({ success: true })
  } catch (e: any) {
    console.error('DELETE admin/update-links:', e.message)
    res.status(500).json({ success: false, error: 'Failed to delete link' })
  }
})

// ===================== ADMIN PHOTOS (local file storage) =====================

app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')))

app.get('/api/admin/photos', async (req, res) => {
  const admin = await getAdminFromToken(req.headers.authorization)
  if (!admin) return res.status(401).json({ error: 'Unauthorized' })
  try {
    const photos = await dbQuery<any>('photos', { order: [{ column: 'upload_date', ascending: false }] })
    res.json({ success: true, data: photos })
  } catch (e: any) {
    console.error('GET admin/photos:', e.message)
    res.status(500).json({ success: false, error: 'Failed to fetch photos' })
  }
})

app.post('/api/admin/photos', upload.single('photo'), async (req, res) => {
  const admin = await getAdminFromToken(req.headers.authorization)
  if (!admin) return res.status(401).json({ error: 'Unauthorized' })
  if (!req.file) return res.status(400).json({ success: false, error: 'No photo file provided' })
  try {
    // Check if Supabase is configured
    if (!isSupabaseConfigured) {
      return res.status(503).json({ success: false, error: 'Database not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env' })
    }
    
    const photoData = {
      id: crypto.randomUUID(),
      filename: req.file.filename,
      original_name: req.file.originalname,
      url: `/uploads/${req.file.filename}`,
      size: req.file.size,
      category: req.body.category || 'general',
      upload_date: new Date().toISOString(),
      updated_by: admin.id
    }
    
    const row = await dbInsert<any>('photos', photoData)
    
    res.json({
      success: true,
      data: row
    })
  } catch (e: any) {
    console.error('POST admin/photos:', e.message)
    res.status(500).json({ success: false, error: e.message || 'Failed to upload photo' })
  }
})

app.patch('/api/admin/photos/:id/category', async (req, res) => {
  const admin = await getAdminFromToken(req.headers.authorization)
  if (!admin) return res.status(401).json({ error: 'Unauthorized' })
  const { category } = req.body
  if (!category) return res.status(400).json({ success: false, error: 'Category is required' })
  
  try {
    const sb = getSupabaseAdmin()
    const { data, error } = await (sb.from('photos') as any).update({ category: category, updated_at: new Date().toISOString() }).eq('id', req.params.id).select().single()
      
    if (error) throw error
    res.json({ success: true, data })
  } catch (e: any) {
    console.error('PATCH admin/photos/category:', e.message)
    res.status(500).json({ success: false, error: 'Failed to update category' })
  }
})

app.delete('/api/admin/photos/:filename', async (req, res) => {
  const admin = await getAdminFromToken(req.headers.authorization)
  if (!admin) return res.status(401).json({ error: 'Unauthorized' })
  try {
    const filename = req.params.filename
    const publicPath = path.join(process.cwd(), 'public', filename)
    const uploadsPath = path.join(process.cwd(), 'public', 'uploads', filename)
    
    // 1. Try to delete from filesystem (check both possible locations)
    if (fs.existsSync(uploadsPath)) {
      fs.unlinkSync(uploadsPath)
    } else if (fs.existsSync(publicPath)) {
      // Be careful: avoid deleting essential system files if they match by some fluke
      if (filename !== 'robots.txt' && !filename.endsWith('.json')) {
        fs.unlinkSync(publicPath)
      }
    }
    
    // 2. Delete from DB (metadata)
    await getSupabaseAdmin()
      .from('photos')
      .delete()
      .eq('filename', filename)
      
    res.json({ success: true, message: 'Photo deleted successfully' })
  } catch (e: any) {
    console.error('DELETE admin/photos:', e.message)
    res.status(500).json({ success: false, error: 'Failed to delete photo' })
  }
})

// ===================== ADMIN ADMINS =====================

app.get('/api/admin/admins', async (req, res) => {
  const admin = await getAdminFromToken(req.headers.authorization)
  if (!admin) return res.status(401).json({ error: 'Unauthorized' })
  if (!admin.isSuperAdmin) return res.status(403).json({ error: 'Forbidden' })
  try {
    const rows = await dbQuery<any>('admins', {})
    res.json({ success: true, data: rows.map(a => ({ id: a.id, username: a.username, email: a.email, role: a.role, isSuperAdmin: a.is_super_admin })) })
  } catch (e: any) {
    console.error('GET admin/admins:', e.message)
    res.status(500).json({ success: false, error: 'Failed to fetch admins' })
  }
})

// ===================== ADMIN SITE SETTINGS =====================

app.get('/api/admin/site', async (req, res) => {
  const admin = await getAdminFromToken(req.headers.authorization)
  if (!admin) return res.status(401).json({ error: 'Unauthorized' })
  try {
    const rows = await dbQuery<any>('site_settings', { order: [{ column: 'updated_at', ascending: false }], limit: 1 })
    res.json({ success: true, data: rows[0] || null })
  } catch (e: any) {
    console.error('GET admin/site:', e.message)
    res.status(500).json({ success: false, error: 'Failed to fetch site' })
  }
})

// ===================== SERVER =====================

const isVercelRuntime = Boolean(process.env.VERCEL) || Boolean(process.env.VERCEL_REGION)

if (!isVercelRuntime) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`API server running at http://localhost:${PORT}`)
    console.log(`Supabase configured: ${isSupabaseConfigured}`)
  })
}

// Global 404 handler for API routes
app.use((req, res) => {
  console.warn(`404 Not Found: ${req.method} ${req.url}`)
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.url}. Ensure you have the correct API prefix.`
  })
})

// Global Error handler
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error('Unhandled Server Error:', err)
  res.status(500).json({
    success: false,
    error: 'Internal server error. Please check server logs.'
  })
})

export default app
