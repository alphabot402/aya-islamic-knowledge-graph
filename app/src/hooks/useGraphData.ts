/**
 * useGraphData Hook
 * Handles data fetching and transformation for the graph
 * Extracted from QuranGraph.tsx (lines 329-412)
 *
 * ✅ ENTERPRISE UPGRADES:
 * - Runtime validation with Zod
 * - No 'any' types (100% type safety)
 * - Detailed error messages
 * - Data integrity checks
 */

import { useState, useEffect } from 'react'
import {
  validateData,
  QuranApiResponseSchema,
  HadithApiResponseSchema,
  EdgesApiResponseSchema,
  type ValidatedPosition
} from '@/validation/schemas'

// Type imports
export type Pillar = 'shahada' | 'salah' | 'zakat' | 'sawm' | 'hajj' | 'general'

export interface Hadith {
  id: number
  idInBook: number
  chapterId: number
  bookId: number
  arabic: string
  english: {
    narrator: string
    text: string
  }
}

export interface SurahNode {
  id: string
  type: 'surah'
  surahNumber: number
  name: string
  englishName: string
  verseCount: number
  position: [number, number, number]
  pillar: Pillar
}

export interface HadithNode {
  id: string
  type: 'hadith'
  position: [number, number, number]
  connections: string[]
  pillar: Pillar
  hadith: Hadith
}

export type GraphNode = SurahNode | HadithNode

// ============================================================================
// API RESPONSE TYPES (Properly Typed)
// ============================================================================

/**
 * Quran API response structure
 */
interface QuranSurahData {
  surah: number
  name?: string
  verseCount?: number
  verses?: Array<{
    index: number
    text_uthmani: string
    text_simple: string
  }>
}

interface QuranApiResponse {
  success?: boolean
  surahs: QuranSurahData[]
}

/**
 * Hadith API response structure
 */
interface HadithApiResponse {
  success: boolean
  data: Hadith[]
  error?: string
}

/**
 * Edges API response structure
 */
interface EdgeData {
  id?: string
  verse: {
    surah: number
    ayah: number
    reference: string
  }
  hadith: {
    idInBook: number
    collection?: string
  }
  pillar?: string
}

interface EdgesApiResponse {
  success: boolean
  data: EdgeData[]
  error?: string
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Validate that a number is finite (not NaN, not Infinity)
 */
function ensureFinite(value: number, fallback: number, context: string): number {
  if (!Number.isFinite(value)) {
    console.warn(`${context}: Invalid number ${value}, using fallback ${fallback}`)
    return fallback
  }
  return value
}

/**
 * Validate position coordinates
 */
function validatePosition(
  x: number,
  y: number,
  z: number,
  context: string
): ValidatedPosition {
  return [
    ensureFinite(x, 0, `${context} X`),
    ensureFinite(y, 0, `${context} Y`),
    ensureFinite(z, 0, `${context} Z`)
  ]
}

// Surah pillar classification (from QuranGraph.tsx)
const SURAH_PILLARS: Record<number, Pillar> = {
  1: 'shahada', 2: 'salah', 3: 'shahada', 4: 'zakat', 5: 'zakat', 6: 'shahada',
  7: 'shahada', 8: 'general', 9: 'hajj', 10: 'shahada', 11: 'shahada', 12: 'shahada',
  13: 'shahada', 14: 'shahada', 15: 'general', 16: 'shahada', 17: 'salah', 18: 'shahada',
  19: 'shahada', 20: 'shahada', 21: 'shahada', 22: 'hajj', 23: 'shahada', 24: 'general',
  25: 'shahada', 26: 'shahada', 27: 'shahada', 28: 'shahada', 29: 'shahada', 30: 'shahada',
  31: 'shahada', 32: 'shahada', 33: 'salah', 34: 'shahada', 35: 'shahada', 36: 'shahada',
  37: 'shahada', 38: 'shahada', 39: 'shahada', 40: 'shahada', 41: 'shahada', 42: 'shahada',
  43: 'shahada', 44: 'shahada', 45: 'shahada', 46: 'shahada', 47: 'general', 48: 'general',
  49: 'general', 50: 'shahada', 51: 'shahada', 52: 'shahada', 53: 'shahada', 54: 'shahada',
  55: 'shahada', 56: 'shahada', 57: 'zakat', 58: 'general', 59: 'general', 60: 'general',
  61: 'general', 62: 'salah', 63: 'general', 64: 'shahada', 65: 'general', 66: 'general',
  67: 'shahada', 68: 'shahada', 69: 'shahada', 70: 'shahada', 71: 'shahada', 72: 'shahada',
  73: 'salah', 74: 'shahada', 75: 'shahada', 76: 'general', 77: 'shahada', 78: 'shahada',
  79: 'shahada', 80: 'general', 81: 'shahada', 82: 'shahada', 83: 'general', 84: 'shahada',
  85: 'shahada', 86: 'shahada', 87: 'shahada', 88: 'shahada', 89: 'shahada', 90: 'general',
  91: 'shahada', 92: 'zakat', 93: 'shahada', 94: 'shahada', 95: 'shahada', 96: 'salah',
  97: 'sawm', 98: 'shahada', 99: 'shahada', 100: 'general', 101: 'shahada', 102: 'general',
  103: 'shahada', 104: 'general', 105: 'shahada', 106: 'general', 107: 'salah', 108: 'salah',
  109: 'shahada', 110: 'shahada', 111: 'general', 112: 'shahada', 113: 'shahada', 114: 'shahada'
}

interface UseGraphDataResult {
  nodes: GraphNode[]
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

/**
 * Hook to fetch and manage graph data
 * @param useDatabase - Whether to use database API routes (default: false)
 */
export function useGraphData(useDatabase: boolean = false): UseGraphDataResult {
  const [nodes, setNodes] = useState<GraphNode[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Choose API endpoints based on source
      const apiBase = useDatabase ? '/api/db' : '/api'

      // ========================================================================
      // STEP 1: Fetch Quran data with validation
      // ========================================================================
      const quranResponse = await fetch(`${apiBase}/quran`)
      if (!quranResponse.ok) {
        throw new Error(`Failed to fetch Quran data: ${quranResponse.statusText}`)
      }

      const rawQuranData: unknown = await quranResponse.json()

      // ✅ Validate Quran data with Zod
      const quranValidation = validateData(
        QuranApiResponseSchema,
        rawQuranData,
        'Quran API Response'
      )

      if (!quranValidation.success) {
        console.error('Quran API validation errors:', quranValidation.error.format())
        throw new Error(
          `Invalid Quran API response format: ${quranValidation.error.message}`
        )
      }

      const quranData = quranValidation.data

      // ========================================================================
      // STEP 2: Transform surahs into nodes (with type safety)
      // ========================================================================
      const surahNodes: SurahNode[] = quranData.surahs.map(
        (surahData: QuranSurahData, index: number) => {
          // Validate surah number
          const surahNumber = surahData.surah
          if (surahNumber < 1 || surahNumber > 114) {
            console.warn(`Invalid surah number: ${surahNumber}, skipping`)
            throw new Error(`Invalid surah number: ${surahNumber}`)
          }

          // Generate spiral layout position
          const angle = (index * Math.PI * 2 * 3.5) / 114
          const radius = 22 + (index / 114) * 35
          const height = Math.sin(index * 0.18) * 10

          // Calculate position with validation
          const x = Math.cos(angle) * radius
          const y = height
          const z = Math.sin(angle) * radius
          const position = validatePosition(x, y, z, `Surah ${surahNumber}`)

          // Get verse count with fallback
          const verseCount = surahData.verses?.length || surahData.verseCount || 0
          if (verseCount < 1 || verseCount > 286) {
            console.warn(`Unusual verse count for surah ${surahNumber}: ${verseCount}`)
          }

          return {
            id: `surah-${surahNumber}`,
            type: 'surah' as const,
            surahNumber,
            name: surahData.name || `Surah ${surahNumber}`,
            englishName: `Surah ${surahNumber}`,
            verseCount,
            position,
            pillar: SURAH_PILLARS[surahNumber] || 'general'
          }
        }
      )

      // ========================================================================
      // STEP 3: Fetch edges with validation
      // ========================================================================
      const edgesResponse = await fetch(`${apiBase}/edges`)
      if (!edgesResponse.ok) {
        throw new Error(`Failed to fetch edges: ${edgesResponse.statusText}`)
      }

      const rawEdgesData: unknown = await edgesResponse.json()

      // ✅ Validate Edges data with Zod
      const edgesValidation = validateData(
        EdgesApiResponseSchema,
        rawEdgesData,
        'Edges API Response'
      )

      if (!edgesValidation.success) {
        console.error('Edges API validation errors:', edgesValidation.error.format())
        throw new Error(
          `Invalid Edges API response format: ${edgesValidation.error.message}`
        )
      }

      const edgesData = edgesValidation.data

      let hadithNodes: HadithNode[] = []

      // ========================================================================
      // STEP 4: Fetch and process hadiths if we have edges
      // ========================================================================
      if (edgesData.success && edgesData.data.length > 0) {
        // Get unique hadith IDs from edges (with proper typing)
        const connectedHadithIds = new Set(
          edgesData.data.map((edge: EdgeData) => edge.hadith.idInBook)
        )

        // Smart loading: only fetch hadiths we need
        let hadithUrl = `${apiBase}/hadith`
        if (useDatabase) {
          // Use database filtering
          hadithUrl += `?ids=${Array.from(connectedHadithIds).join(',')}`
        }

        const hadithResponse = await fetch(hadithUrl)
        if (!hadithResponse.ok) {
          throw new Error(`Failed to fetch hadiths: ${hadithResponse.statusText}`)
        }

        const rawHadithData: unknown = await hadithResponse.json()

        // ✅ Validate Hadith data with Zod
        const hadithValidation = validateData(
          HadithApiResponseSchema,
          rawHadithData,
          'Hadith API Response'
        )

        if (!hadithValidation.success) {
          console.error('Hadith API validation errors:', hadithValidation.error.format())
          throw new Error(
            `Invalid Hadith API response format: ${hadithValidation.error.message}`
          )
        }

        const hadithData = hadithValidation.data

        if (hadithData.success) {
          // Filter hadiths if using JSON API (database already filtered)
          const connectedHadiths = useDatabase
            ? hadithData.data
            : hadithData.data.filter((h: Hadith) => connectedHadithIds.has(h.idInBook))

          // ✅ Create hadith nodes with validated positions
          hadithNodes = connectedHadiths.map((h: Hadith, index: number) => {
            const angle = (index / connectedHadiths.length) * Math.PI * 2
            const radius = 70 // Outer ring

            // Calculate position with validation
            const x = Math.cos(angle) * radius
            const y = Math.sin(index * 0.5) * 3
            const z = Math.sin(angle) * radius
            const position = validatePosition(x, y, z, `Hadith ${h.idInBook}`)

            return {
              id: `hadith-${h.idInBook}`,
              type: 'hadith' as const,
              position,
              connections: [],
              pillar: 'general' as Pillar,
              hadith: h
            }
          })

          // ✅ Build connections (with proper typing)
          edgesData.data.forEach((edge: EdgeData) => {
            const verseId = `surah-${edge.verse.surah}`
            const hadithId = `hadith-${edge.hadith.idInBook}`

            const hadithNode = hadithNodes.find(n => n.id === hadithId)

            if (hadithNode && !hadithNode.connections.includes(verseId)) {
              hadithNode.connections.push(verseId)
            }
          })

          console.log(`Loaded ${hadithNodes.length} hadiths with ${edgesData.data.length} connections`)
        }
      }

      // Combine all nodes
      setNodes([...surahNodes, ...hadithNodes])

    } catch (err) {
      console.error('Failed to load graph data:', err)
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [useDatabase])

  return {
    nodes,
    isLoading,
    error,
    refetch: fetchData
  }
}
