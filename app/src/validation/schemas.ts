/**
 * Zod Validation Schemas
 * Runtime validation for all external data sources
 *
 * CRITICAL: All data from APIs, JSON files, and user input MUST be validated
 * before being used in the application to prevent runtime errors.
 */

import { z } from 'zod'

// ============================================================================
// DOMAIN VALUE OBJECTS
// ============================================================================

/**
 * Pillar of Islam enum
 * Validated to ensure only valid pillar values are accepted
 */
export const PillarSchema = z.enum([
  'shahada',
  'salah',
  'zakat',
  'sawm',
  'hajj',
  'general'
])

export type ValidatedPillar = z.infer<typeof PillarSchema>

/**
 * 3D Position tuple [x, y, z]
 * Validated to ensure all coordinates are finite numbers (no NaN, no Infinity)
 */
export const PositionSchema = z.tuple([
  z.number().finite('X coordinate must be a finite number'),
  z.number().finite('Y coordinate must be a finite number'),
  z.number().finite('Z coordinate must be a finite number')
])

export type ValidatedPosition = z.infer<typeof PositionSchema>

/**
 * Verse reference in format "surah:ayah" (e.g., "2:255")
 */
export const VerseReferenceStringSchema = z.string().regex(
  /^\d+:\d+$/,
  'Verse reference must be in format "surah:ayah"'
)

// ============================================================================
// QURAN DATA SCHEMAS
// ============================================================================

/**
 * Quran Word schema
 */
export const QuranWordSchema = z.object({
  surface_form: z.string(),
  lemma: z.string().optional(),
  root: z.string().optional(),
  pos_tag: z.string().optional()
})

/**
 * Quran Verse schema with strict validation
 */
export const QuranVerseSchema = z.object({
  index: z.number().int().positive('Verse index must be positive'),
  text_uthmani: z.string().min(1, 'Arabic text cannot be empty'),
  text_simple: z.string().min(1, 'Simple text cannot be empty'),
  words: z.array(QuranWordSchema).optional(),
  structural_tags: z.object({
    pillar_tags: z.array(z.string()).optional(),
    topic_tags: z.array(z.string()).optional()
  }).optional(),
  cross_refs: z.array(z.string()).optional()
})

/**
 * Quran Surah schema with data integrity checks
 */
export const QuranSurahSchema = z.object({
  surah_number: z.number().int().min(1).max(114, 'Surah number must be between 1-114'),
  revelation_order: z.number().int().min(0),
  juz_list: z.array(z.number().int().min(1).max(30)),
  verses: z.array(QuranVerseSchema)
})

/**
 * Verse Reference object
 */
export const VerseReferenceSchema = z.object({
  surah: z.number().int().min(1).max(114),
  ayah: z.number().int().positive(),
  reference: VerseReferenceStringSchema
})

// ============================================================================
// HADITH DATA SCHEMAS
// ============================================================================

/**
 * Hadith Grade enum
 */
export const HadithGradeSchema = z.enum(['Sahih', 'Hasan', 'Daif'])

/**
 * Hadith schema - matches types/hadith.ts
 */
export const HadithSchema = z.object({
  id: z.string(), // Fixed: Should be string, not number
  collection: z.string().min(1),
  hadith_number: z.number().int().positive(),
  book_number: z.number().int().positive(),
  book_title_ar: z.string(),
  book_title_en: z.string(),
  chapter_title_ar: z.string().optional(),
  chapter_title_en: z.string().optional(),
  isnad_raw_ar: z.string().optional(),
  matn_ar: z.string().min(1, 'Arabic text (matn) cannot be empty'),
  matn_en: z.string().min(1, 'English text cannot be empty'),
  grade: HadithGradeSchema,
  grade_source: z.string().optional(),
  pillar_tags: z.array(z.string()).optional(),
  topic_tags: z.array(z.string()).optional()
})

/**
 * Hadith Reference object
 */
export const HadithReferenceSchema = z.object({
  collection: z.string(),
  hadith_number: z.number().int().positive(),
  book_english: z.string(),
  book_arabic: z.string()
})

/**
 * Simplified Hadith schema for useGraphData hook
 * DEPRECATED: Should migrate to full HadithSchema
 */
export const SimpleHadithSchema = z.object({
  id: z.number().int().positive(),
  idInBook: z.number().int().positive(),
  chapterId: z.number().int().positive(),
  bookId: z.number().int().positive(),
  arabic: z.string().min(1),
  english: z.object({
    narrator: z.string(),
    text: z.string() // Allow empty strings - some hadiths may have missing translations
  })
})

// ============================================================================
// GRAPH NODE SCHEMAS
// ============================================================================

/**
 * Surah Node schema with strict validation
 */
export const SurahNodeSchema = z.object({
  id: z.string().regex(/^surah-\d+$/, 'Surah ID must match format "surah-{number}"'),
  type: z.literal('surah'),
  surahNumber: z.number().int().min(1).max(114, 'Surah number must be 1-114'),
  name: z.string().min(1, 'Surah name cannot be empty'),
  englishName: z.string().min(1, 'English name cannot be empty'),
  verseCount: z.number().int().min(1).max(286, 'Verse count must be 1-286'),
  position: PositionSchema,
  pillar: PillarSchema
})

/**
 * Hadith Node schema with strict validation
 */
export const HadithNodeSchema = z.object({
  id: z.string().regex(/^hadith-\d+$/, 'Hadith ID must match format "hadith-{number}"'),
  type: z.literal('hadith'),
  position: PositionSchema,
  connections: z.array(z.string()),
  pillar: PillarSchema,
  hadith: SimpleHadithSchema
})

/**
 * Discriminated union for graph nodes
 * Properly typed for type narrowing with node.type
 */
export const GraphNodeSchema = z.discriminatedUnion('type', [
  SurahNodeSchema,
  HadithNodeSchema
])

export type ValidatedGraphNode = z.infer<typeof GraphNodeSchema>
export type ValidatedSurahNode = z.infer<typeof SurahNodeSchema>
export type ValidatedHadithNode = z.infer<typeof HadithNodeSchema>

// ============================================================================
// API RESPONSE SCHEMAS
// ============================================================================

/**
 * Quran API Response schema
 * Validates the response from /api/quran endpoint
 */
export const QuranApiResponseSchema = z.object({
  success: z.boolean().optional(),
  surahs: z.array(
    z.object({
      surah: z.number().int().min(1).max(114),
      name: z.string().optional(),
      verseCount: z.number().int().min(1).optional(),
      verses: z.array(QuranVerseSchema).optional()
    })
  )
})

/**
 * Hadith API Response schema
 * Validates the response from /api/hadith endpoint
 */
export const HadithApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(SimpleHadithSchema),
  error: z.string().optional()
})

/**
 * Edges API Response schema
 * Validates the response from /api/edges endpoint
 */
export const EdgesApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(
    z.object({
      id: z.string().optional(),
      verse: z.object({
        surah: z.number().int().min(1).max(114),
        ayah: z.number().int().positive(),
        reference: z.string()
      }),
      hadith: z.object({
        idInBook: z.number().int().positive(),
        collection: z.string().optional()
      }),
      pillar: z.string().optional()
    })
  ),
  error: z.string().optional()
})

// ============================================================================
// VALIDATION HELPER FUNCTIONS
// ============================================================================

/**
 * Validation result type
 */
export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; error: z.ZodError; rawData: unknown }

/**
 * Safe validation with detailed error reporting
 */
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  context?: string
): ValidationResult<T> {
  const result = schema.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data }
  }

  // Log validation errors for debugging
  console.error(`Validation failed${context ? ` for ${context}` : ''}:`, {
    errors: result.error.format(),
    receivedData: data
  })

  return {
    success: false,
    error: result.error,
    rawData: data
  }
}

/**
 * Validate array of items, filtering out invalid entries
 * Returns valid items + error report
 */
export function validateArray<T>(
  schema: z.ZodSchema<T>,
  items: unknown[],
  context?: string
): {
  valid: T[]
  invalid: Array<{ index: number; error: z.ZodError; data: unknown }>
} {
  const valid: T[] = []
  const invalid: Array<{ index: number; error: z.ZodError; data: unknown }> = []

  items.forEach((item, index) => {
    const result = schema.safeParse(item)
    if (result.success) {
      valid.push(result.data)
    } else {
      invalid.push({ index, error: result.error, data: item })
      console.warn(
        `Invalid item at index ${index}${context ? ` in ${context}` : ''}:`,
        result.error.format()
      )
    }
  })

  return { valid, invalid }
}

/**
 * Assert that data matches schema (throws on failure)
 * Use this when validation failure should stop execution
 */
export function assertValidData<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  context?: string
): T {
  const result = schema.safeParse(data)

  if (result.success) {
    return result.data
  }

  const errorMessage = `Data validation failed${context ? ` for ${context}` : ''}`
  console.error(errorMessage, result.error.format())
  throw new Error(`${errorMessage}: ${result.error.message}`)
}
