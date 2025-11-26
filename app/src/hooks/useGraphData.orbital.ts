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

// Each pillar has ONE ring shared by both Quran and Hadith
// Starting at radius 40 to create empty divine center while fitting on screen
// These values match the visual rings in OrbitRings.tsx
const PILLAR_RINGS: Record<Pillar, number> = {
  shahada: 40,
  salah: 60,
  zakat: 80,
  sawm: 100,
  hajj: 120,
  general: 0  // Not used
}

/**
 * Calculate orbital position for a node on its pillar ring
 * Both Quran and Hadith share the same ring per pillar (unified system)
 * Slight Y-axis variation prevents visual overlap
 */
function calculateOrbitalPosition(
  pillar: Pillar,
  index: number,
  totalInRing: number,
  nodeType: 'primary' | 'secondary'
): [number, number, number] {
  const radius = PILLAR_RINGS[pillar]

  // Distribute nodes evenly around the ring
  const angle = (index / totalInRing) * Math.PI * 2

  const x = Math.cos(angle) * radius
  const z = Math.sin(angle) * radius

  // Slight Y-axis variation: Quran slightly above, Hadith slightly below
  // This prevents overlap while keeping them on the same ring
  const y = nodeType === 'primary' ? 3 : -3

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
      // ========================================================================
      const graphNodes: GraphNode[] = []

      // Process each pillar
      Object.entries(referencesByPillar).forEach(([pillar, references]) => {
        const pillarType = pillar as PillarType
        const totalInRing = references.length

        references.forEach((ref, index) => {
          // Determine node type (Quran = primary, Hadith = secondary)
          const nodeType = ref.source === 'Quran' ? 'primary' : 'secondary'

          // Calculate position on orbital ring (primary on inner ring, secondary on outer)
          const position = calculateOrbitalPosition(pillarType, index, totalInRing, nodeType)

          // Create node
          const node: GraphNode = {
            id: ref.refId,
            type: nodeType,
            position,
            pillar: pillarType,
            label: `${ref.source} ${ref.citation}`,

            // Reference data
            refId: ref.refId,
            source: ref.source,
            citation: ref.citation,
            function: ref.function,
            coreText: ref.coreText,
            tags: ref.tags,
            apiLink: getApiLink(ref.source as any, ref.citation)
          }

          graphNodes.push(node)
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
