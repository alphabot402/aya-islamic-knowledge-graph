/**
 * ConnectionLines Component (OPTIMIZED)
 * Performance improvements:
 * 1. Proper geometry disposal to prevent memory leaks
 * 2. Memoized Vector3 objects
 * 3. Stable geometry references
 */

'use client'

import { useMemo, useEffect } from 'react'
import * as THREE from 'three'
import { GraphNode } from '@/hooks/useGraphData'

interface ConnectionLinesProps {
  nodes: GraphNode[]
}

export default function ConnectionLines({ nodes }: ConnectionLinesProps) {
  // Memoize connection calculations (only recalculate when nodes change)
  const connections = useMemo(() => {
    const result: Array<{ source: GraphNode; target: GraphNode }> = []

    nodes.forEach(node => {
      if (node.type === 'hadith') {
        node.connections.forEach(targetId => {
          const target = nodes.find(n => n.id === targetId)
          if (target) {
            result.push({ source: node, target })
          }
        })
      }
    })

    return result
  }, [nodes])

  return (
    <>
      {connections.map((conn, i) => (
        <ConnectionLine
          key={`${conn.source.id}-${conn.target.id}`} // Better key than index
          start={conn.source.position}
          end={conn.target.position}
        />
      ))}
    </>
  )
}

/**
 * Single connection line with glow effect (OPTIMIZED)
 */
function ConnectionLine({
  start,
  end
}: {
  start: [number, number, number]
  end: [number, number, number]
}) {
  // ✅ OPTIMIZATION 1: Memoize Vector3 objects (reused, not recreated)
  const points = useMemo(() => {
    return [new THREE.Vector3(...start), new THREE.Vector3(...end)]
  }, [start, end])

  // ✅ OPTIMIZATION 2: Create geometry with proper disposal
  const lineGeometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points)
  }, [points])

  // ✅ OPTIMIZATION 3: Dispose geometry on unmount or when dependencies change
  useEffect(() => {
    return () => {
      // Critical: dispose geometry to prevent memory leaks
      lineGeometry.dispose()
    }
  }, [lineGeometry])

  return (
    <>
      {/* Main line */}
      <line geometry={lineGeometry}>
        <lineBasicMaterial
          color="#fbbf24"
          opacity={0.7}
          transparent
          linewidth={3}
        />
      </line>

      {/* Glow effect (wider, more transparent line) */}
      {/* Note: Reuses geometry - good! Only one geometry object */}
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
