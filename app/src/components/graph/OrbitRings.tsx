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
  const ringRef = useRef<THREE.Mesh>(null)

  // Animate rotation around Y-axis
  useFrame((state, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.y += rotationSpeed * delta
    }
  })

  return (
    <mesh
      ref={ringRef}
      rotation={[Math.PI / 2, 0, 0]} // Lay flat on XZ plane
    >
      <torusGeometry args={[radius, 0.15, 16, 100]} />
      <meshStandardMaterial
        color={color}
        metalness={0.9}
        roughness={0.2}
        emissive={color}
        emissiveIntensity={0.3}
        transparent
        opacity={0.6}
      />
    </mesh>
  )
}

/**
 * Main OrbitRings component
 * Renders all five pillar orbits with the Astrolabe aesthetic
 */
export default function OrbitRings() {
  return (
    <group>
      {/* Salah Ring - Innermost orbit (Radius 30) */}
      <OrbitRing
        radius={30}
        label="Salah"
        color="#14b8a6" // Teal
        rotationSpeed={0.3}
      />

      {/* Zakat Ring - Second orbit (Radius 50) */}
      <OrbitRing
        radius={50}
        label="Zakat"
        color="#f59e0b" // Amber/Gold
        rotationSpeed={0.2}
      />

      {/* Sawm Ring - Third orbit (Radius 70) */}
      <OrbitRing
        radius={70}
        label="Sawm"
        color="#8b5cf6" // Violet
        rotationSpeed={0.15}
      />

      {/* Hajj Ring - Outermost orbit (Radius 90) */}
      <OrbitRing
        radius={90}
        label="Hajj"
        color="#ec4899" // Pink
        rotationSpeed={0.1}
      />

      {/* General Knowledge Plane - Separate elevated plane */}
      <OrbitRing
        radius={60}
        label="General"
        color="#6b7280" // Gray
        rotationSpeed={0.08}
      />

      {/* Central axis for Shahada (visual guide) */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 40, 32]} />
        <meshStandardMaterial
          color="#d4af37" // Golden
          metalness={0.95}
          roughness={0.1}
          emissive="#d4af37"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Celestial sphere at center */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial
          color="#fbbf24" // Bright gold
          metalness={0.9}
          roughness={0.1}
          emissive="#fbbf24"
          emissiveIntensity={0.8}
        />
      </mesh>
    </group>
  )
}
