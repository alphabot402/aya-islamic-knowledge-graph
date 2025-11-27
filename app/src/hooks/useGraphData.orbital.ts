/**
 * useGraphData Hook - INTEGRATED WITH 100 AUTHENTICATED REFERENCES
 * Loads the Master Five Pillars Database and positions nodes in orbital layout
 */

import { useState, useEffect } from 'react'
import {
  getAllReferences,
  getReferencesByPillar,
  getApiLink,
  type PillarReference,
  type PillarType
} from '@/data/five-pillars-database'

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type Pillar = 'shahada' | 'salah' | 'zakat' | 'sawm' | 'hajj' | 'general'

export interface NodeData {
  id: string
  type: 'primary' | 'secondary'
  position: [number, number, number]
  pillar: Pillar
  label: string

  // Reference data
  refId: string
  source: string
  citation: string
  function: string
  coreText: string
  tags: string[]
  apiLink: string
}

export type GraphNode = NodeData

// ============================================================================
// ORBITAL LAYOUT CONFIGURATION
// ============================================================================

// Base ring radii (desktop size)
const BASE_PILLAR_RINGS: Record<Pillar, number> = {
  shahada: 32,
  salah: 48,
  zakat: 64,
  sawm: 80,
  hajj: 96,
  general: 0  // Not used
}

/**
 * Get responsive scale factor based on viewport width
 * UPDATED: Increased mobile scale from 0.60 to 0.80 for larger graph
 */
function getResponsiveScale(): number {
  if (typeof window === 'undefined') return 1.0 // SSR fallback

  const width = window.innerWidth
  if (width < 768) return 0.80  // Mobile: 20% reduction (was 40%, now optimized with compact header)
  if (width < 1024) return 0.85 // Tablet: 15% reduction (improved from 20%)
  return 1.0                     // Desktop: no reduction
}

/**
 * Get scaled ring radii based on viewport
 */
function getScaledRings(): Record<Pillar, number> {
  const scale = getResponsiveScale()
  return {
    shahada: BASE_PILLAR_RINGS.shahada * scale,
    salah: BASE_PILLAR_RINGS.salah * scale,
    zakat: BASE_PILLAR_RINGS.zakat * scale,
    sawm: BASE_PILLAR_RINGS.sawm * scale,
    hajj: BASE_PILLAR_RINGS.hajj * scale,
    general: 0
  }
}

/**
 * Calculate orbital position for a node on its pillar's ring
 * NEW LAYOUT: ALL nodes (Quran + Hadith) on rings, interspersed
 * RESPONSIVE: Scales based on viewport size
 */
function calculateOrbitalPosition(
  pillar: Pillar,
  index: number,
  totalInRing: number
): [number, number, number] {
  // Get scaled rings for current viewport
  const scaledRings = getScaledRings()
  const radius = scaledRings[pillar]
  const angle = (index / totalInRing) * Math.PI * 2
  const x = Math.cos(angle) * radius
  const z = Math.sin(angle) * radius
  const y = 0  // Keep all nodes on horizontal plane

  return [x, y, z]
}

// ============================================================================
// HOOK
// ============================================================================

interface UseGraphDataResult {
  nodes: GraphNode[]
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

/**
 * Main data loading hook - Loads 100 authenticated references
 */
export function useGraphData(useDatabase: boolean = false): UseGraphDataResult {
  const [nodes, setNodes] = useState<GraphNode[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async () => {
    console.log('[useGraphData] fetchData called')
    setIsLoading(true)
    setError(null)

    try {
      // ========================================================================
      // Load all 100 authenticated references
      // ========================================================================
      console.log('[useGraphData] Loading references...')
      const allReferences = getAllReferences()
      console.log('[useGraphData] Loaded', allReferences.length, 'references')

      // Group references by pillar for positioning
      const referencesByPillar: Record<PillarType, PillarReference[]> = {
        shahada: getReferencesByPillar('shahada'),
        salah: getReferencesByPillar('salah'),
        zakat: getReferencesByPillar('zakat'),
        sawm: getReferencesByPillar('sawm'),
        hajj: getReferencesByPillar('hajj')
      }

      // ========================================================================
      // Create nodes with orbital positions
      // NEW LAYOUT: ALL nodes (Quran + Hadith) on rings, ALTERNATING pattern
      // ========================================================================
      const graphNodes: GraphNode[] = []

      // For each pillar, place ALL nodes (Quran + Hadith) on that pillar's ring
      Object.entries(referencesByPillar).forEach(([pillar, references]) => {
        const pillarType = pillar as PillarType

        // PART 2: Fix Node Alternating - SYSTEMATIC APPROACH
        console.log(`\n--- Processing ${pillar} ---`)

        // STEP 2A: Separate Quran and Hadith references
        const quranRefs = references.filter(ref => ref.source === 'Quran')
        const hadithRefs = references.filter(ref => ref.source !== 'Quran')

        console.log(`${pillar}: ${quranRefs.length} Quran, ${hadithRefs.length} Hadith`)

        // STEP 2B: Create Alternating Pattern
        const interleavedRefs: PillarReference[] = []
        const qCount = quranRefs.length
        const hCount = hadithRefs.length
        const total = qCount + hCount

        if (hCount === 0) {
          // No hadiths, just add all Quran
          interleavedRefs.push(...quranRefs)
          console.log(`${pillar}: No hadiths, using ${qCount} Quran nodes`)
        } else if (qCount === 0) {
          // No Quran, just add all hadiths
          interleavedRefs.push(...hadithRefs)
          console.log(`${pillar}: No Quran, using ${hCount} Hadith nodes`)
        } else {
          // STEP 2C: Calculate ratio and create pattern
          const ratio = Math.round(qCount / hCount)
          console.log(`${pillar}: Creating pattern with ratio ${ratio}:1 (Quran:Hadith)`)

          let qIndex = 0
          let hIndex = 0

          // Build alternating array
          while (qIndex < qCount || hIndex < hCount) {
            // Add 'ratio' number of Quran nodes
            for (let i = 0; i < ratio && qIndex < qCount; i++) {
              interleavedRefs.push(quranRefs[qIndex])
              qIndex++
            }

            // Add one Hadith node
            if (hIndex < hCount) {
              interleavedRefs.push(hadithRefs[hIndex])
              hIndex++
            }
          }

          // VERIFICATION: Log the pattern
          const pattern = interleavedRefs.map(r => r.source === 'Quran' ? 'Q' : 'H').join('-')
          console.log(`${pillar} PATTERN:`, pattern)

          // Check for clusters (3+ of same type in a row)
          const hasClusters = /Q-Q-Q-Q|H-H-H-H/.test(pattern)
          if (hasClusters) {
            console.warn(`⚠️ ${pillar} WARNING: Detected clusters of 4+ same type!`)
          } else {
            console.log(`✓ ${pillar}: Pattern looks good (no major clusters)`)
          }
        }

        // Total nodes on this ring
        const totalInRing = interleavedRefs.length

        // Distribute all nodes evenly around the ring
        interleavedRefs.forEach((ref, index) => {
          const position = calculateOrbitalPosition(pillarType, index, totalInRing)

          // Determine node type based on source
          const nodeType: 'primary' | 'secondary' = ref.source === 'Quran' ? 'primary' : 'secondary'

          graphNodes.push({
            id: ref.refId,
            type: nodeType,
            position,
            pillar: pillarType,
            label: `${ref.source} ${ref.citation}`,
            refId: ref.refId,
            source: ref.source,
            citation: ref.citation,
            function: ref.function,
            coreText: ref.coreText,
            tags: ref.tags,
            apiLink: getApiLink(ref.source as any, ref.citation)
          })
        })
      })

      console.log('[useGraphData] Created', graphNodes.length, 'graph nodes')
      setNodes(graphNodes)
      console.log('[useGraphData] fetchData completed successfully')
    } catch (err) {
      console.error('[useGraphData] ERROR:', err)
      setError(err instanceof Error ? err : new Error('Unknown error occurred'))
    } finally {
      console.log('[useGraphData] Setting isLoading to false')
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // REMOVED: Resize listener was causing infinite loops and crashes
  }, [useDatabase])

  return {
    nodes,
    isLoading,
    error,
    refetch: fetchData
  }
}
