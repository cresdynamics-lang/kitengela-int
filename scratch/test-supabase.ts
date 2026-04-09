import dotenv from 'dotenv'
dotenv.config()
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || ''
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

async function testSupabase() {
  console.log('Testing Supabase connection...')
  console.log('URL:', supabaseUrl)
  console.log('Key defined:', !!serviceRoleKey)

  const supabase = createClient(supabaseUrl, serviceRoleKey)

  console.log('Querying live_streams...')
  const start = Date.now()
  try {
    const { data, error } = await supabase
      .from('live_streams')
      .select('*')
      .limit(1)
    
    const end = Date.now()
    if (error) {
      console.error('Supabase error:', error.message)
    } else {
      console.log('Success! Data:', data)
      console.log(`Query took ${end - start}ms`)
    }
  } catch (err) {
    console.error('Fetch error:', err)
  }
}

testSupabase()
