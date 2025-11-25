/**
 * ConnectionLines Component
 * Renders connection lines between nodes
 * Extracted from QuranGraph.tsx (lines 220-234, 260-270)
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
          key={`${conn.source.id}-${conn.target.id}`} // ✅ Better key than index
          start={conn.source.position}
          end={conn.target.position}
        />
      ))}
    </>
  )
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
