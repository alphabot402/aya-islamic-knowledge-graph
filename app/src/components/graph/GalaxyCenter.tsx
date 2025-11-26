/**
 * GalaxyCenter Component
 * Dense star cluster in the center creating a galactic core effect
 * Stars are densest at the center, gradually spreading outward
 */

'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function GalaxyCenter() {
  const starsRef = useRef<THREE.Points>(null)

  // Generate star field with density falloff from center
  const { positions, sizes, colors } = useMemo(() => {
    const starCount = 200
    const positionsArray = new Float32Array(starCount * 3)
    const sizesArray = new Float32Array(starCount)
    const colorsArray = new Float32Array(starCount * 3)

    // Max radius for star distribution (should be smaller than innermost ring)
    const maxRadius = 25

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3

      // Use exponential distribution for clustering towards center
      const angle = Math.random() * Math.PI * 2
      const distance = Math.pow(Math.random(), 2.5) * maxRadius // Stronger clustering with 2.5 exponent

      // Position in circular pattern on XZ plane
      positionsArray[i3] = Math.cos(angle) * distance
      positionsArray[i3 + 1] = (Math.random() - 0.5) * 8 // Slight Y variation
      positionsArray[i3 + 2] = Math.sin(angle) * distance

      // Size varies: smaller at edges, larger at center
      const distanceFactor = 1 - (distance / maxRadius)
      sizesArray[i] = (Math.random() * 1.5 + 0.5) * (1 + distanceFactor)

      // Color: white to light blue mix
      const colorChoice = Math.random()
      if (colorChoice > 0.7) {
        // Light blue
        colorsArray[i3] = 0.6 + Math.random() * 0.4
        colorsArray[i3 + 1] = 0.8 + Math.random() * 0.2
        colorsArray[i3 + 2] = 1.0
      } else {
        // White
        colorsArray[i3] = 0.9 + Math.random() * 0.1
        colorsArray[i3 + 1] = 0.9 + Math.random() * 0.1
        colorsArray[i3 + 2] = 0.95 + Math.random() * 0.05
      }
    }

    return {
      positions: positionsArray,
      sizes: sizesArray,
      colors: colorsArray
    }
  }, [])

  // Subtle twinkle animation
  useFrame((state) => {
    if (starsRef.current) {
      const material = starsRef.current.material as THREE.PointsMaterial
      material.opacity = 0.6 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={sizes.length}
          array={sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={2}
        sizeAttenuation
        transparent
        opacity={0.7}
        vertexColors
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}
