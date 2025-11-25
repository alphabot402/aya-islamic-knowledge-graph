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
  const ringRef = useRef<THREE.Group>(null)

  // Animate rotation around Y-axis
  useFrame((state, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.y += rotationSpeed * delta
    }
  })

  return (
    <group ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
      {/* Subtle outer glow */}
      <mesh>
        <torusGeometry args={[radius, 0.35, 24, 100]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Main crisp ring - defined and clean */}
      <mesh>
        <torusGeometry args={[radius, 0.25, 24, 100]} />
        <meshStandardMaterial
          color={color}
          metalness={0.8}
          roughness={0.3}
          emissive={color}
          emissiveIntensity={0.8}
          transparent
          opacity={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>
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
      {/* Salah Ring - Innermost orbit (Radius 30) - Deep Blue */}
      <OrbitRing
        radius={30}
        label="Salah"
        color="#3b82f6" // Bright Blue - celestial
        rotationSpeed={0.3}
      />

      {/* Zakat Ring - Second orbit (Radius 42) - Emerald Teal */}
      <OrbitRing
        radius={42}
        label="Zakat"
        color="#14b8a6" // Teal - distinct from blue/purple
        rotationSpeed={0.2}
      />

      {/* General Knowledge Plane - Third orbit (Radius 54) - Cool Gray */}
      <OrbitRing
        radius={54}
        label="General"
        color="#64748b" // Slate Gray - neutral celestial
        rotationSpeed={0.08}
      />

      {/* Sawm Ring - Fourth orbit (Radius 66) - Deep Violet */}
      <OrbitRing
        radius={66}
        label="Sawm"
        color="#8b5cf6" // Violet - celestial purple
        rotationSpeed={0.15}
      />

      {/* Hajj Ring - Outermost orbit (Radius 78) - Rich Gold */}
      <OrbitRing
        radius={78}
        label="Hajj"
        color="#f59e0b" // Amber Gold - warm contrast
        rotationSpeed={0.1}
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
