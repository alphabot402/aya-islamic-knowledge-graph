/**
 * Database-backed Hadith API Route
 * Fetches Hadith data from Supabase with filtering
 */

import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/client'

export const revalidate = 3600 // Cache for 1 hour

export async function GET(request: Request) {
  try {
    const supabase = createServerSupabaseClient()
    const { searchParams } = new URL(request.url)

    // Get filter parameters
    const idsParam = searchParams.get('ids')  // Comma-separated IDs
    const collectionParam = searchParams.get('collection') || 'Sahih al-Bukhari'
    const bookIdParam = searchParams.get('book')
    const limitParam = searchParams.get('limit')

    // Parse IDs if provided
    const ids = idsParam?.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id))

    // Build query
    let query = supabase
      .from('hadiths')
      .select(`
        id,
        id_in_book,
        book_id,
        chapter_id,
        book_name_arabic,
        book_name_english,
        narrator_primary,
        text_arabic,
        text_english,
        grade,
        pillar_tags,
        hadith_collections!inner (
          name_english
        )
      `)
      .eq('hadith_collections.name_english', collectionParam)

    // Filter by IDs (SMART LOADING - only fetch hadiths we need)
    if (ids && ids.length > 0) {
      if (ids.length > 100) {
        return NextResponse.json(
          { error: 'Maximum 100 hadiths per request' },
          { status: 400 }
        )
      }
      query = query.in('id_in_book', ids)
    }

    // Filter by book if specified
    if (bookIdParam) {
      const bookId = parseInt(bookIdParam)
      if (!isNaN(bookId)) {
        query = query.eq('book_id', bookId)
      }
    }

    // Apply limit (default 100, max 1000)
    const limit = limitParam ? Math.min(parseInt(limitParam), 1000) : 100
    query = query.limit(limit)

    // Execute query
    const { data: hadiths, error } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch hadith data' },
        { status: 500 }
      )
    }

    // Transform to match existing API format
    const transformedHadiths = hadiths.map((h: any) => ({
      id: h.id,
      idInBook: h.id_in_book,
      chapterId: h.chapter_id,
      bookId: h.book_id,
      arabic: h.text_arabic,
      english: {
        narrator: h.narrator_primary || '',
        text: h.text_english
      },
      grade: h.grade,
      pillarTags: h.pillar_tags || []
    }))

    return NextResponse.json({
      success: true,
      data: transformedHadiths,
      total: transformedHadiths.length,
      collection: collectionParam,
      source: 'database'  // Indicator that this came from Supabase
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
