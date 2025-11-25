/**
 * Database-backed Edges API Route
 * Fetches Edge data from Supabase with filtering
 */

import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/client'

export const revalidate = 1800 // Cache for 30 minutes

export async function GET(request: Request) {
  try {
    const supabase = createServerSupabaseClient()
    const { searchParams } = new URL(request.url)

    // Get filter parameters
    const surahParam = searchParams.get('surah')
    const hadithIdParam = searchParams.get('hadith_id')
    const verifiedOnlyParam = searchParams.get('verified') === 'true'
    const pillarParam = searchParams.get('pillar')

    // Build query
    let query = supabase
      .from('edges')
      .select(`
        id,
        connection_type,
        relationship_description,
        strength,
        weight,
        pillar,
        verified,
        verified_by,
        verified_at,
        verification_sources,
        tags,
        verses!inner (
          id,
          surah_id,
          verse_number,
          text_arabic,
          text_english,
          surahs!inner (
            number
          )
        ),
        hadiths!inner (
          id,
          id_in_book,
          text_arabic,
          text_english,
          narrator_primary
        )
      `)

    // Filter by surah
    if (surahParam) {
      const surahNumber = parseInt(surahParam)
      if (!isNaN(surahNumber)) {
        query = query.eq('verses.surahs.number', surahNumber)
      }
    }

    // Filter by hadith
    if (hadithIdParam) {
      query = query.eq('hadith_id', hadithIdParam)
    }

    // Filter by pillar
    if (pillarParam) {
      query = query.eq('pillar', pillarParam)
    }

    // Filter verified only
    if (verifiedOnlyParam) {
      query = query.eq('verified', true)
    }

    // Execute query
    const { data: edges, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch edges data' },
        { status: 500 }
      )
    }

    // Transform to match existing API format
    const transformedEdges = edges.map((e: any) => ({
      id: e.id,
      verse: {
        surah: (e.verses.surahs as any).number,
        verse: e.verses.verse_number,
        reference: `${(e.verses.surahs as any).number}:${e.verses.verse_number}`,
        text: e.verses.text_arabic
      },
      hadith: {
        collection: 'Sahih al-Bukhari',  // TODO: Get from join
        idInBook: e.hadiths.id_in_book,
        reference: `Bukhari ${e.hadiths.id_in_book}`
      },
      connectionType: e.connection_type,
      relationship: e.relationship_description,
      scholarlyVerification: {
        verified: e.verified,
        verifiedBy: e.verified_by,
        verificationDate: e.verified_at,
        sources: e.verification_sources || [],
        notes: ''
      },
      strength: e.strength,
      tags: e.tags || []
    }))

    return NextResponse.json({
      success: true,
      data: transformedEdges,
      metadata: {
        total: transformedEdges.length,
        filters: {
          surah: surahParam,
          pillar: pillarParam,
          verifiedOnly: verifiedOnlyParam
        }
      },
      source: 'database'
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
