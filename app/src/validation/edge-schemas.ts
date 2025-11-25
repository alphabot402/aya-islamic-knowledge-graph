/**
 * Edge Validation Schemas
 * Zod schemas for Islamic Knowledge Graph edges
 *
 * ✅ ENTERPRISE VALIDATION:
 * - Runtime validation for all edge data
 * - Scholarly metadata validation
 * - Connection strength verification
 * - Source verification
 */

import { z } from 'zod'

// ============================================================================
// ENUM SCHEMAS
// ============================================================================

export const EdgeTierSchema = z.enum(['1', '2', '3'])
export type EdgeTier = z.infer<typeof EdgeTierSchema>

export const ConnectionStrengthSchema = z.enum(['explicit', 'strong_implicit', 'thematic'])
export type ConnectionStrength = z.infer<typeof ConnectionStrengthSchema>

export const ConnectionTypeSchema = z.enum([
  'explicit_citation',
  'implicit_chapter',
  'exegetical_consensus',
  'legal_specification',
  'historical_context',
  'liturgical_wird',
  'thematic_connection'
])
export type ConnectionType = z.infer<typeof ConnectionTypeSchema>

export const LegalFunctionSchema = z.enum(['takhsis', 'taqyeed', 'bayan', 'naskh', 'none'])
export type LegalFunction = z.infer<typeof LegalFunctionSchema>

export const VerificationStatusSchema = z.enum([
  'manually_verified',
  'pending_review',
  'ai_suggested',
  'disputed',
  'rejected'
])
export type VerificationStatus = z.infer<typeof VerificationStatusSchema>

export const SourceTypeSchema = z.enum([
  'classical_tafsir',
  'hadith_commentary',
  'usul_fiqh',
  'scholarly_work'
])
export type SourceType = z.infer<typeof SourceTypeSchema>

export const ConsensusLevelSchema = z.enum(['ijma', 'jumhur', 'mukhtalaf', 'none'])
export type ConsensusLevel = z.infer<typeof ConsensusLevelSchema>

export const PillarSchema = z.enum(['shahada', 'salah', 'zakat', 'sawm', 'hajj', 'general'])
export type Pillar = z.infer<typeof PillarSchema>

export const EducationalPrioritySchema = z.enum(['high', 'medium', 'low'])
export type EducationalPriority = z.infer<typeof EducationalPrioritySchema>

// ============================================================================
// NODE SCHEMAS
// ============================================================================

export const QuranVerseNodeSchema = z.object({
  type: z.literal('quran_verse'),
  id: z.string().regex(/^verse_\d+_\d+$/),
  reference: z.string().regex(/^\d+:\d+$/),
  surah: z.number().int().min(1).max(114),
  ayah: z.number().int().positive(),
  text_arabic: z.string().min(1),
  text_english: z.string().min(1)
})

export const HadithNodeSchema = z.object({
  type: z.literal('hadith'),
  id: z.string().regex(/^hadith_\w+_\d+$/),
  collection: z.string().min(1),
  hadith_number: z.number().int().positive(),
  book_number: z.number().int().positive().optional(),
  text_arabic_snippet: z.string().min(1),
  text_english_snippet: z.string().min(1),
  narrator_chain: z.string().optional(),
  authentication: z.enum(['sahih', 'hasan', 'daif', 'unknown'])
})

// ============================================================================
// CONNECTION METADATA SCHEMAS
// ============================================================================

export const ConnectionStrengthMetadataSchema = z.object({
  tier: EdgeTierSchema,
  confidence_score: z.number().min(0).max(1),
  strength_label: ConnectionStrengthSchema
})

export const ConnectionTypeMetadataSchema = z.object({
  primary: ConnectionTypeSchema,
  secondary: z.array(ConnectionTypeSchema).optional(),
  linguistic_features: z.array(z.string()).optional()
})

export const LegalAnalysisSchema = z.object({
  legal_function: LegalFunctionSchema,
  ruling_type: z.string().optional(),
  madhab_positions: z.record(z.string(), z.string()).optional(),
  areas_of_fiqh: z.array(z.string()).optional()
})

export const ConnectionMetadataSchema = z.object({
  pillar: PillarSchema,
  sub_pillars: z.array(z.string()).optional(),
  connection_strength: ConnectionStrengthMetadataSchema,
  connection_type: ConnectionTypeMetadataSchema,
  legal_analysis: LegalAnalysisSchema.optional()
})

// ============================================================================
// VERIFICATION SCHEMAS
// ============================================================================

export const VerificationSourceSchema = z.object({
  type: SourceTypeSchema,
  work: z.string().min(1),
  reference: z.string().min(1),
  citation: z.string().optional(),
  author: z.string().optional(),
  page: z.number().int().positive().optional(),
  volume: z.number().int().positive().optional(),
  edition: z.string().optional(),
  relevance: z.string().optional()
})

export const ScholarlyConsensusSchema = z.object({
  consensus_level: ConsensusLevelSchema,
  dissenting_views: z.array(z.string()).optional(),
  notes: z.string().optional()
})

export const VerificationSchema = z.object({
  status: VerificationStatusSchema,
  verification_date: z.string().datetime().optional(),
  verified_by: z.array(z.string()).optional(),
  sources: z.array(VerificationSourceSchema),
  scholarly_consensus: ScholarlyConsensusSchema.optional()
})

// ============================================================================
// CONTEXTUAL METADATA SCHEMAS
// ============================================================================

export const HistoricalContextSchema = z.object({
  revelation_period: z.enum(['meccan', 'medinan', 'unknown']).optional(),
  hadith_narration_period: z.string().optional(),
  temporal_alignment: z.boolean().optional(),
  historical_notes: z.string().optional()
})

export const ThematicContextSchema = z.object({
  primary_theme: z.string(),
  secondary_themes: z.array(z.string()).optional(),
  related_concepts: z.array(z.string()).optional()
})

export const LinguisticContextSchema = z.object({
  shared_vocabulary: z.array(z.string()).optional(),
  morphological_links: z.array(z.object({
    term: z.string(),
    form: z.string(),
    root: z.string(),
    meaning: z.string()
  })).optional()
})

export const ContextualMetadataSchema = z.object({
  historical_context: HistoricalContextSchema.optional(),
  thematic_context: ThematicContextSchema.optional(),
  linguistic_context: LinguisticContextSchema.optional()
})

// ============================================================================
// WEIGHT SCHEMAS
// ============================================================================

export const WeightComponentsSchema = z.object({
  textual_explicitness: z.number().min(0).max(1),
  scholarly_consensus: z.number().min(0).max(1),
  source_authenticity: z.number().min(0).max(1),
  temporal_proximity: z.number().min(0).max(1).optional(),
  thematic_centrality: z.number().min(0).max(1).optional()
})

export const WeightsSchema = z.object({
  base_weight: z.number().min(0).max(1),
  components: WeightComponentsSchema,
  adjusted_weight: z.number().min(0).max(1),
  ranking_score: z.number().int().min(0).max(1000),
  last_recalculated: z.string().datetime().optional()
})

// ============================================================================
// GRAPH PROPERTIES SCHEMAS
// ============================================================================

export const CentralityScoresSchema = z.object({
  betweenness: z.number().min(0),
  closeness: z.number().min(0),
  eigenvector: z.number().min(0)
})

export const GraphPropertiesSchema = z.object({
  directionality: z.enum(['unidirectional', 'bidirectional']),
  relationship_label: z.string(),
  inverse_relationship: z.string().optional(),
  path_length: z.number().int().positive(),
  centrality_scores: CentralityScoresSchema.optional()
})

// ============================================================================
// FLAGS SCHEMAS
// ============================================================================

export const FlagsSchema = z.object({
  requires_review: z.boolean().default(false),
  disputed_connection: z.boolean().default(false),
  pending_verification: z.boolean().default(true),
  featured: z.boolean().default(false),
  educational_priority: EducationalPrioritySchema.default('medium')
})

// ============================================================================
// USAGE STATISTICS SCHEMAS
// ============================================================================

export const UsageStatisticsSchema = z.object({
  view_count: z.number().int().nonnegative().default(0),
  citation_count: z.number().int().nonnegative().default(0),
  user_ratings: z.object({
    helpful: z.number().int().nonnegative().default(0),
    not_helpful: z.number().int().nonnegative().default(0)
  }).optional(),
  last_accessed: z.string().datetime().optional()
})

// ============================================================================
// COMPLETE EDGE SCHEMA
// ============================================================================

export const EdgeSchema = z.object({
  // Identification
  id: z.string().min(1),
  version: z.string().default('1.0'),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
  created_by: z.string().optional(),

  // Nodes
  nodes: z.object({
    source: QuranVerseNodeSchema,
    target: HadithNodeSchema
  }),

  // Metadata
  connection_metadata: ConnectionMetadataSchema,
  verification: VerificationSchema,
  contextual_metadata: ContextualMetadataSchema.optional(),
  weights: WeightsSchema,
  graph_properties: GraphPropertiesSchema.optional(),
  flags: FlagsSchema.optional(),
  usage_statistics: UsageStatisticsSchema.optional(),

  // Notes
  notes: z.string().optional()
})

export type Edge = z.infer<typeof EdgeSchema>

// ============================================================================
// API SCHEMAS
// ============================================================================

/**
 * Schema for creating a new edge
 * Requires all essential fields
 */
export const CreateEdgeSchema = EdgeSchema.omit({
  created_at: true,
  updated_at: true,
  usage_statistics: true
}).extend({
  // Allow partial weights (will be calculated)
  weights: WeightsSchema.partial()
})

export type CreateEdgeInput = z.infer<typeof CreateEdgeSchema>

/**
 * Schema for updating an edge
 * All fields optional
 */
export const UpdateEdgeSchema = EdgeSchema.partial().extend({
  id: z.string().min(1) // ID required for updates
})

export type UpdateEdgeInput = z.infer<typeof UpdateEdgeSchema>

/**
 * Schema for edge search/filter parameters
 */
export const EdgeSearchParamsSchema = z.object({
  // Text search
  query: z.string().optional(),

  // Filters
  pillar: PillarSchema.optional(),
  tier: EdgeTierSchema.optional(),
  connection_type: ConnectionTypeSchema.optional(),
  verification_status: VerificationStatusSchema.optional(),
  min_confidence: z.number().min(0).max(1).optional(),
  min_weight: z.number().min(0).max(1).optional(),

  // Source/target filters
  source_surah: z.number().int().min(1).max(114).optional(),
  target_collection: z.string().optional(),

  // Flags
  featured_only: z.boolean().optional(),
  verified_only: z.boolean().optional(),

  // Pagination
  limit: z.number().int().positive().max(100).default(20),
  offset: z.number().int().nonnegative().default(0),

  // Sorting
  sort_by: z.enum(['weight', 'ranking', 'created', 'views']).default('ranking'),
  sort_order: z.enum(['asc', 'desc']).default('desc')
})

export type EdgeSearchParams = z.infer<typeof EdgeSearchParamsSchema>

/**
 * Schema for bulk edge import
 */
export const BulkEdgeImportSchema = z.object({
  edges: z.array(CreateEdgeSchema),
  validate_only: z.boolean().default(false),
  skip_duplicates: z.boolean().default(true)
})

export type BulkEdgeImport = z.infer<typeof BulkEdgeImportSchema>

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Validate edge data with detailed error messages
 */
export function validateEdge(data: unknown): {
  success: true
  data: Edge
} | {
  success: false
  errors: z.ZodError
} {
  const result = EdgeSchema.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data }
  }

  return { success: false, errors: result.error }
}

/**
 * Validate edge creation input
 */
export function validateCreateEdge(data: unknown): {
  success: true
  data: CreateEdgeInput
} | {
  success: false
  errors: z.ZodError
} {
  const result = CreateEdgeSchema.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data }
  }

  return { success: false, errors: result.error }
}

/**
 * Validate search parameters
 */
export function validateSearchParams(params: unknown): {
  success: true
  data: EdgeSearchParams
} | {
  success: false
  errors: z.ZodError
} {
  const result = EdgeSearchParamsSchema.safeParse(params)

  if (result.success) {
    return { success: true, data: result.data }
  }

  return { success: false, errors: result.error }
}

// ============================================================================
// EDGE WEIGHT CALCULATION
// ============================================================================

/**
 * Calculate edge weight based on tier and metadata
 */
export function calculateEdgeWeight(edge: Partial<Edge>): number {
  // Base weight from tier
  const baseWeights: Record<EdgeTier, number> = {
    '1': 0.90, // Explicit
    '2': 0.65, // Strong implicit
    '3': 0.40  // Thematic
  }

  const tier = edge.connection_metadata?.connection_strength.tier || '3'
  let weight = baseWeights[tier]

  // Apply verification multiplier
  const statusMultipliers: Record<VerificationStatus, number> = {
    'manually_verified': 1.0,
    'pending_review': 0.9,
    'ai_suggested': 0.7,
    'disputed': 0.6,
    'rejected': 0.3
  }

  const status = edge.verification?.status || 'pending_review'
  weight *= statusMultipliers[status]

  // Apply consensus multiplier
  const consensusMultipliers: Record<ConsensusLevel, number> = {
    'ijma': 1.0,
    'jumhur': 0.95,
    'mukhtalaf': 0.85,
    'none': 0.9
  }

  const consensus = edge.verification?.scholarly_consensus?.consensus_level || 'none'
  weight *= consensusMultipliers[consensus]

  // Featured boost
  if (edge.flags?.featured) {
    weight *= 1.1
  }

  // Cap at 1.0
  return Math.min(weight, 1.0)
}

/**
 * Calculate ranking score (0-1000)
 */
export function calculateRankingScore(weight: number): number {
  return Math.round(weight * 1000)
}
