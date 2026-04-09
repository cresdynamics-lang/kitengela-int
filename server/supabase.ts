/**
 * Server-side Supabase admin client.
 * Uses service_role key so it bypasses RLS.
 * All DB access goes over HTTPS (port 443) — no PostgreSQL TCP required.
 */
import dotenv from 'dotenv'
dotenv.config()

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || ''
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const anonKey = process.env.SUPABASE_ANON_KEY || ''

// Use service_role if available, otherwise fall back to anon
const effectiveKey = serviceRoleKey || anonKey

let _client: ReturnType<typeof createClient> | null = null

export function getSupabaseAdmin() {
  if (!_client) {
    if (!supabaseUrl || !effectiveKey) {
      throw new Error(
        'Missing SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_ANON_KEY) in .env'
      )
    }
    _client = createClient(supabaseUrl, effectiveKey, {
      auth: { persistSession: false },
    })
  }
  return _client
}

export const isSupabaseConfigured = !!(supabaseUrl && effectiveKey)
