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
 * UPDATED: Reduced mobile scale to 0.75 (25% reduction) to fit all rings on screen
 */
function getResponsiveScale(): number {
  if (typeof window === 'undefined') return 1.0 // SSR fallback

  const width = window.innerWidth
  if (width < 768) return 0.75  // Mobile: 25% reduction (optimized to show all rings without cutoff)
  if (width < 1024) return 0.85 // Tablet: 15% reduction
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
    setIsLoading(true)
    setError(null)

    try {
      // ========================================================================
      // Load all 100 authenticated references
      // ========================================================================
      const allReferences = getAllReferences()

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

      console.log('\n═══════════════════════════════════════════════════')
      console.log('🔍 DETAILED NODE ALTERNATING DEBUG')
      console.log('═══════════════════════════════════════════════════\n')

      // For each pillar, place ALL nodes (Quran + Hadith) on that pillar's ring
      Object.entries(referencesByPillar).forEach(([pillar, references]) => {
        const pillarType = pillar as PillarType

        // PART 2: Fix Node Alternating - SYSTEMATIC APPROACH
        console.log(`\n--- Processing ${pillar.toUpperCase()} ---`)

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
          // STEP 2C: IMPROVED DISTRIBUTION - Evenly spread nodes to avoid clustering
          console.log(`${pillar}: Distributing ${qCount} Quran and ${hCount} Hadith evenly`)

          // Calculate how many positions each node type needs
          const total = qCount + hCount
          const qStep = total / qCount  // Distance between Quran nodes
          const hStep = total / hCount  // Distance between Hadith nodes

          // Create array of {type, ref, position} then sort by position
          const distributionArray: Array<{type: 'Q' | 'H', ref: PillarReference, pos: number}> = []

          // Add Quran nodes at evenly spaced positions
          for (let i = 0; i < qCount; i++) {
            distributionArray.push({
              type: 'Q',
              ref: quranRefs[i],
              pos: i * qStep
            })
          }

          // Add Hadith nodes at evenly spaced positions (offset to interleave)
          for (let i = 0; i < hCount; i++) {
            distributionArray.push({
              type: 'H',
              ref: hadithRefs[i],
              pos: i * hStep + (qStep / 2)  // Offset by half step to interleave
            })
          }

          // Sort by position to get the final alternating order
          distributionArray.sort((a, b) => a.pos - b.pos)

          // Extract refs in sorted order
          distributionArray.forEach(item => {
            interleavedRefs.push(item.ref)
          })

          console.log(`${pillar}: Created evenly distributed pattern`)

          // VERIFICATION: Log the pattern
          const pattern = interleavedRefs.map(r => r.source === 'Quran' ? 'Q' : 'H').join('-')
          console.log(`${pillar} PATTERN (${interleavedRefs.length} nodes):`)
          console.log(`  ${pattern}`)

          // Check for clusters (3+ of same type in a row)
          const hasClusters = /Q-Q-Q-Q|H-H-H-H/.test(pattern)
          if (hasClusters) {
            console.warn(`⚠️ ${pillar} WARNING: Detected clusters of 4+ same type!`)
          } else {
            console.log(`✓ ${pillar}: Pattern looks good (no major clusters)`)
          }

          // Additional verification: Show first 20 nodes with their types
          console.log(`${pillar} First 20 nodes:`)
          interleavedRefs.slice(0, 20).forEach((ref, idx) => {
            console.log(`  ${idx}: ${ref.source === 'Quran' ? 'Q' : 'H'} - ${ref.citation}`)
          })
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

      // FINAL VERIFICATION: Summary of all nodes created
      console.log('\n═══════════════════════════════════════════════════')
      console.log('📊 FINAL NODE SUMMARY')
      console.log('═══════════════════════════════════════════════════')
      console.log(`Total nodes created: ${graphNodes.length}`)

      const nodesByPillar = graphNodes.reduce((acc, node) => {
        if (!acc[node.pillar]) acc[node.pillar] = { primary: 0, secondary: 0 }
        if (node.type === 'primary') acc[node.pillar].primary++
        else acc[node.pillar].secondary++
        return acc
      }, {} as Record<string, { primary: number, secondary: number }>)

      Object.entries(nodesByPillar).forEach(([pillar, counts]) => {
        console.log(`${pillar}: ${counts.primary} primary (Quran), ${counts.secondary} secondary (Hadith)`)
      })

      console.log('\n✅ All nodes positioned with alternating pattern')
      console.log('═══════════════════════════════════════════════════\n')

      setNodes(graphNodes)
    } catch (err) {
      console.error('Error loading graph data:', err)
      setError(err instanceof Error ? err : new Error('Unknown error occurred'))
    } finally {
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
