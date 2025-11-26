/**
 * useGraphData Hook - ORBITAL LAYOUT VERSION
 * Implements "Celestial Orrery" / "Islamic Astrolabe" positioning
 *
 * Key Changes from Original:
 * 1. Surahs positioned in concentric orbits based on pillar
 * 2. Hadiths orbit as "moons" around their connected surahs
 * 3. Shahada surahs form vertical column at center
 * 4. General surahs on elevated separate plane
 */

import { useState, useEffect } from 'react'
import {
  validateData,
  QuranApiResponseSchema,
  HadithApiResponseSchema,
  EdgesApiResponseSchema,
  type ValidatedPosition
} from '@/validation/schemas'
import {
  calculateSurahPosition,
  calculateHadithMoonPosition,
  calculateMultiConnectionHadithPosition,
  groupSurahsByPillar,
  HADITH_ORBITS
} from '@/lib/orbital-layout'
import {
  getSurahsByPillar,
  getHadithsByPillar,
  type PillarType
} from '@/data/five-pillars-references'

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

export interface VerseConnection {
  surah: number
  ayah: number
  reference: string
  relationship: string
  connectionType: string
}

export interface HadithNode {
  id: string
  type: 'hadith'
  position: [number, number, number]
  connections: string[]
  pillar: Pillar
  hadith: Hadith
  verses: VerseConnection[]  // Specific verse connections
  connectionCount: number  // NEW: For visual scaling
}

export type GraphNode = SurahNode | HadithNode

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

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

interface HadithApiResponse {
  success: boolean
  data: Hadith[]
  error?: string
}

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

function ensureFinite(value: number, fallback: number, context: string): number {
  if (!Number.isFinite(value)) {
    console.warn(`${context}: Invalid number ${value}, using fallback ${fallback}`)
    return fallback
  }
  return value
}

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

/**
 * AUTHENTICATED SURAH PILLAR MAPPING
 * Generated from 100 authenticated references (Quran + Hadith)
 * Source: five-pillars-references.ts
 *
 * This mapping is based on explicit Quranic references to each pillar,
 * not subjective thematic categorization. Surahs are mapped only when
 * they contain direct references to a specific pillar.
 *
 * All unmapped surahs default to 'general' and are filtered from display.
 */
function buildAuthenticatedSurahMapping(): Record<number, Pillar> {
  const mapping: Record<number, Pillar> = {}

  // Build mapping from authenticated references
  const pillars: PillarType[] = ['shahada', 'salah', 'zakat', 'sawm', 'hajj']

  pillars.forEach(pillar => {
    const surahs = getSurahsByPillar(pillar)
    surahs.forEach(surahNum => {
      mapping[surahNum] = pillar
    })
  })

  // All remaining surahs default to 'general' (will be filtered out)
  for (let i = 1; i <= 114; i++) {
    if (!mapping[i]) {
      mapping[i] = 'general'
    }
  }

  return mapping
}

const SURAH_PILLARS: Record<number, Pillar> = buildAuthenticatedSurahMapping()

interface UseGraphDataResult {
  nodes: GraphNode[]
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

export function useGraphData(useDatabase: boolean = false): UseGraphDataResult {
  const [nodes, setNodes] = useState<GraphNode[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const apiBase = useDatabase ? '/api/db' : '/api'

      // ========================================================================
      // STEP 1: Fetch Quran data with validation
      // ========================================================================
      const quranResponse = await fetch(`${apiBase}/quran`)
      if (!quranResponse.ok) {
        throw new Error(`Failed to fetch Quran data: ${quranResponse.statusText}`)
      }

      const rawQuranData: unknown = await quranResponse.json()
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
      // STEP 2: ORBITAL LAYOUT - Group surahs by pillar
      // ========================================================================
      const surahNumbers = quranData.surahs.map((s: QuranSurahData) => s.surah)
      const surahsByPillar = groupSurahsByPillar(surahNumbers, SURAH_PILLARS)

      // Create position lookup for orbital distribution
      const surahPositions = new Map<number, [number, number, number]>()

      // Calculate orbital positions for each pillar group
      Object.entries(surahsByPillar).forEach(([pillar, surahs]) => {
        surahs.forEach((surahNum, indexInPillar) => {
          const position = calculateSurahPosition(
            pillar as Pillar,
            indexInPillar,
            surahs.length
          )
          surahPositions.set(surahNum, position)
        })
      })

      // ========================================================================
      // STEP 3: Create Surah Nodes with Orbital Positions
      // ========================================================================
      const surahNodes: SurahNode[] = quranData.surahs.map(
        (surahData: QuranSurahData) => {
          const surahNumber = surahData.surah

          if (surahNumber < 1 || surahNumber > 114) {
            console.warn(`Invalid surah number: ${surahNumber}, skipping`)
            throw new Error(`Invalid surah number: ${surahNumber}`)
          }

          // Get pre-calculated orbital position
          const rawPosition = surahPositions.get(surahNumber) || [0, 0, 0]
          const position = validatePosition(
            rawPosition[0],
            rawPosition[1],
            rawPosition[2],
            `Surah ${surahNumber}`
          )

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
      // STEP 4: Load Authenticated Hadith References
      // ========================================================================
      let hadithNodes: HadithNode[] = []

      // Build set of authenticated hadith IDs from FIVE_PILLARS_REFERENCES
      const authenticatedHadiths = new Map<number, { pillar: Pillar; refId: string }>()
      const pillars: PillarType[] = ['shahada', 'salah', 'zakat', 'sawm', 'hajj']

      pillars.forEach(pillar => {
        const hadithRefs = getHadithsByPillar(pillar)
        hadithRefs.forEach(ref => {
          const idInBook = parseInt(ref.number)
          authenticatedHadiths.set(idInBook, { pillar, refId: ref.refId })
        })
      })

      // Load hadiths from API
      const hadithResponse = await fetch(`${apiBase}/hadith`)
      if (!hadithResponse.ok) {
        throw new Error(`Failed to fetch hadiths: ${hadithResponse.statusText}`)
      }

      const rawHadithData: unknown = await hadithResponse.json()
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
        // Filter to only authenticated hadiths
        const authenticatedHadithList = hadithData.data.filter((h: Hadith) =>
          authenticatedHadiths.has(h.idInBook)
        )

        // Group hadiths by pillar based on authenticated references
        const hadithsByPillar = new Map<string, Hadith[]>()
        authenticatedHadithList.forEach((h: Hadith) => {
          const auth = authenticatedHadiths.get(h.idInBook)
          if (auth) {
            const pillar = auth.pillar
            if (!hadithsByPillar.has(pillar)) {
              hadithsByPillar.set(pillar, [])
            }
            hadithsByPillar.get(pillar)!.push(h)
          }
        })

        // Create hadith nodes positioned on their pillar rings
        hadithNodes = authenticatedHadithList.map((h: Hadith) => {
          const auth = authenticatedHadiths.get(h.idInBook)!
          const pillar = auth.pillar

          // Get hadith ring radius for this pillar
          const hadithRadius = HADITH_ORBITS[pillar] || 50

          // Get all hadiths in this pillar for even distribution
          const hadithsInThisPillar = hadithsByPillar.get(pillar) || []
          const indexInPillar = hadithsInThisPillar.findIndex(hh => hh.idInBook === h.idInBook)

          // Distribute evenly around the hadith ring
          const angle = (indexInPillar / hadithsInThisPillar.length) * Math.PI * 2
          const x = Math.cos(angle) * hadithRadius
          const z = Math.sin(angle) * hadithRadius
          const y = 0 // Flat circular row

          const rawPosition: [number, number, number] = [x, y, z]

          const position = validatePosition(
            rawPosition[0],
            rawPosition[1],
            rawPosition[2],
            `Hadith ${h.idInBook}`
          )

          // Get connected surahs from the same pillar
          const surahsInPillar = surahsByPillar[pillar] || []
          const connectionIds = surahsInPillar.map(s => `surah-${s}`)

          return {
            id: `hadith-${auth.refId}`,
            type: 'hadith' as const,
            position,
            connections: connectionIds,
            pillar,
            hadith: h,
            verses: [],  // Can be populated later from edges if needed
            connectionCount: surahsInPillar.length
          }
        })
      }

      // ========================================================================
      // STEP 6: Combine and return
      // ========================================================================
      const allNodes: GraphNode[] = [...surahNodes, ...hadithNodes]
      setNodes(allNodes)

    } catch (err) {
      console.error('Error fetching graph data:', err)
      setError(err instanceof Error ? err : new Error('Unknown error occurred'))
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
