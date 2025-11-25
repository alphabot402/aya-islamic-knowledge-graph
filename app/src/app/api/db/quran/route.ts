/**
 * Database-backed Quran API Route
 * Fetches Quran data from Supabase instead of filesystem
 */

import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/client'

export const revalidate = 3600 // Cache for 1 hour

export async function GET(request: Request) {
  try {
    const supabase = createServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    const surahNumber = searchParams.get('surah')

    // Single surah request
    if (surahNumber) {
      const number = parseInt(surahNumber)

      if (isNaN(number) || number < 1 || number > 114) {
        return NextResponse.json(
          { error: 'Invalid surah number. Must be between 1 and 114.' },
          { status: 400 }
        )
      }

      // Fetch surah with all verses
      const { data: surah, error } = await supabase
        .from('surahs')
        .select(`
          *,
          verses (
            id,
            verse_number,
            text_arabic,
            text_simple,
            text_english,
            juz,
            pillar_tags,
            topic_tags
          )
        `)
        .eq('number', number)
        .single()

      if (error) {
        console.error('Database error:', error)
        return NextResponse.json(
          { error: 'Failed to fetch surah data' },
          { status: 500 }
        )
      }

      if (!surah) {
        return NextResponse.json(
          { error: 'Surah not found' },
          { status: 404 }
        )
      }

      // Transform to match existing API format
      return NextResponse.json({
        surah: {
          surah_number: surah.number,
          name: surah.name_arabic,
          name_transliteration: surah.name_transliteration,
          name_translation: surah.name_translation,
          revelation_type: surah.revelation_type,
          revelation_order: surah.revelation_order,
          verses: (surah.verses as any[]).map((v: any) => ({
            index: v.verse_number,
            text_uthmani: v.text_arabic,
            text_simple: v.text_simple,
            text_english: v.text_english,
            structural_tags: {
              pillar_tags: v.pillar_tags || [],
              topic_tags: v.topic_tags || []
            }
          }))
        }
      })
    }

    // All surahs request (for graph visualization)
    const { data: surahs, error } = await supabase
      .from('graph_data')  // Use materialized view
      .select('*')
      .order('surah_number')

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch surahs data' },
        { status: 500 }
      )
    }

    // Transform to match existing API format
    return NextResponse.json({
      surahs: surahs.map(s => ({
        surah: s.surah_number,
        name: s.surah_name_arabic,
        verses: [],  // Don't load all verses for graph view
        verseCount: s.verse_count,
        revelationType: s.revelation_type,
        pillar: s.surah_pillar,
        connectionCount: s.connection_count
      }))
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
