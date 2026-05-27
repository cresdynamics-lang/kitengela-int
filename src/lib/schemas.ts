import { z } from 'zod'

// Site Settings Schemas
export const siteSettingsSchema = z.object({
  churchName: z.string().min(1),
  tagline: z.string().optional(),
  locationText: z.string().min(1),
  mapLink: z.string().url().optional(),
  logoUrl: z.string().url().nullable(),
  facebookUrl: z.string().url().nullable(),
  instagramUrl: z.string().url().nullable(),
  youtubeUrl: z.string().url().nullable(),
  twitterUrl: z.string().url().nullable(),
  phoneNumbers: z.array(z.string()),
  email: z.string().email().nullable(),
})

// Program Schemas
export const createProgramSchema = z.object({
  title: z.string().min(1),
  day: z.enum(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  venue: z.string().min(1),
  contacts: z.array(z.string()),
  posterImageUrl: z.string().url().nullable(),
  linkUrl: z.string().url().nullable().optional(),
  description: z.string().nullable(),
  isActive: z.boolean().default(true),
  orderIndex: z.number().int().default(0),
})

export const updateProgramSchema = createProgramSchema.partial()

// Event Schemas
export const createEventSchema = z.object({
  title: z.string().min(1),
  date: z.string().datetime(),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  venue: z.string().min(1),
  entryFee: z.string().nullable(),
  description: z.string().nullable(),
  speakers: z.array(z.string()),
  posterImageUrl: z.string().url().nullable(),
})

export const updateEventSchema = createEventSchema.partial()

// LiveStream Schemas
export const updateLiveStreamSchema = z.object({
  isLive: z.boolean(),
  platform: z.enum(['youtube', 'facebook', 'googlemeet']).nullable(),
  youtubeLiveUrl: z.string().url().nullable(),
  facebookLiveUrl: z.string().url().nullable(),
  googleMeetUrl: z.string().url().nullable(),
  title: z.string().nullable(),
  scheduleTime: z.string().datetime().nullable(),
})

// SermonSource Schemas
export const updateSermonSourceSchema = z.object({
  youtubePlaylistUrl: z.string().url().nullable(),
  latestSermonUrl: z.string().url().nullable(),
})

// Sermon Schemas
export const createSermonSchema = z.object({
  title: z.string().min(1),
  description: z.string().nullable(),
  speaker: z.string().nullable(),
  date: z.string().datetime(),
  videoUrl: z.string().url().nullable(),
  audioUrl: z.string().url().nullable(),
  thumbnailUrl: z.string().url().nullable(),
  duration: z.number().int().positive().nullable(),
})

export const updateSermonSchema = createSermonSchema.partial()

// Leader Schemas
export const createLeaderSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  bio: z.string().nullable(),
  photoUrl: z.string().url().nullable(),
  facebookUrl: z.string().url().nullable(),
  instagramUrl: z.string().url().nullable(),
  twitterUrl: z.string().url().nullable(),
  orderIndex: z.number().int().default(0),
})

export const updateLeaderSchema = createLeaderSchema.partial()

// Auth Schemas
export const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(6),
})

export const createAdminSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().nullable(),
  role: z.enum(['admin', 'moderator', 'editor']).default('admin'),
  isSuperAdmin: z.boolean().default(false),
})

export const updateAdminSchema = z.object({
  username: z.string().min(3).optional(),
  email: z.string().email().optional(),
  fullName: z.string().nullable().optional(),
  role: z.enum(['admin', 'moderator', 'editor']).optional(),
  isSuperAdmin: z.boolean().optional(),
})
