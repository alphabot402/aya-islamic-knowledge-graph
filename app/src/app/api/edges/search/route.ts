import { NextRequest, NextResponse } from 'next/server'
import { EdgeSearchParamsSchema, type EdgeSearchParams, type Edge } from '@/validation/edge-schemas'
import { readdir, readFile } from 'fs/promises'
import { join } from 'path'

/**
 * ============================================================================
 * WEIGHTED SEARCH API - 7-FACTOR COMPOSITE SCORING
 * ============================================================================
 *
 * Enterprise-grade search endpoint for Islamic Knowledge Graph edges.
 * Implements scholarly methodology with multi-dimensional ranking.
 *
 * Algorithm Factors:
 * 1. Text Relevance (25%)     - TF-IDF search in Arabic/English
 * 2. Connection Strength (20%) - Edge tier and confidence score
 * 3. Pillar Importance (15%)   - Five Pillars prioritization matrix
 * 4. Scholarly Consensus (15%) - Ijma > Jumhur > Mukhtalaf
 * 5. Graph Centrality (10%)    - PageRank-style node importance
 * 6. User Context (10%)        - View count, ratings, featured status
 * 7. Temporal Relevance (5%)   - Recency of verification/updates
 *
 * @route GET /api/edges/search
 */

// ============================================================================
// PILLAR IMPORTANCE MATRIX
// ============================================================================

const PILLAR_WEIGHTS: Record<string, number> = {
  'shahada': 1.00,  // Testimony of faith - Foundation of Islam
  'salah': 0.95,    // Prayer - Second pillar
  'zakat': 0.90,    // Charity - Third pillar
  'sawm': 0.85,     // Fasting - Fourth pillar
  'hajj': 0.80,     // Pilgrimage - Fifth pillar
  'general': 0.70   // General Islamic knowledge
}

// ============================================================================
// CONSENSUS WEIGHTS
// ============================================================================

const CONSENSUS_WEIGHTS: Record<string, number> = {
  'ijma': 1.00,       // Unanimous consensus
  'jumhur': 0.90,     // Majority opinion
  'mukhtalaf': 0.75,  // Differing opinions
  'none': 0.60        // No consensus data
}

// ============================================================================
// VERIFICATION STATUS WEIGHTS
// ============================================================================

const VERIFICATION_WEIGHTS: Record<string, number> = {
  'manually_verified': 1.00,
  'pending_review': 0.70,
  'ai_suggested': 0.50,
  'disputed': 0.30,
  'rejected': 0.10
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Load all edge files from data/edges directory
 */
async function loadEdges(): Promise<Edge[]> {
  const edgesDir = join(process.cwd(), '..', 'data', 'edges')

  try {
    const files = await readdir(edgesDir)
    const edgeFiles = files.filter(f => f.endsWith('.jsonl') || f.endsWith('.json'))

    const allEdges: Edge[] = []

    for (const file of edgeFiles) {
      const filePath = join(edgesDir, file)
      const content = await readFile(filePath, 'utf-8')

      // Handle JSONL format (one JSON object per line)
      if (file.endsWith('.jsonl')) {
        const lines = content.split('\n').filter(line => line.trim())
        for (const line of lines) {
          try {
            const edge = JSON.parse(line)
            allEdges.push(edge)
          } catch (e) {
            console.error(`Failed to parse line in ${file}:`, e)
          }
        }
      }
      // Handle JSON array format
      else {
        try {
          const data = JSON.parse(content)
          if (Array.isArray(data)) {
            allEdges.push(...data)
          } else {
            allEdges.push(data)
          }
        } catch (e) {
          console.error(`Failed to parse ${file}:`, e)
        }
      }
    }

    return allEdges
  } catch (error) {
    console.error('Failed to load edges:', error)
    return []
  }
}

/**
 * Calculate text relevance score using simple TF-IDF-like approach
 * Searches in: verse text, hadith text, thematic context
 */
function calculateTextRelevance(edge: Edge, query: string): number {
  if (!query) return 1.0  // No query = all equally relevant

  const queryLower = query.toLowerCase()
  const searchableText = [
    edge.nodes.source.text_arabic || '',
    edge.nodes.source.text_english || '',
    edge.nodes.target.text_arabic_snippet || '',
    edge.nodes.target.text_english_snippet || '',
    edge.contextual_metadata?.thematic_context?.primary_theme || '',
    ...(edge.contextual_metadata?.thematic_context?.secondary_themes || [])
  ].join(' ').toLowerCase()

  // Simple term frequency
  const terms = queryLower.split(/\s+/)
  let matches = 0

  for (const term of terms) {
    if (searchableText.includes(term)) {
      matches++
    }
  }

  return terms.length > 0 ? matches / terms.length : 0
}

/**
 * Calculate connection strength score
 * Based on tier and confidence score
 */
function calculateConnectionStrength(edge: Edge): number {
  const tier = edge.connection_metadata.connection_strength.tier
  const confidence = edge.connection_metadata.connection_strength.confidence_score

  const tierWeight = tier === '1' ? 1.0 : tier === '2' ? 0.7 : 0.4

  return (tierWeight * 0.6) + (confidence * 0.4)
}

/**
 * Calculate pillar importance score
 */
function calculatePillarImportance(edge: Edge): number {
  const pillar = edge.connection_metadata.pillar
  return PILLAR_WEIGHTS[pillar] || 0.5
}

/**
 * Calculate scholarly consensus score
 */
function calculateScholarlyConsensus(edge: Edge): number {
  const consensus = edge.verification.scholarly_consensus?.consensus_level || 'none'
  const verificationStatus = edge.verification.status

  const consensusScore = CONSENSUS_WEIGHTS[consensus] || 0.6
  const verificationScore = VERIFICATION_WEIGHTS[verificationStatus] || 0.5

  return (consensusScore * 0.6) + (verificationScore * 0.4)
}

/**
 * Calculate graph centrality score
 * Uses betweenness, closeness, eigenvector if available
 */
function calculateGraphCentrality(edge: Edge): number {
  const centrality = edge.graph_properties?.centrality_scores

  if (!centrality) return 0.5  // Default for edges without centrality data

  const betweenness = centrality.betweenness || 0
  const closeness = centrality.closeness || 0
  const eigenvector = centrality.eigenvector || 0

  // Weighted average of centrality measures
  return (betweenness * 0.4) + (closeness * 0.3) + (eigenvector * 0.3)
}

/**
 * Calculate user context score
 * Based on view count, ratings, featured status
 */
function calculateUserContext(edge: Edge): number {
  const stats = edge.usage_statistics
  const flags = edge.flags

  let score = 0.5  // Base score

  // Featured edges get boost
  if (flags?.featured) {
    score += 0.3
  }

  // High educational priority gets boost
  if (flags?.educational_priority === 'high') {
    score += 0.2
  }

  // Engagement metrics (normalized)
  if (stats) {
    const viewScore = Math.min(stats.view_count / 1000, 0.3)  // Cap at 0.3
    const helpfulRatio = stats.user_ratings
      ? stats.user_ratings.helpful / (stats.user_ratings.helpful + stats.user_ratings.not_helpful + 1)
      : 0.5

    score += viewScore + (helpfulRatio * 0.2)
  }

  return Math.min(score, 1.0)  // Cap at 1.0
}

/**
 * Calculate temporal relevance score
 * Recent verifications and updates score higher
 */
function calculateTemporalRelevance(edge: Edge): number {
  const verificationDate = edge.verification.verification_date
  const updatedDate = edge.updated_at

  if (!verificationDate && !updatedDate) return 0.5  // No date info

  const mostRecentDate = verificationDate || updatedDate
  if (!mostRecentDate) return 0.5

  try {
    const date = new Date(mostRecentDate)
    const now = new Date()
    const daysSince = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)

    // Decay function: 1.0 for today, 0.5 at 1 year, 0.2 at 3 years
    if (daysSince < 30) return 1.0           // Within 1 month
    if (daysSince < 90) return 0.9           // Within 3 months
    if (daysSince < 180) return 0.8          // Within 6 months
    if (daysSince < 365) return 0.7          // Within 1 year
    if (daysSince < 730) return 0.5          // Within 2 years
    return 0.3                                // Older than 2 years
  } catch (e) {
    return 0.5  // Invalid date format
  }
}

/**
 * Calculate composite score using 7-factor algorithm
 */
function calculateCompositeScore(edge: Edge, query?: string): number {
  const textRelevance = calculateTextRelevance(edge, query || '')
  const connectionStrength = calculateConnectionStrength(edge)
  const pillarImportance = calculatePillarImportance(edge)
  const scholarlyConsensus = calculateScholarlyConsensus(edge)
  const graphCentrality = calculateGraphCentrality(edge)
  const userContext = calculateUserContext(edge)
  const temporalRelevance = calculateTemporalRelevance(edge)

  const compositeScore =
    (textRelevance * 0.25) +
    (connectionStrength * 0.20) +
    (pillarImportance * 0.15) +
    (scholarlyConsensus * 0.15) +
    (graphCentrality * 0.10) +
    (userContext * 0.10) +
    (temporalRelevance * 0.05)

  return compositeScore
}

/**
 * Apply filters to edge list
 */
function applyFilters(edges: Edge[], params: EdgeSearchParams): Edge[] {
  let filtered = edges

  // Pillar filter
  if (params.pillar) {
    filtered = filtered.filter(e => e.connection_metadata.pillar === params.pillar)
  }

  // Tier filter
  if (params.tier) {
    filtered = filtered.filter(e => e.connection_metadata.connection_strength.tier === params.tier)
  }

  // Connection type filter
  if (params.connection_type) {
    const connectionType = params.connection_type
    filtered = filtered.filter(e =>
      e.connection_metadata.connection_type.primary === connectionType ||
      e.connection_metadata.connection_type.secondary?.includes(connectionType)
    )
  }

  // Verification status filter
  if (params.verification_status) {
    filtered = filtered.filter(e => e.verification.status === params.verification_status)
  }

  // Min confidence filter
  if (params.min_confidence !== undefined) {
    filtered = filtered.filter(e =>
      e.connection_metadata.connection_strength.confidence_score >= params.min_confidence!
    )
  }

  // Min weight filter
  if (params.min_weight !== undefined) {
    filtered = filtered.filter(e => e.weights.adjusted_weight >= params.min_weight!)
  }

  // Source surah filter
  if (params.source_surah) {
    filtered = filtered.filter(e => e.nodes.source.surah === params.source_surah)
  }

  // Target collection filter
  if (params.target_collection) {
    filtered = filtered.filter(e =>
      e.nodes.target.collection.toLowerCase().includes(params.target_collection!.toLowerCase())
    )
  }

  // Featured only
  if (params.featured_only) {
    filtered = filtered.filter(e => e.flags?.featured === true)
  }

  // Verified only
  if (params.verified_only) {
    filtered = filtered.filter(e => e.verification.status === 'manually_verified')
  }

  return filtered
}

// ============================================================================
// API HANDLER
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl

    // Parse and validate query parameters
    const rawParams: any = {
      query: searchParams.get('query') || undefined,
      pillar: searchParams.get('pillar') || undefined,
      tier: searchParams.get('tier') || undefined,
      connection_type: searchParams.get('connection_type') || undefined,
      verification_status: searchParams.get('verification_status') || undefined,
      min_confidence: searchParams.get('min_confidence') ? parseFloat(searchParams.get('min_confidence')!) : undefined,
      min_weight: searchParams.get('min_weight') ? parseFloat(searchParams.get('min_weight')!) : undefined,
      source_surah: searchParams.get('source_surah') ? parseInt(searchParams.get('source_surah')!) : undefined,
      target_collection: searchParams.get('target_collection') || undefined,
      featured_only: searchParams.get('featured_only') === 'true',
      verified_only: searchParams.get('verified_only') === 'true',
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0,
      sort_by: searchParams.get('sort_by') || 'ranking',
      sort_order: searchParams.get('sort_order') || 'desc'
    }

    // Validate with Zod
    const validation = EdgeSearchParamsSchema.safeParse(rawParams)

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid search parameters',
          details: validation.error.issues
        },
        { status: 400 }
      )
    }

    const params = validation.data

    // Load all edges
    const allEdges = await loadEdges()

    if (allEdges.length === 0) {
      return NextResponse.json({
        success: true,
        edges: [],
        total: 0,
        page: {
          limit: params.limit,
          offset: params.offset,
          has_more: false
        },
        message: 'No edges found in database'
      })
    }

    // Apply filters
    let filteredEdges = applyFilters(allEdges, params)

    // Calculate composite scores for all edges
    const edgesWithScores = filteredEdges.map(edge => ({
      edge,
      score: calculateCompositeScore(edge, params.query)
    }))

    // Sort by score (or other criteria)
    if (params.sort_by === 'ranking' || params.sort_by === 'weight') {
      edgesWithScores.sort((a, b) =>
        params.sort_order === 'desc' ? b.score - a.score : a.score - b.score
      )
    } else if (params.sort_by === 'created') {
      edgesWithScores.sort((a, b) => {
        const dateA = new Date(a.edge.created_at || 0).getTime()
        const dateB = new Date(b.edge.created_at || 0).getTime()
        return params.sort_order === 'desc' ? dateB - dateA : dateA - dateB
      })
    } else if (params.sort_by === 'views') {
      edgesWithScores.sort((a, b) => {
        const viewsA = a.edge.usage_statistics?.view_count || 0
        const viewsB = b.edge.usage_statistics?.view_count || 0
        return params.sort_order === 'desc' ? viewsB - viewsA : viewsA - viewsB
      })
    }

    const total = edgesWithScores.length

    // Paginate
    const paginatedEdges = edgesWithScores.slice(
      params.offset,
      params.offset + params.limit
    )

    // Return results with scores
    return NextResponse.json({
      success: true,
      edges: paginatedEdges.map(({ edge, score }) => ({
        ...edge,
        _search_score: score  // Include score for debugging/transparency
      })),
      total,
      page: {
        limit: params.limit,
        offset: params.offset,
        has_more: params.offset + params.limit < total
      },
      query: params.query,
      filters_applied: {
        pillar: params.pillar,
        tier: params.tier,
        connection_type: params.connection_type,
        verification_status: params.verification_status,
        min_confidence: params.min_confidence,
        min_weight: params.min_weight,
        source_surah: params.source_surah,
        target_collection: params.target_collection,
        featured_only: params.featured_only,
        verified_only: params.verified_only
      }
    })

  } catch (error) {
    console.error('Search API error:', error)
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
