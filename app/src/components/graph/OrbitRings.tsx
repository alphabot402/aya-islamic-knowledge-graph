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
      {/* Outer glow atmosphere - far halo */}
      <mesh>
        <torusGeometry args={[radius, 0.8, 24, 100]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.18}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Middle atmosphere layer */}
      <mesh>
        <torusGeometry args={[radius, 0.6, 24, 100]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.28}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Main thick ring - Saturn-like planetary ring */}
      <mesh>
        <torusGeometry args={[radius, 0.45, 24, 100]} />
        <meshStandardMaterial
          color={color}
          metalness={0.9}
          roughness={0.2}
          emissive={color}
          emissiveIntensity={1.2}
          transparent
          opacity={0.85}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Inner bright core */}
      <mesh>
        <torusGeometry args={[radius, 0.35, 24, 100]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Bright stellar edge highlight */}
      <mesh>
        <torusGeometry args={[radius, 0.25, 24, 100]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
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

      {/* Zakat Ring - Second orbit (Radius 50) - Emerald Teal */}
      <OrbitRing
        radius={50}
        label="Zakat"
        color="#14b8a6" // Teal - distinct from blue/purple
        rotationSpeed={0.2}
      />

      {/* Sawm Ring - Third orbit (Radius 70) - Deep Violet */}
      <OrbitRing
        radius={70}
        label="Sawm"
        color="#8b5cf6" // Violet - celestial purple
        rotationSpeed={0.15}
      />

      {/* Hajj Ring - Outermost orbit (Radius 90) - Rich Gold */}
      <OrbitRing
        radius={90}
        label="Hajj"
        color="#f59e0b" // Amber Gold - warm contrast
        rotationSpeed={0.1}
      />

      {/* General Knowledge Plane - Separate elevated plane - Cool Gray */}
      <OrbitRing
        radius={60}
        label="General"
        color="#64748b" // Slate Gray - neutral celestial
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
