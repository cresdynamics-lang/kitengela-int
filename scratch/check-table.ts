import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

async function check() {
  const { data, error } = await supabase.from('photos').select('id').limit(1)
  if (error) {
    console.error('Check failed:', error.message)
    if (error.message.includes('does not exist')) {
       console.log('TABLE DOES NOT EXIST')
    }
  } else {
    console.log('Table exists, records:', data.length)
  }
}

check()
