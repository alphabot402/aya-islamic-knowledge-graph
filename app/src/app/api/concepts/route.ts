import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

/**
 * ============================================================================
 * CONCEPTS API - Islamic Knowledge Graph Concept Nodes
 * ============================================================================
 *
 * Serves 30 core Islamic concepts with scholarly metadata
 * Supports filtering by category, pillar, and search
 *
 * @route GET /api/concepts
 */

export interface Concept {
  id: string
  arabic_name: string
  english_name: string
  transliteration: string
  root: string
  definition: {
    arabic: string
    english: string
  }
  category: string
  related_pillars: string[]
  quranic_frequency: 'very_high' | 'high' | 'medium' | 'low'
  hadith_frequency: 'very_high' | 'high' | 'medium' | 'low'
  scholarly_references: Array<{
    work: string
    reference?: string
    note?: string
    author?: string
    volume?: number
    hadith_number?: number
  }>
  tags: string[]
}

export interface ConceptsData {
  metadata: {
    version: string
    created_at: string
    description: string
    total_concepts: number
    curation_notes: string
  }
  concepts: Concept[]
}

/**
 * Load concepts from filesystem
 */
async function loadConcepts(): Promise<ConceptsData | null> {
  const conceptsPath = join(process.cwd(), '..', 'data', 'concepts', 'core-concepts.json')

  try {
    const content = await readFile(conceptsPath, 'utf-8')
    const data: ConceptsData = JSON.parse(content)
    return data
  } catch (error) {
    console.error('Failed to load concepts:', error)
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl

    // Query parameters
    const category = searchParams.get('category') || undefined
    const pillar = searchParams.get('pillar') || undefined
    const query = searchParams.get('query') || undefined
    const tag = searchParams.get('tag') || undefined
    const limit = parseInt(searchParams.get('limit') || '30')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Load concepts
    const data = await loadConcepts()

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to load concepts data'
        },
        { status: 500 }
      )
    }

    let filteredConcepts = data.concepts

    // Apply category filter
    if (category) {
      filteredConcepts = filteredConcepts.filter(c => c.category === category)
    }

    // Apply pillar filter
    if (pillar) {
      filteredConcepts = filteredConcepts.filter(c =>
        c.related_pillars.includes(pillar)
      )
    }

    // Apply tag filter
    if (tag) {
      filteredConcepts = filteredConcepts.filter(c =>
        c.tags.includes(tag)
      )
    }

    // Apply text search (in English name, Arabic name, or definition)
    if (query) {
      const queryLower = query.toLowerCase()
      filteredConcepts = filteredConcepts.filter(c =>
        c.english_name.toLowerCase().includes(queryLower) ||
        c.arabic_name.includes(query) ||
        c.transliteration.toLowerCase().includes(queryLower) ||
        c.definition.english.toLowerCase().includes(queryLower) ||
        c.definition.arabic.includes(query)
      )
    }

    const total = filteredConcepts.length

    // Paginate
    const paginatedConcepts = filteredConcepts.slice(offset, offset + limit)

    // Return response
    return NextResponse.json({
      success: true,
      metadata: data.metadata,
      concepts: paginatedConcepts,
      total,
      page: {
        limit,
        offset,
        has_more: offset + limit < total
      },
      filters_applied: {
        category,
        pillar,
        query,
        tag
      }
    })

  } catch (error) {
    console.error('Concepts API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
