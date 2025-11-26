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

// Quran nodes placed on outer orbital rings by pillar
// Reduced by 20% to fit all rings on screen
// These values match the visual rings in OrbitRings.tsx
const PILLAR_RINGS: Record<Pillar, number> = {
  shahada: 32,
  salah: 48,
  zakat: 64,
  sawm: 80,
  hajj: 96,
  general: 0  // Not used
}

// Hadith nodes placed in center core area
const HADITH_CENTER_RADIUS = 12  // Clustered in center (also reduced by 20%)

/**
 * Calculate orbital position for a node
 * NEW LAYOUT: Quran on outer rings, Hadith in center core
 */
function calculateOrbitalPosition(
  pillar: Pillar,
  index: number,
  totalInRing: number,
  nodeType: 'primary' | 'secondary'
): [number, number, number] {
  if (nodeType === 'secondary') {
    // HADITH nodes - cluster in center core area
    const angle = (index / totalInRing) * Math.PI * 2
    const x = Math.cos(angle) * HADITH_CENTER_RADIUS
    const z = Math.sin(angle) * HADITH_CENTER_RADIUS
    const y = Math.sin(index * 0.5) * 5  // Vary Y height for 3D cluster effect
    return [x, y, z]
  } else {
    // QURAN nodes - place on outer orbital rings by pillar
    const radius = PILLAR_RINGS[pillar]
    const angle = (index / totalInRing) * Math.PI * 2
    const x = Math.cos(angle) * radius
    const z = Math.sin(angle) * radius
    const y = 0  // Keep on horizontal plane
    return [x, y, z]
  }
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
      // NEW LAYOUT: Separate Quran (outer rings) from Hadith (center)
      // ========================================================================
      const graphNodes: GraphNode[] = []

      // First, collect all Hadith nodes for center cluster
      const allHadiths: { ref: PillarReference; pillar: PillarType }[] = []
      Object.entries(referencesByPillar).forEach(([pillar, references]) => {
        references.forEach(ref => {
          if (ref.source !== 'Quran') {
            allHadiths.push({ ref, pillar: pillar as PillarType })
          }
        })
      })

      // Position all Hadith nodes in center core
      const totalHadiths = allHadiths.length
      allHadiths.forEach(({ ref, pillar }, index) => {
        const position = calculateOrbitalPosition(pillar, index, totalHadiths, 'secondary')
        graphNodes.push({
          id: ref.refId,
          type: 'secondary',
          position,
          pillar,
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

      // Position Quran nodes on outer rings by pillar
      Object.entries(referencesByPillar).forEach(([pillar, references]) => {
        const pillarType = pillar as PillarType
        const quranRefs = references.filter(ref => ref.source === 'Quran')
        const totalInRing = quranRefs.length

        quranRefs.forEach((ref, index) => {
          const position = calculateOrbitalPosition(pillarType, index, totalInRing, 'primary')
          graphNodes.push({
            id: ref.refId,
            type: 'primary',
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
  }, [useDatabase])

  return {
    nodes,
    isLoading,
    error,
    refetch: fetchData
  }
}
