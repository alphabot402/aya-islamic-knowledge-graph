/**
 * ConnectionLines Component
 * Temporarily disabled - no connections in current dataset
 */

'use client'

import { GraphNode } from '@/hooks/useGraphData.orbital'

interface ConnectionLinesProps {
  nodes: GraphNode[]
  hoveredNodeId: string | null
  selectedNodeId: string | null
}

export default function ConnectionLines({ nodes, hoveredNodeId, selectedNodeId }: ConnectionLinesProps) {
  // No connections in current dataset - return empty component
  return null
}

/**
 * Single connection line with glow effect
 */
function ConnectionLine({
  start,
  end
}: {
  start: [number, number, number]
  end: [number, number, number]
}) {
  // ✅ OPTIMIZATION: Memoize Vector3 objects (reused, not recreated)
  const points = useMemo(() => {
    return [new THREE.Vector3(...start), new THREE.Vector3(...end)]
  }, [start, end])

  // ✅ OPTIMIZATION: Create geometry with proper disposal
  const lineGeometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points)
  }, [points])

  // ✅ CRITICAL FIX: Dispose geometry on unmount or when dependencies change
  useEffect(() => {
    return () => {
      // This prevents memory leaks!
      lineGeometry.dispose()
    }
  }, [lineGeometry])

  return (
    <>
      {/* Main line */}
      {/* @ts-ignore - R3F line primitive, not SVG */}
      <line geometry={lineGeometry}>
        <lineBasicMaterial
          color="#fbbf24"
          opacity={0.7}
          transparent
          linewidth={3}
        />
      </line>

      {/* Glow effect (wider, more transparent line) */}
      {/* @ts-ignore - R3F line primitive, not SVG */}
      <line geometry={lineGeometry}>
        <lineBasicMaterial
          color="#fbbf24"
          opacity={0.4}
          transparent
          linewidth={6}
        />
      </line>
    </>
  )
}
