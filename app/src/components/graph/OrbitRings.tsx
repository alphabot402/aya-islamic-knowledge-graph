/**
 * OrbitRings Component
 * Renders the golden orbital tracks for the "Islamic Astrolabe" visualization
 * Each ring represents one of the Five Pillars
 */

'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface OrbitRingProps {
  radius: number
  label: string
  color: string
  rotationSpeed: number
}

function OrbitRing({ radius, label, color, rotationSpeed }: OrbitRingProps) {
  const rotatingRingRef = useRef<THREE.Group>(null)

  // Animate rotation around Y-axis (only the rotating ring moves)
  useFrame((state, delta) => {
    if (rotatingRingRef.current) {
      rotatingRingRef.current.rotation.y += rotationSpeed * delta
    }
  })

  return (
    <group>
      {/* STATIC ORBITAL TRACK - Fixed anchor showing the path */}
      <group rotation={[Math.PI / 2, 0, 0]}>
        {/* Thin guideline showing orbital path */}
        <mesh>
          <torusGeometry args={[radius, 0.08, 16, 100]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* ROTATING RING - Moves along the orbital track like planetary rotation */}
      <group ref={rotatingRingRef} rotation={[Math.PI / 2, 0, 0]}>
        {/* Subtle outer glow */}
        <mesh>
          <torusGeometry args={[radius, 0.35, 24, 100]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.12}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Main rotating ring - like Saturn's rings rolling on orbit */}
        <mesh>
          <torusGeometry args={[radius, 0.25, 24, 100]} />
          <meshStandardMaterial
            color={color}
            metalness={0.8}
            roughness={0.3}
            emissive={color}
            emissiveIntensity={0.7}
            transparent
            opacity={0.85}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </group>
  )
}

/**
 * Main OrbitRings component
 * Renders all five pillar orbits with the Astrolabe aesthetic
 */
export default function OrbitRings() {
  return (
    <group>
      {/* Shahada Ring - Innermost orbit (Optimized spacing) - Purple */}
      <OrbitRing
        radius={28}
        label="Shahada"
        color="#9333ea" // Purple - foundation
        rotationSpeed={0.4}
      />

      {/* Salah Ring - Second orbit - Deep Blue */}
      <OrbitRing
        radius={32}
        label="Salah"
        color="#3b82f6" // Bright Blue - celestial
        rotationSpeed={0.35}
      />

      {/* Zakat Ring - Third orbit - Emerald Teal */}
      <OrbitRing
        radius={38}
        label="Zakat"
        color="#14b8a6" // Teal - charity
        rotationSpeed={0.3}
      />

      {/* Sawm Ring - Fourth orbit - Deep Violet */}
      <OrbitRing
        radius={46}
        label="Sawm"
        color="#8b5cf6" // Violet - fasting
        rotationSpeed={0.25}
      />

      {/* Hajj Ring - Outermost orbit - Rich Gold */}
      <OrbitRing
        radius={56}
        label="Hajj"
        color="#f59e0b" // Amber Gold - pilgrimage
        rotationSpeed={0.2}
      />

      {/* Small central marker sphere - subtle reference point */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color="#fbbf24" // Bright gold
          metalness={0.8}
          roughness={0.2}
          emissive="#fbbf24"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  )
}
