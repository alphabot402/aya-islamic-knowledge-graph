/**
 * Supabase Client for Migration Scripts
 * Uses service role key for admin operations
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials!')
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

// Create Supabase client with service role key (bypasses RLS)
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Helper: Check database connection
export async function checkConnection(): Promise<boolean> {
  try {
    const { error } = await supabase.from('surahs').select('count', { count: 'exact', head: true })
    if (error && error.code !== 'PGRST116') {  // PGRST116 = table doesn't exist yet (OK for initial migration)
      console.error('❌ Database connection error:', error.message)
      return false
    }
    console.log('✅ Database connection successful')
    return true
  } catch (error) {
    console.error('❌ Failed to connect to database:', error)
    return false
  }
}

// Helper: Execute raw SQL (for schema setup)
export async function executeSql(sql: string): Promise<void> {
  const { error } = await supabase.rpc('exec_sql', { sql })
  if (error) {
    throw new Error(`SQL execution failed: ${error.message}`)
  }
}

// Helper: Batch insert with progress tracking
export async function batchInsert<T extends Record<string, any>>(
  table: string,
  data: T[],
  batchSize: number = 100
): Promise<void> {
  console.log(`📊 Inserting ${data.length} records into ${table}...`)

  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize)
    const { error } = await supabase.from(table).insert(batch)

    if (error) {
      console.error(`❌ Error inserting batch ${i / batchSize + 1}:`, error.message)
      throw error
    }

    const progress = Math.min(i + batchSize, data.length)
    const percent = ((progress / data.length) * 100).toFixed(1)
    process.stdout.write(`\r   Progress: ${progress}/${data.length} (${percent}%)`)
  }

  console.log(`\n✅ Inserted ${data.length} records into ${table}`)
}

// Helper: Clear table (for re-migration during development)
export async function clearTable(table: string): Promise<void> {
  console.log(`🗑️  Clearing table: ${table}`)
  const { error } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000')
  if (error && error.code !== 'PGRST116') {
    console.error(`❌ Error clearing ${table}:`, error.message)
  }
}
