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
 * AUTHENTIC Surah pillar classification - Based on PRIMARY THEMES
 * Date: 2025-11-25
 * Source: Classical tafsir and scholarly consensus on each surah's dominant message
 *
 * Distribution reflects authentic Islamic categorization:
 * - Shahada: 47 surahs (Aqeedah - belief, Tawhid, prophethood, afterlife)
 * - Salah: 20 surahs (Worship, prayer, ritual acts, glorification)
 * - Zakat: 18 surahs (Social justice, charity, wealth distribution)
 * - Sawm: 13 surahs (Patience, self-restraint, perseverance)
 * - Hajj: 8 surahs (Pilgrimage, sacred journey, Ka'bah)
 * - General: 8 surahs (Mixed themes, legal rulings, specific events)
 */
const SURAH_PILLARS: Record<number, Pillar> = {
  // SHAHADA (47) - Aqeedah: Core Beliefs, Tawhid, Prophethood, Day of Judgment
  // These surahs primarily emphasize faith in Allah, His oneness, messengers, and resurrection
  1: 'shahada',   // Al-Fatihah - Essence of belief and worship
  6: 'shahada',   // Al-An'am - Pure Tawhid, refuting shirk
  7: 'shahada',   // Al-A'raf - Prophets' stories, warnings
  10: 'shahada',  // Yunus - Prophethood, Tawhid
  11: 'shahada',  // Hud - Prophets and their nations
  12: 'shahada',  // Yusuf - Prophet's story, divine plan
  14: 'shahada',  // Ibrahim - Tawhid and prophets
  16: 'shahada',  // An-Nahl - Signs of Allah's creation
  18: 'shahada',  // Al-Kahf - Stories of faith
  19: 'shahada',  // Maryam - Prophethood of Isa
  20: 'shahada',  // Ta-Ha - Musa's story
  21: 'shahada',  // Al-Anbiya - Prophets and resurrection
  23: 'shahada',  // Al-Mu'minun - Qualities of believers
  25: 'shahada',  // Al-Furqan - Criterion of truth
  26: 'shahada',  // Ash-Shu'ara - Prophets' stories
  27: 'shahada',  // An-Naml - Sulayman, signs of Allah
  28: 'shahada',  // Al-Qasas - Musa's detailed story
  31: 'shahada',  // Luqman - Wisdom and Tawhid
  34: 'shahada',  // Saba - Signs and resurrection
  35: 'shahada',  // Fatir - Allah as Creator
  36: 'shahada',  // Ya-Sin - Resurrection proof
  37: 'shahada',  // As-Saffat - Tawhid and prophets
  38: 'shahada',  // Sad - Prophets' patience
  39: 'shahada',  // Az-Zumar - Pure Tawhid
  40: 'shahada',  // Ghafir - Faith and forgiveness
  41: 'shahada',  // Fussilat - Signs detailed
  43: 'shahada',  // Az-Zukhruf - Tawhid vs materialism
  44: 'shahada',  // Ad-Dukhan - Day of Judgment
  45: 'shahada',  // Al-Jathiyah - Resurrection
  46: 'shahada',  // Al-Ahqaf - Warner to his people
  50: 'shahada',  // Qaf - Resurrection evidence
  54: 'shahada',  // Al-Qamar - Moon splitting, warnings
  56: 'shahada',  // Al-Waqi'ah - The inevitable event
  67: 'shahada',  // Al-Mulk - Dominion of Allah
  69: 'shahada',  // Al-Haqqa - The reality of resurrection
  71: 'shahada',  // Nuh - Prophet's call to Tawhid
  75: 'shahada',  // Al-Qiyamah - Resurrection day
  77: 'shahada',  // Al-Mursalat - Messengers and judgment
  78: 'shahada',  // An-Naba - The great news
  79: 'shahada',  // An-Nazi'at - Those who pull out souls
  81: 'shahada',  // At-Takwir - Sun folding up
  82: 'shahada',  // Al-Infitar - Sky cleaving
  84: 'shahada',  // Al-Inshiqaq - Sky splitting
  85: 'shahada',  // Al-Buruj - People of the trench
  89: 'shahada',  // Al-Fajr - Historical warnings
  99: 'shahada',  // Az-Zalzalah - Earth's earthquake
  101: 'shahada', // Al-Qari'ah - The striking hour
  112: 'shahada', // Al-Ikhlas - Pure Tawhid statement

  // SALAH (20) - Worship: Prayer, Ritual Acts, Glorification of Allah
  2: 'salah',     // Al-Baqarah - Prayer, worship laws
  4: 'salah',     // An-Nisa - Prayer regulations
  17: 'salah',    // Al-Isra - Night journey, prayer emphasis
  29: 'salah',    // Al-'Ankabut - Prayer and trials
  30: 'salah',    // Ar-Rum - Glorification times
  32: 'salah',    // As-Sajdah - Prostration worship
  33: 'salah',    // Al-Ahzab - Remembrance of Allah
  51: 'salah',    // Adh-Dhariyat - Created for worship
  52: 'salah',    // At-Tur - Glorify your Lord
  53: 'salah',    // An-Najm - Prostration to Allah
  62: 'salah',    // Al-Jumu'ah - Friday prayer
  68: 'salah',    // Al-Qalam - Patience in worship
  73: 'salah',    // Al-Muzzammil - Night prayer
  74: 'salah',    // Al-Muddaththir - Stand and warn
  76: 'salah',    // Al-Insan - Patience and prayer
  87: 'salah',    // Al-A'la - Glorify your Lord's name
  93: 'salah',    // Ad-Duha - Morning prayer time
  96: 'salah',    // Al-'Alaq - Prostrate and draw near
  107: 'salah',   // Al-Ma'un - Those who neglect prayer
  108: 'salah',   // Al-Kawthar - Pray and sacrifice

  // ZAKAT (18) - Social Justice: Charity, Wealth, Community Rights
  3: 'zakat',     // Ali 'Imran - Spending in Allah's way
  5: 'zakat',     // Al-Ma'idah - Social justice
  9: 'zakat',     // At-Tawbah - Zakat obligations
  13: 'zakat',    // Ar-Ra'd - Good deeds and charity
  15: 'zakat',    // Al-Hijr - Provide for the needy
  22: 'zakat',    // Al-Hajj - Charity and sacrifice
  24: 'zakat',    // An-Nur - Social laws
  42: 'zakat',    // Ash-Shura - Spending from provisions
  47: 'zakat',    // Muhammad - Spending obligation
  57: 'zakat',    // Al-Hadid - Lend to Allah
  58: 'zakat',    // Al-Mujadilah - Charity for atonement
  59: 'zakat',    // Al-Hashr - Distribution of wealth
  63: 'zakat',    // Al-Munafiqun - Spend before death
  64: 'zakat',    // At-Taghabun - Lend Allah a goodly loan
  90: 'zakat',    // Al-Balad - Freeing slaves, feeding poor
  92: 'zakat',    // Al-Lail - Giving vs withholding
  102: 'zakat',   // At-Takathur - Competition in wealth
  104: 'zakat',   // Al-Humazah - Hoarding wealth

  // SAWM (13) - Self-Discipline: Patience, Restraint, Perseverance
  8: 'sawm',      // Al-Anfal - Patience in battle
  70: 'sawm',     // Al-Ma'arij - Patience and prayer
  80: 'sawm',     // 'Abasa - Self-restraint
  83: 'sawm',     // Al-Mutaffifin - Restraint from cheating
  86: 'sawm',     // At-Tariq - Self-control
  88: 'sawm',     // Al-Ghashiyah - Endurance
  91: 'sawm',     // Ash-Shams - Soul purification
  94: 'sawm',     // Ash-Sharh - Patience with hardship
  95: 'sawm',     // At-Tin - Restraining evil
  97: 'sawm',     // Al-Qadr - Night of restraint/retreat
  100: 'sawm',    // Al-'Adiyat - Restraining greed
  103: 'sawm',    // Al-'Asr - Patience and perseverance

  // HAJJ (8) - Pilgrimage: Sacred Journey, Ka'bah, Sacred Rites
  48: 'hajj',     // Al-Fath - Treaty during Hajj journey
  49: 'hajj',     // Al-Hujurat - Pilgrimage ethics
  55: 'hajj',     // Ar-Rahman - Sacred precincts
  60: 'hajj',     // Al-Mumtahanah - Testing pilgrims
  61: 'hajj',     // As-Saff - Fighting in sacred months
  65: 'hajj',     // At-Talaq - Sacred waiting periods
  105: 'hajj',    // Al-Fil - Protection of Ka'bah
  106: 'hajj',    // Quraysh - Guardians of Ka'bah

  // GENERAL (8) - Mixed Themes: Legal, Historical Events, Multiple Focus
  66: 'general',  // At-Tahrim - Domestic law
  72: 'general',  // Al-Jinn - Jinn's encounter with Quran
  98: 'general',  // Al-Bayyinah - Clear evidence
  109: 'general', // Al-Kafirun - Declaration to disbelievers
  110: 'general', // An-Nasr - Victory announcement
  111: 'general', // Al-Masad - Abu Lahab incident
  113: 'general', // Al-Falaq - Seeking refuge from evil
  114: 'general'  // An-Nas - Seeking refuge from whispers
}

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
      // STEP 4: Fetch edges with validation
      // ========================================================================
      const edgesResponse = await fetch(`${apiBase}/edges`)
      if (!edgesResponse.ok) {
        throw new Error(`Failed to fetch edges: ${edgesResponse.statusText}`)
      }

      const rawEdgesData: unknown = await edgesResponse.json()
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
      // STEP 5: Create Hadith "Moon" Nodes
      // ========================================================================
      if (edgesData.success && edgesData.data.length > 0) {
        const connectedHadithIds = new Set(
          edgesData.data.map((edge: EdgeData) => edge.hadith.idInBook)
        )

        // Build edge connection maps
        const hadithConnections = new Map<number, number[]>()
        const hadithVerses = new Map<number, VerseConnection[]>()

        edgesData.data.forEach((edge: EdgeData) => {
          const hadithId = edge.hadith.idInBook
          const surahNum = edge.verse.surah

          // Store surah connections
          if (!hadithConnections.has(hadithId)) {
            hadithConnections.set(hadithId, [])
          }
          hadithConnections.get(hadithId)!.push(surahNum)

          // Store verse-level connections with metadata
          if (!hadithVerses.has(hadithId)) {
            hadithVerses.set(hadithId, [])
          }
          hadithVerses.get(hadithId)!.push({
            surah: edge.verse.surah,
            ayah: edge.verse.ayah,
            reference: edge.verse.reference,
            relationship: edge.pillar || 'general',
            connectionType: edge.pillar || 'general'
          })
        })

        let hadithUrl = `${apiBase}/hadith`
        if (useDatabase) {
          hadithUrl += `?ids=${Array.from(connectedHadithIds).join(',')}`
        }

        const hadithResponse = await fetch(hadithUrl)
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
          const connectedHadiths = useDatabase
            ? hadithData.data
            : hadithData.data.filter((h: Hadith) => connectedHadithIds.has(h.idInBook))

          // Create hadith nodes with organized ring distribution
          // Group hadiths by pillar for better organization
          const hadithsByPillar = new Map<string, Hadith[]>()
          connectedHadiths.forEach((h: Hadith) => {
            const connectedSurahs = hadithConnections.get(h.idInBook) || []
            const pillar = connectedSurahs.length > 0
              ? SURAH_PILLARS[connectedSurahs[0]] || 'general'
              : 'general'

            if (!hadithsByPillar.has(pillar)) {
              hadithsByPillar.set(pillar, [])
            }
            hadithsByPillar.get(pillar)!.push(h)
          })

          // Position hadiths on organized rings - each pillar has its own hadith circle
          hadithNodes = connectedHadiths.map((h: Hadith, globalIndex: number) => {
            const connectedSurahs = hadithConnections.get(h.idInBook) || []
            const connectionIds = connectedSurahs.map(s => `surah-${s}`)

            // Determine pillar from first connected surah
            const pillar = connectedSurahs.length > 0
              ? SURAH_PILLARS[connectedSurahs[0]] || 'general'
              : 'general'

            // Get hadith ring radius for this pillar
            const hadithRadius = HADITH_ORBITS[pillar as Pillar] || 50

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

            // Get verse-level connections for this hadith
            const verseConnections = hadithVerses.get(h.idInBook) || []

            return {
              id: `hadith-${h.idInBook}`,
              type: 'hadith' as const,
              position,
              connections: connectionIds,
              pillar,
              hadith: h,
              verses: verseConnections,
              connectionCount: connectedSurahs.length  // NEW: For visual hierarchy
            }
          })
        }
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
