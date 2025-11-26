/**
 * ConnectionLines Component
 * Renders connection lines between nodes
 * Extracted from QuranGraph.tsx (lines 220-234, 260-270)
 */

'use client'

import { useMemo, useEffect } from 'react'
import * as THREE from 'three'
import { GraphNode } from '@/hooks/useGraphData.orbital'

interface ConnectionLinesProps {
  nodes: GraphNode[]
  hoveredNodeId: string | null
  selectedNodeId: string | null
}

export default function ConnectionLines({ nodes, hoveredNodeId, selectedNodeId }: ConnectionLinesProps) {
  // Only show connections for hovered or selected nodes
  const connections = useMemo(() => {
    const result: Array<{ source: GraphNode; target: GraphNode }> = []

    // If nothing is hovered/selected, show NO lines (clean view)
    const activeNodeId = hoveredNodeId || selectedNodeId
    if (!activeNodeId) {
      return result
    }

    // Find connections FROM or TO the active node
    nodes.forEach(node => {
      if (node.type === 'secondary') {
        const isSourceActive = node.id === activeNodeId
        const connectsToActive = node.connections.includes(activeNodeId)

        if (isSourceActive) {
          // If hadith is active, show all its connections
          node.connections.forEach(targetId => {
            const target = nodes.find(n => n.id === targetId)
            if (target) {
              result.push({ source: node, target })
            }
          })
        } else if (connectsToActive) {
          // If a surah is active and this hadith connects to it,
          // show ONLY that specific connection (not all hadith connections)
          const target = nodes.find(n => n.id === activeNodeId)
          if (target) {
            result.push({ source: node, target })
          }
        }
      }
    })

    return result
  }, [nodes, hoveredNodeId, selectedNodeId])

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
