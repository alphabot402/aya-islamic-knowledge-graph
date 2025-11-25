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
      {/* Shahada Ring - Innermost orbit (Radius 15) - Purple */}
      <OrbitRing
        radius={15}
        label="Shahada"
        color="#9333ea" // Purple - foundation
        rotationSpeed={0.4}
      />

      {/* Salah Ring - Second orbit (Radius 30) - Deep Blue */}
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
