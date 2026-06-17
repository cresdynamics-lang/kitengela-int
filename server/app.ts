import dotenv from 'dotenv'
dotenv.config()

import crypto from 'crypto'
import express from 'express'
import cors from 'cors'
import multer from 'multer'
import path from 'path'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import sharp from 'sharp'
import { getSupabaseAdmin, hasServiceRoleKey, isSupabaseConfigured } from './supabase.js'

console.log('API Server Starting...')
console.log('NODE_ENV:', process.env.NODE_ENV)
console.log('VERCEL:', process.env.VERCEL)
console.log('SUPABASE_URL configured:', !!process.env.SUPABASE_URL)
console.log('SUPABASE_SERVICE_ROLE_KEY configured:', hasServiceRoleKey)
console.log('ADMIN_USERNAME configured:', !!process.env.ADMIN_USERNAME)
console.log('isSupabaseConfigured:', isSupabaseConfigured)

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(6),
})

const app = express()
app.set('trust proxy', true)
app.use(cors({ origin: true, credentials: true }))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

app.use((_req, _res, next) => {
  const originalUrl = _req.url

  if (!_req.url.startsWith('/api') && !_req.url.startsWith('/uploads')) {
    _req.url = '/api' + (_req.url.startsWith('/') ? '' : '/') + _req.url
  }

  if (_req.url.startsWith('/api/api/')) {
    _req.url = _req.url.slice(4)
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log(`${_req.method} ${originalUrl} -> ${_req.url}`)
  }
  next()
})

app.options('*', (_req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.sendStatus(200)
})

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, _file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/
    const extname = allowedTypes.test(path.extname(_file.originalname).toLowerCase())
    cb(null, extname)
  },
})

const ENV_ADMIN_TOKEN_PREFIX = 'env-admin-token'
const PHOTO_BUCKET = 'church-gallery'

const IMAGE_MAX_DIMENSION = 1920
const IMAGE_QUALITY = 80

async function optimizeUploadImage(file: Express.Multer.File) {
  const isSupportedRaster = /image\/(jpeg|jpg|png|webp)/i.test(file.mimetype)
  if (!isSupportedRaster) return file

  const optimizedBuffer = await sharp(file.buffer)
    .rotate()
    .resize(IMAGE_MAX_DIMENSION, IMAGE_MAX_DIMENSION, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: IMAGE_QUALITY, effort: 4 })
    .toBuffer()

  const parsedName = path.parse(file.originalname)
  return {
    ...file,
    buffer: optimizedBuffer,
    size: optimizedBuffer.length,
    mimetype: 'image/webp',
    originalname: `${parsedName.name}.webp`,
  }
}

async function ensurePhotoBucket(supabase: ReturnType<typeof getSupabaseAdmin>) {
  const { data: bucket, error } = await supabase.storage.getBucket(PHOTO_BUCKET)
  if (!error && bucket) return

  const { error: createError } = await supabase.storage.createBucket(PHOTO_BUCKET, {
    public: true,
    fileSizeLimit: 50 * 1024 * 1024,
  })

  if (createError && !createError.message.toLowerCase().includes('already exists')) {
    throw createError
  }
}

const normalizeIdentifier = (value: string | undefined) => (value || '').trim().toLowerCase()

type EnvAdminAccount = {
  id: string
  token: string
  username: string
  email: string
  role: 'admin'
  isSuperAdmin: boolean
  password: string
}

const splitCsv = (value: string | undefined) =>
  (value || '')
    .split(',')
    .map((item) => normalizeIdentifier(item))
    .filter(Boolean)

const getEnvAdmins = (): EnvAdminAccount[] => {
  const password = (process.env.ADMIN_PASSWORD || '').trim()
  if (!password) return []

  const usernames = splitCsv(process.env.ADMIN_USERNAMES || process.env.ADMIN_USERNAME)
  const emails = splitCsv(process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL)
  const count = Math.max(usernames.length, emails.length)

  if (count === 0) return []

  return Array.from({ length: count }, (_, index) => {
    const username = usernames[index] || emails[index]?.split('@')[0] || `admin${index + 1}`
    const email = emails[index] || `${username}@local.admin`
    const id = `env-admin-${index + 1}`
    return {
      id,
      token: `${ENV_ADMIN_TOKEN_PREFIX}:${id}`,
      username,
      email,
      role: 'admin' as const,
      isSuperAdmin: true,
      password,
    }
  })
}

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

async function dbInsert<T>(table: string, record: Record<string, any>): Promise<T> {
  const isPhotosTable = table === 'photos'
  const recordWithId = {
    id: record.id || crypto.randomUUID(),
    ...record,
    ...(isPhotosTable
      ? { upload_date: record.upload_date || new Date().toISOString() }
      : { created_at: record.created_at || new Date().toISOString() }),
    updated_at: record.updated_at || new Date().toISOString(),
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

const getAdminFromToken = async (authHeader: string | undefined) => {
  if (!authHeader?.startsWith('Bearer ')) return null
  const token = authHeader.slice(7)
  const envAdmin = getEnvAdmins().find((admin) => admin.token === token)
  if (envAdmin) {
    return {
      id: envAdmin.id,
      username: envAdmin.username,
      email: envAdmin.email,
      role: envAdmin.role,
      isSuperAdmin: envAdmin.isSuperAdmin,
    }
  }

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
    } catch {
      // Ignore malformed JSON and fall back to CSV parsing.
    }
    return trimmed.split(',').map((v) => v.trim()).filter(Boolean)
  }
  return []
}

app.get('/api/debug', async (_req, res) => {
  const envStatus = {
    SUPABASE_URL: !!(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL),
    SUPABASE_SERVICE_ROLE_KEY: hasServiceRoleKey,
    SUPABASE_ANON_KEY: !!(process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY),
    ADMIN_USERNAME: !!process.env.ADMIN_USERNAME,
    ADMIN_EMAILS: !!process.env.ADMIN_EMAILS,
    ADMIN_PASSWORD: !!process.env.ADMIN_PASSWORD,
    envAdminConfigured: getEnvAdmins().length > 0,
    envAdminCount: getEnvAdmins().length,
    DATABASE_URL: !!process.env.DATABASE_URL,
    isSupabaseConfigured,
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  }

  console.log('Environment check:', envStatus)

  res.json({
    success: true,
    env: envStatus,
    message: 'Check server logs for full environment details',
  })
})

app.get('/api/public/photos', async (_req, res) => {
  try {
    const photos = await dbQuery<any>('photos', { order: [{ column: 'upload_date', ascending: false }] })
    res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=120')
    res.json({ success: true, data: photos })
  } catch (e: any) {
    console.error('GET public/photos:', e.message)
    res.status(500).json({ success: false, error: 'Failed to fetch photos' })
  }
})

app.get('/api/public/site', async (_req, res) => {
  try {
    const rows = await dbQuery<any>('site_settings', {
      order: [{ column: 'updated_at', ascending: false }],
      limit: 1,
    })
    res.json({ success: true, data: rows[0] || null })
  } catch (e: any) {
    console.error('GET site_settings:', e.message)
    res.json({ success: true, data: null })
  }
})

app.get('/api/public/live', async (_req, res) => {
  try {
    const rows = await dbQuery<any>('live_streams', {
      order: [{ column: 'updated_at', ascending: false }],
      limit: 1,
    })
    res.json({ success: true, data: rows[0] || null })
  } catch (e: any) {
    console.error('GET live_streams error:', e.message)
    res.json({ success: true, data: null })
  }
})

app.get('/api/public/programs/weekly', async (_req, res) => {
  try {
    const rows = await dbQuery<any>('programs', {
      eq: [['is_active', true]],
      order: [{ column: 'day' }, { column: 'order_index' }],
    })
    res.json({ success: true, data: rows })
  } catch (e: any) {
    console.error('GET programs:', e.message)
    res.json({ success: true, data: [] })
  }
})

app.get('/api/public/programs', async (req, res) => {
  try {
    const day = req.query.day as string | undefined
    const rows = await dbQuery<any>('programs', {
      eq: day ? [['day', day], ['is_active', true]] : [['is_active', true]],
      order: [{ column: 'day' }, { column: 'order_index' }],
    })
    res.json({ success: true, data: rows })
  } catch (e: any) {
    console.error('GET programs by day:', e.message)
    res.json({ success: true, data: [] })
  }
})

app.get('/api/public/sermons', async (_req, res) => {
  try {
    const rows = await dbQuery<any>('sermons', { order: [{ column: 'date', ascending: false }] })
    res.json({ success: true, data: rows })
  } catch (e: any) {
    console.error('GET sermons:', e.message)
    res.json({ success: true, data: [] })
  }
})

app.get('/api/public/sermons/source', async (_req, res) => {
  try {
    const rows = await dbQuery<any>('sermon_sources', {
      order: [{ column: 'updated_at', ascending: false }],
      limit: 1,
    })
    res.json({ success: true, data: rows[0] || null })
  } catch (e: any) {
    console.error('GET sermon_sources:', e.message)
    res.json({ success: true, data: null })
  }
})

app.get('/api/public/leaders', async (_req, res) => {
  try {
    const rows = await dbQuery<any>('leaders', { order: [{ column: 'order_index' }] })
    res.setHeader('Cache-Control', 'public, max-age=120, stale-while-revalidate=300')
    res.json({ success: true, data: rows })
  } catch (e: any) {
    console.error('GET leaders:', e.message)
    res.json({ success: true, data: [] })
  }
})

app.get('/api/public/photos/leadership-hero', async (_req, res) => {
  try {
    const rows = await dbQuery<any>('photos', {
      select: 'id,url,category,upload_date',
      eq: [['category', 'leadership']],
      order: [{ column: 'upload_date', ascending: false }],
      limit: 1,
    })
    res.setHeader('Cache-Control', 'public, max-age=120, stale-while-revalidate=300')
    res.json({ success: true, data: rows[0] || null })
  } catch (e: any) {
    console.error('GET public/photos/leadership-hero:', e.message)
    res.json({ success: true, data: null })
  }
})

// ── Admin: Leaders CRUD + photo upload ──────────────────────────────────────

app.get('/api/admin/leaders', async (req, res) => {
  const admin = await getAdminFromToken(req.headers.authorization)
  if (!admin) return res.status(401).json({ error: 'Unauthorized' })
  try {
    const rows = await dbQuery<any>('leaders', { order: [{ column: 'order_index' }] })
    res.json({ success: true, data: rows })
  } catch (e: any) {
    console.error('GET admin/leaders:', e.message)
    const msg = e.message?.includes('leaders')
      ? 'Leaders table missing. Run supabase-leaders.sql in Supabase SQL Editor.'
      : e.message || 'Failed to fetch leaders'
    res.status(500).json({ success: false, error: msg })
  }
})

app.post('/api/admin/leaders', upload.single('photo'), async (req, res) => {
  const admin = await getAdminFromToken(req.headers.authorization)
  if (!admin) return res.status(401).json({ success: false, error: 'Unauthorized' })
  try {
    const body = req.body || {}
    if (!body.name?.trim() || !body.title?.trim()) {
      return res.status(400).json({ success: false, error: 'Name and title are required' })
    }
    let photoUrl: string = body.photoUrl || ''

    // Upload photo to Supabase if a file was attached
    if (req.file && isSupabaseConfigured) {
      const optimizedFile = await optimizeUploadImage(req.file)
      const supabase = getSupabaseAdmin()
      await ensurePhotoBucket(supabase)
      const fileName = `leaders/${Date.now()}-${optimizedFile.originalname}`
      const { error: uploadError } = await supabase.storage
        .from(PHOTO_BUCKET)
        .upload(fileName, optimizedFile.buffer, { contentType: optimizedFile.mimetype, upsert: true })
      if (uploadError) throw uploadError
      const { data: urlData } = supabase.storage.from(PHOTO_BUCKET).getPublicUrl(fileName)
      photoUrl = urlData.publicUrl
    }

    const row = await dbInsert<any>('leaders', {
      name: body.name,
      title: body.title,
      bio: body.bio ?? null,
      photo_url: photoUrl || null,
      facebook_url: body.facebookUrl ?? null,
      instagram_url: body.instagramUrl ?? null,
      twitter_url: body.twitterUrl ?? null,
      order_index: typeof body.orderIndex === 'string' ? parseInt(body.orderIndex) || 0 : (body.orderIndex ?? 0),
      updated_by: admin.id,
    })
    res.json({ success: true, data: row })
  } catch (e: any) {
    console.error('POST admin/leaders:', e.message)
    res.status(500).json({ success: false, error: e.message || 'Failed to create leader' })
  }
})

app.put('/api/admin/leaders/:id', upload.single('photo'), async (req, res) => {
  const admin = await getAdminFromToken(req.headers.authorization)
  if (!admin) return res.status(401).json({ success: false, error: 'Unauthorized' })
  try {
    const body = req.body || {}
    if (!body.name?.trim() || !body.title?.trim()) {
      return res.status(400).json({ success: false, error: 'Name and title are required' })
    }
    let photoUrl: string = body.photoUrl || ''

    if (req.file && isSupabaseConfigured) {
      const optimizedFile = await optimizeUploadImage(req.file)
      const supabase = getSupabaseAdmin()
      await ensurePhotoBucket(supabase)
      const fileName = `leaders/${Date.now()}-${optimizedFile.originalname}`
      const { error: uploadError } = await supabase.storage
        .from(PHOTO_BUCKET)
        .upload(fileName, optimizedFile.buffer, { contentType: optimizedFile.mimetype, upsert: true })
      if (uploadError) throw uploadError
      const { data: urlData } = supabase.storage.from(PHOTO_BUCKET).getPublicUrl(fileName)
      photoUrl = urlData.publicUrl
    }

    const updatePayload: Record<string, any> = {
      name: body.name,
      title: body.title,
      bio: body.bio ?? null,
      facebook_url: body.facebookUrl ?? null,
      instagram_url: body.instagramUrl ?? null,
      twitter_url: body.twitterUrl ?? null,
      order_index: typeof body.orderIndex === 'string' ? parseInt(body.orderIndex) || 0 : (body.orderIndex ?? 0),
      updated_at: new Date().toISOString(),
      updated_by: admin.id,
    }
    if (photoUrl) updatePayload.photo_url = photoUrl

    const row = await dbUpdate<any>('leaders', req.params.id, updatePayload)
    res.json({ success: true, data: row })
  } catch (e: any) {
    console.error('PUT admin/leaders:', e.message)
    res.status(500).json({ success: false, error: e.message || 'Failed to update leader' })
  }
})

app.delete('/api/admin/leaders/:id', async (req, res) => {
  const admin = await getAdminFromToken(req.headers.authorization)
  if (!admin) return res.status(401).json({ success: false, error: 'Unauthorized' })
  try {
    await dbDelete('leaders', req.params.id)
    res.json({ success: true })
  } catch (e: any) {
    console.error('DELETE admin/leaders:', e.message)
    res.status(500).json({ success: false, error: 'Failed to delete leader' })
  }
})

app.get('/api/public/links', async (_req, res) => {
  try {
    const rows = await dbQuery<any>('update_links', {
      eq: [['is_active', true]],
      order: [{ column: 'order_index' }],
    })
    res.json({ success: true, data: rows })
  } catch (e: any) {
    console.error('GET update_links:', e.message)
    res.json({ success: true, data: [] })
  }
})

app.get('/api/public/events', async (_req, res) => {
  try {
    const rows = await dbQuery<any>('events', { order: [{ column: 'date' }] })
    res.json({ success: true, data: rows })
  } catch (e: any) {
    console.error('GET events:', e.message)
    res.json({ success: true, data: [] })
  }
})

app.get('/api/public/events/upcoming', async (_req, res) => {
  try {
    const rows = await dbQuery<any>('events', {
      eq: [['is_upcoming', true]],
      order: [{ column: 'date' }],
    })
    res.json({ success: true, data: rows })
  } catch (e: any) {
    console.error('GET upcoming events:', e.message)
    res.json({ success: true, data: [] })
  }
})

app.post('/api/public/contact', async (req, res) => {
  const contactFormSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
    subject: z.string().min(1),
    message: z.string().min(1),
  })

  try {
    const body = contactFormSchema.parse(req.body || {})

    try {
      const { sendContactEmail } = await import('../src/lib/email')
      await sendContactEmail(body)
    } catch (emailErr: any) {
      console.error('Contact email error:', emailErr?.message || emailErr)
    }

    if (isSupabaseConfigured && hasServiceRoleKey) {
      try {
        await dbInsert('visitor_requests', {
          full_name: body.name,
          phone: body.phone || 'Not provided',
          email: body.email,
          service: body.subject,
          prayer_request: body.message,
        })
      } catch (dbErr: any) {
        console.error('visitor_requests insert (contact):', dbErr?.message || dbErr)
      }
    }

    res.json({
      success: true,
      data: { message: 'Thank you for your message. We will be in touch soon.' },
    })
  } catch (e: any) {
    console.error('POST contact:', e.message)
    res.status(400).json({ success: false, error: e.message || 'Invalid request' })
  }
})

app.get('/api/public/give-settings', async (_req, res) => {
  try {
    const rows = await dbQuery<any>('give_settings', {
      order: [{ column: 'updated_at', ascending: false }],
      limit: 1,
    })
    res.json({ success: true, data: rows[0] || null })
  } catch (e: any) {
    console.error('GET give_settings:', e.message)
    res.json({ success: true, data: null })
  }
})

app.get('/api/public/carousel-slides', async (req, res) => {
  const page = String(req.query.page || 'home')
  try {
    const rows = await dbQuery<any>('carousel_slides', {
      eq: [['page', page], ['is_active', true]],
      order: [{ column: 'display_order' }],
    })
    res.json({ success: true, data: rows })
  } catch (e: any) {
    console.error('GET carousel_slides:', e.message)
    res.json({ success: true, data: [] })
  }
})

app.get('/api/public/scripture-library', async (_req, res) => {
  try {
    const rows = await dbQuery<any>('scripture_library', {
      eq: [['is_active', true]],
    })
    res.json({ success: true, data: rows })
  } catch (e: any) {
    console.error('GET scripture_library:', e.message)
    res.json({ success: true, data: [] })
  }
})

app.get('/api/public/generation-groups', async (_req, res) => {
  try {
    const rows = await dbQuery<any>('generation_groups', {
      order: [{ column: 'display_order' }],
    })
    res.json({ success: true, data: rows })
  } catch (e: any) {
    console.error('GET generation_groups:', e.message)
    res.json({ success: true, data: [] })
  }
})

app.post('/api/public/prayer-request', async (req, res) => {
  const prayerSchema = z.object({
    name: z.string().min(1),
    request: z.string().min(1),
  })
  try {
    const body = prayerSchema.parse(req.body || {})
    if (isSupabaseConfigured && hasServiceRoleKey) {
      try {
        await dbInsert('visitor_requests', {
          full_name: body.name,
          phone: 'Prayer Wall',
          email: null,
          service: 'Prayer Request',
          prayer_request: body.request,
        })
      } catch (dbErr: any) {
        console.error('prayer visitor_requests insert:', dbErr?.message || dbErr)
      }
    }
    res.json({ success: true, data: { message: 'Your prayer request has been received.' } })
  } catch (e: any) {
    res.status(400).json({ success: false, error: e.message || 'Invalid request' })
  }
})

app.post('/api/public/plan-visit', async (req, res) => {
  const planVisitSchema = z.object({
    fullName: z.string().min(1),
    phone: z.string().min(1),
    email: z.string().email().optional().or(z.literal('')),
    service: z.string().min(1),
    howDidYouHear: z.string().optional(),
    prayerRequest: z.string().optional(),
  })

  try {
    const body = planVisitSchema.parse(req.body || {})

    try {
      const { sendPlanVisitEmail } = await import('../src/lib/email')
      await sendPlanVisitEmail(body)
    } catch (emailErr: any) {
      console.error('Plan visit email error:', emailErr?.message || emailErr)
    }

    if (isSupabaseConfigured && hasServiceRoleKey) {
      try {
        await dbInsert('visitor_requests', {
          full_name: body.fullName,
          phone: body.phone,
          email: body.email || null,
          service: body.service,
          how_did_you_hear: body.howDidYouHear || null,
          prayer_request: body.prayerRequest || null,
        })
      } catch (dbErr: any) {
        console.error('visitor_requests insert error:', dbErr?.message || dbErr)
      }
    }

    res.json({
      success: true,
      data: { message: 'Thank you! We will be in touch soon to welcome you.' },
    })
  } catch (e: any) {
    console.error('POST plan-visit:', e.message)
    res.status(400).json({ success: false, error: e.message || 'Invalid request' })
  }
})

app.post('/api/admin/login', async (req, res) => {
  try {
    console.log('Login attempt received')
    const body = loginSchema.parse(req.body || {})
    const normalizedLogin = normalizeIdentifier(body.username)

    const envAdmins = getEnvAdmins()
    console.log('Env admins configured:', envAdmins.length)
    const envAdmin = envAdmins.find(
      (admin) =>
        body.password.trim() === admin.password &&
        (normalizedLogin === admin.username || normalizedLogin === admin.email),
    )

    if (envAdmin) {
      console.log('Login successful with env admin')
      return res.json({
        success: true,
        data: {
          token: envAdmin.token,
          admin: {
            id: envAdmin.id,
            username: envAdmin.username,
            email: envAdmin.email,
            role: envAdmin.role,
            isSuperAdmin: envAdmin.isSuperAdmin,
          },
        },
      })
    }

    if (isSupabaseConfigured && hasServiceRoleKey) {
      try {
        const sb = getSupabaseAdmin()
        const { data: byUsername, error: userErr } = await sb
          .from('admins')
          .select('*')
          .ilike('username', normalizedLogin)
          .maybeSingle()
        if (userErr) throw new Error(userErr.message)

        let admin = byUsername
        if (!admin) {
          const { data: byEmail, error: emailErr } = await sb
            .from('admins')
            .select('*')
            .ilike('email', normalizedLogin)
            .maybeSingle()
          if (emailErr) throw new Error(emailErr.message)
          admin = byEmail
        }

        if (!admin) {
          console.warn(`Login failed: no admin found for "${normalizedLogin}"`)
          return res.status(401).json({ success: false, error: 'Invalid credentials' })
        }
        const hash = admin.password_hash as string
        if (!hash?.startsWith('$2')) {
          console.error(`Admin "${normalizedLogin}" has unsupported password hash format`)
          return res.status(503).json({
            success: false,
            error: 'Account password must be reset (bcrypt hash required).',
          })
        }
        const isValid = await bcrypt.compare(body.password, hash)
        if (!isValid) {
          console.warn(`Login failed: invalid password for "${normalizedLogin}"`)
          return res.status(401).json({ success: false, error: 'Invalid credentials' })
        }
        return res.json({
          success: true,
          data: {
            token: admin.id,
            admin: {
              id: admin.id,
              username: admin.username,
              email: admin.email,
              role: admin.role,
              isSuperAdmin: admin.is_super_admin,
            },
          },
        })
      } catch (dbErr: any) {
        console.error(`DB login lookup failed for "${normalizedLogin}":`, dbErr.message)
        return res.status(503).json({
          success: false,
          error: 'Authentication service temporarily unavailable. Please try again.',
        })
      }
    }

    if (isSupabaseConfigured && !hasServiceRoleKey) {
      console.warn('Login failed: SUPABASE_SERVICE_ROLE_KEY is not set (anon key cannot read admins)')
      return res.status(503).json({
        success: false,
        error:
          'Server auth is misconfigured. Add SUPABASE_SERVICE_ROLE_KEY or ADMIN_EMAILS/ADMIN_USERNAME and ADMIN_PASSWORD in Vercel.',
      })
    }

    return res.status(401).json({
      success: false,
      error:
        'Invalid credentials. On Vercel, set ADMIN_EMAILS/ADMIN_USERNAME and ADMIN_PASSWORD, or add an admin row in Supabase.',
    })
  } catch (err: any) {
    if (err?.name === 'ZodError') {
      return res.status(400).json({ success: false, error: 'Username and password are required.' })
    }
    console.error('Login error:', err)
    res.status(500).json({ success: false, error: 'Login failed. Please try again.' })
  }
})

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
      title: body.title,
      day: body.day,
      start_time: body.startTime,
      end_time: body.endTime,
      venue: body.venue,
      contacts: parseContacts(body.contacts),
      description: body.description ?? null,
      poster_image_url: body.posterImageUrl ?? null,
      link_url: body.linkUrl ?? body.link_url ?? null,
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
      title: body.title,
      day: body.day,
      start_time: body.startTime,
      end_time: body.endTime,
      venue: body.venue,
      contacts: parseContacts(body.contacts),
      description: body.description ?? null,
      poster_image_url: body.posterImageUrl ?? null,
      link_url: body.linkUrl ?? body.link_url ?? null,
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

app.get('/api/admin/live', async (req, res) => {
  const admin = await getAdminFromToken(req.headers.authorization)
  if (!admin) return res.status(401).json({ error: 'Unauthorized' })
  try {
    const rows = await dbQuery<any>('live_streams', {
      order: [{ column: 'updated_at', ascending: false }],
      limit: 1,
    })
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
    const existingRows = await dbQuery<any>('live_streams', {
      order: [{ column: 'updated_at', ascending: false }],
      limit: 1,
    })
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
    const row = existing
      ? await dbUpdate<any>('live_streams', existing.id, data)
      : await dbInsert<any>('live_streams', data)
    res.json({ success: true, data: row })
  } catch (e: any) {
    console.error('PUT admin/live:', e.message)
    res.status(500).json({ success: false, error: 'Failed to update live stream' })
  }
})

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
      title: body.title,
      description: body.description ?? null,
      speaker: body.speaker ?? null,
      date: body.date ? new Date(body.date).toISOString() : new Date().toISOString(),
      video_url: body.videoUrl ?? body.video_url ?? null,
      audio_url: body.audioUrl ?? body.audio_url ?? null,
      thumbnail_url: body.thumbnailUrl ?? body.thumbnail_url ?? null,
      duration: body.duration ?? null,
      views: 0,
      updated_by: admin.id,
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
      title: body.title,
      description: body.description ?? null,
      speaker: body.speaker ?? null,
      date: body.date ? new Date(body.date).toISOString() : undefined,
      video_url: body.videoUrl ?? body.video_url ?? null,
      audio_url: body.audioUrl ?? body.audio_url ?? null,
      thumbnail_url: body.thumbnailUrl ?? body.thumbnail_url ?? null,
      duration: body.duration ?? null,
      updated_by: admin.id,
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

const mapUpdateLinkInput = (body: any) => ({
  title: body?.title,
  url: body?.url,
  description: body?.description ?? '',
  category: body?.category ?? 'General',
  is_active: typeof body?.is_active === 'boolean' ? body.is_active : body?.isActive ?? true,
  order_index:
    typeof body?.display_order === 'number'
      ? body.display_order
      : typeof body?.orderIndex === 'number'
        ? body.orderIndex
        : 0,
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
    const row = await dbInsert<any>('update_links', {
      ...mapUpdateLinkInput(req.body),
      updated_by: admin.id,
    })
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
    const row = await dbUpdate<any>('update_links', req.params.id, {
      ...mapUpdateLinkInput(req.body),
      updated_by: admin.id,
    })
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
    if (!isSupabaseConfigured) {
      return res.status(503).json({
        success: false,
        error: 'Database not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env',
      })
    }

    const optimizedFile = await optimizeUploadImage(req.file)
    const fileName = `${Date.now()}-${optimizedFile.originalname}`
    const filePath = fileName

    let publicUrl = ''
    let isOfflineFallback = false

    try {
      const supabase = getSupabaseAdmin()
      await ensurePhotoBucket(supabase)

      const { error: uploadError } = await supabase.storage
        .from(PHOTO_BUCKET)
        .upload(filePath, optimizedFile.buffer, {
          contentType: optimizedFile.mimetype,
          upsert: true,
        })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from(PHOTO_BUCKET).getPublicUrl(filePath)
      publicUrl = urlData.publicUrl
    } catch (storageErr: any) {
      console.warn('Supabase upload failed, falling back to local storage:', storageErr.message)
      
      // Local fallback
      const fs = require('fs')
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true })
      }
      fs.writeFileSync(path.join(uploadsDir, fileName), optimizedFile.buffer)
      publicUrl = `/uploads/${fileName}`
      isOfflineFallback = true
    }

    const newPhotoRecord = {
      id: crypto.randomUUID(),
      filename: fileName,
      original_name: optimizedFile.originalname,
      url: publicUrl,
      size: optimizedFile.size,
      category: req.body.category || 'general',
      upload_date: new Date().toISOString(),
      updated_by: admin.id,
    }

    let finalRow = newPhotoRecord

    if (!isOfflineFallback) {
      try {
        finalRow = await dbInsert<any>('photos', newPhotoRecord)
      } catch (dbErr: any) {
        console.warn('Supabase DB insert failed, using mock record:', dbErr.message)
      }
    }

    res.json({ success: true, data: finalRow, offline: isOfflineFallback })
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
    const { data, error } = await (sb.from('photos') as any)
      .update({ category, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select()
      .single()

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
    const supabase = getSupabaseAdmin()

    const { error: storageError } = await supabase.storage
      .from(PHOTO_BUCKET)
      .remove([filename])

    if (storageError) {
      console.error('Storage deletion error:', storageError)
    }

    await supabase.from('photos').delete().eq('filename', filename)

    res.json({ success: true, message: 'Photo deleted successfully' })
  } catch (e: any) {
    console.error('DELETE admin/photos:', e.message)
    res.status(500).json({ success: false, error: 'Failed to delete photo' })
  }
})

app.get('/api/admin/admins', async (req, res) => {
  const admin = await getAdminFromToken(req.headers.authorization)
  if (!admin) return res.status(401).json({ error: 'Unauthorized' })
  if (!admin.isSuperAdmin) return res.status(403).json({ error: 'Forbidden' })
  try {
    const rows = await dbQuery<any>('admins', {})
    res.json({
      success: true,
      data: rows.map((a) => ({
        id: a.id,
        username: a.username,
        email: a.email,
        role: a.role,
        isSuperAdmin: a.is_super_admin,
      })),
    })
  } catch (e: any) {
    console.error('GET admin/admins:', e.message)
    res.status(500).json({ success: false, error: 'Failed to fetch admins' })
  }
})

app.get('/api/admin/give-settings', async (req, res) => {
  const admin = await getAdminFromToken(req.headers.authorization)
  if (!admin) return res.status(401).json({ error: 'Unauthorized' })
  try {
    const rows = await dbQuery<any>('give_settings', {
      order: [{ column: 'updated_at', ascending: false }],
      limit: 1,
    })
    res.json({ success: true, data: rows[0] || null })
  } catch (e: any) {
    console.error('GET admin/give-settings:', e.message)
    res.status(500).json({ success: false, error: 'Failed to fetch give settings' })
  }
})

app.put('/api/admin/give-settings', async (req, res) => {
  const admin = await getAdminFromToken(req.headers.authorization)
  if (!admin) return res.status(401).json({ error: 'Unauthorized' })

  const giveSettingsSchema = z.object({
    paybillNumber: z.string().min(1),
    accountNumber: z.string().min(1),
    accountSuffixes: z.array(z.string()).optional(),
    bankName: z.string().optional(),
    bankAccountName: z.string().optional(),
    bankAccountNumber: z.string().optional(),
    bankBranch: z.string().optional(),
  })

  try {
    const body = giveSettingsSchema.parse(req.body || {})
    const now = new Date().toISOString()
    const record = {
      paybill_number: body.paybillNumber,
      account_number: body.accountNumber,
      account_suffixes: body.accountSuffixes || ['#offering/tithe', '#missions', '#building'],
      bank_name: body.bankName || null,
      bank_account_name: body.bankAccountName || null,
      bank_account_number: body.bankAccountNumber || null,
      bank_branch: body.bankBranch || null,
      updated_at: now,
    }

    const existing = await dbQuery<any>('give_settings', {
      order: [{ column: 'updated_at', ascending: false }],
      limit: 1,
    })

    const row =
      existing[0]?.id
        ? await dbUpdate<any>('give_settings', existing[0].id, record)
        : await dbInsert<any>('give_settings', record)

    res.json({ success: true, data: row })
  } catch (e: any) {
    console.error('PUT admin/give-settings:', e.message)
    res.status(400).json({ success: false, error: e.message || 'Failed to save give settings' })
  }
})

app.get('/api/admin/site', async (req, res) => {
  const admin = await getAdminFromToken(req.headers.authorization)
  if (!admin) return res.status(401).json({ error: 'Unauthorized' })
  try {
    const rows = await dbQuery<any>('site_settings', {
      order: [{ column: 'updated_at', ascending: false }],
      limit: 1,
    })
    res.json({ success: true, data: rows[0] || null })
  } catch (e: any) {
    console.error('GET admin/site:', e.message)
    res.status(500).json({ success: false, error: 'Failed to fetch site' })
  }
})

app.get('/api/public/testimonials', async (_req, res) => {
  try {
    const rows = await dbQuery<any>('testimonials', {
      eq: [['is_published', true]],
      order: [{ column: 'order_index' }],
    })
    res.json({ success: true, data: rows })
  } catch (e: any) {
    console.error('GET public/testimonials:', e.message)
    res.json({ success: true, data: [] })
  }
})

app.get('/api/admin/testimonials', async (req, res) => {
  const admin = await getAdminFromToken(req.headers.authorization)
  if (!admin) return res.status(401).json({ error: 'Unauthorized' })
  try {
    const rows = await dbQuery<any>('testimonials', { order: [{ column: 'order_index' }] })
    res.json({ success: true, data: rows })
  } catch (e: any) {
    console.error('GET admin/testimonials:', e.message)
    res.status(500).json({ success: false, error: 'Failed to fetch testimonials' })
  }
})

app.post('/api/admin/testimonials', async (req, res) => {
  const admin = await getAdminFromToken(req.headers.authorization)
  if (!admin) return res.status(401).json({ error: 'Unauthorized' })
  try {
    const body = req.body || {}
    const row = await dbInsert<any>('testimonials', {
      author_name: body.authorName,
      title: body.title ?? null,
      message: body.message,
      image_url: body.imageUrl ?? null,
      is_published: typeof body.isPublished === 'boolean' ? body.isPublished : false,
      order_index: typeof body.orderIndex === 'number' ? body.orderIndex : 0,
    })
    res.json({ success: true, data: row })
  } catch (e: any) {
    console.error('POST admin/testimonials:', e.message)
    res.status(500).json({ success: false, error: 'Failed to create testimonial' })
  }
})

app.put('/api/admin/testimonials/:id', async (req, res) => {
  const admin = await getAdminFromToken(req.headers.authorization)
  if (!admin) return res.status(401).json({ error: 'Unauthorized' })
  try {
    const body = req.body || {}
    const row = await dbUpdate<any>('testimonials', req.params.id, {
      author_name: body.authorName,
      title: body.title ?? null,
      message: body.message,
      image_url: body.imageUrl ?? null,
      is_published: typeof body.isPublished === 'boolean' ? body.isPublished : undefined,
      order_index: typeof body.orderIndex === 'number' ? body.orderIndex : undefined,
      updated_at: new Date().toISOString(),
    })
    res.json({ success: true, data: row })
  } catch (e: any) {
    console.error('PUT admin/testimonials:', e.message)
    res.status(500).json({ success: false, error: 'Failed to update testimonial' })
  }
})

app.delete('/api/admin/testimonials/:id', async (req, res) => {
  const admin = await getAdminFromToken(req.headers.authorization)
  if (!admin) return res.status(401).json({ error: 'Unauthorized' })
  try {
    await dbDelete('testimonials', req.params.id)
    res.json({ success: true })
  } catch (e: any) {
    console.error('DELETE admin/testimonials:', e.message)
    res.status(500).json({ success: false, error: 'Failed to delete testimonial' })
  }
})

app.use((req, res) => {
  console.warn(`404 Not Found: ${req.method} ${req.url}`)
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.url}. Ensure you have the correct API prefix.`,
  })
})

app.use((err: any, _req: any, res: any, _next: any) => {
  console.error('Unhandled Server Error:', err)
  res.status(500).json({
    success: false,
    error: 'Internal server error. Please check server logs.',
  })
})

export default app
