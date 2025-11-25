/**
 * Supabase Client for Next.js App
 * Client-side and Server-side access patterns
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check .env.local'
  )
}

/**
 * Create Supabase client for browser/client-side usage
 * Use this in React components
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})

/**
 * Create Supabase client for server-side usage (API routes, Server Components)
 * This ensures fresh instance per request
 */
export function createServerSupabaseClient() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  })
}

// Type exports for database schema
export type Database = {
  public: {
    Tables: {
      surahs: {
        Row: {
          id: number
          number: number
          name_arabic: string
          name_transliteration: string
          name_translation: string
          revelation_type: 'Meccan' | 'Medinan'
          revelation_order: number | null
          verse_count: number
          primary_pillar: 'shahada' | 'salah' | 'zakat' | 'sawm' | 'hajj' | 'general'
          bismillah_pre: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['surahs']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['surahs']['Insert']>
      }
      verses: {
        Row: {
          id: string
          surah_id: number
          verse_number: number
          text_arabic: string
          text_simple: string
          text_english: string | null
          juz: number | null
          hizb: number | null
          page: number | null
          pillar_tags: string[]
          topic_tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['verses']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['verses']['Insert']>
      }
      hadiths: {
        Row: {
          id: string
          collection_id: string
          id_in_book: number
          book_id: number | null
          chapter_id: number | null
          book_name_arabic: string | null
          book_name_english: string | null
          chapter_name_arabic: string | null
          chapter_name_english: string | null
          narrator_primary: string | null
          isnad_chain: string | null
          text_arabic: string
          text_english: string
          grade: 'Sahih' | 'Hasan' | 'Daif'
          grade_source: string | null
          authentication_notes: string | null
          pillar_tags: string[]
          topic_tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['hadiths']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['hadiths']['Insert']>
      }
      edges: {
        Row: {
          id: string
          verse_id: string
          hadith_id: string
          connection_type: 'direct' | 'contextual' | 'thematic' | 'excellence' | 'clarification'
          relationship_description: string
          strength: 'weak' | 'moderate' | 'strong'
          weight: number
          pillar: 'shahada' | 'salah' | 'zakat' | 'sawm' | 'hajj' | 'general'
          verified: boolean
          verified_by: string | null
          verified_at: string | null
          verification_sources: any
          scholarly_notes: string | null
          created_by: string | null
          created_at: string
          updated_at: string
          tags: string[]
        }
        Insert: Omit<Database['public']['Tables']['edges']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['edges']['Insert']>
      }
    }
    Views: {
      graph_data: {
        Row: {
          surah_id: number
          surah_number: number
          surah_name_arabic: string
          revelation_type: 'Meccan' | 'Medinan'
          surah_pillar: 'shahada' | 'salah' | 'zakat' | 'sawm' | 'hajj' | 'general'
          verse_count: number
          connection_count: number
        }
      }
    }
  }
}
