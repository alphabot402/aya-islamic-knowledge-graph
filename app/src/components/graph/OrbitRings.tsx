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
      {/* STATIC ORBITAL TRACK - THICKER with 3D depth */}
      <group rotation={[Math.PI / 2, 0, 0]}>
        {/* Wide outer glow for atmospheric depth */}
        <mesh>
          <torusGeometry args={[radius, 0.8, 32, 100]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.12}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Mid-layer glow */}
        <mesh>
          <torusGeometry args={[radius, 0.5, 32, 100]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.25}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Main guideline - THICKER (3x original) */}
        <mesh>
          <torusGeometry args={[radius, 0.24, 32, 100]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* ROTATING RING - THICKER with enhanced 3D effect */}
      <group ref={rotatingRingRef} rotation={[Math.PI / 2, 0, 0]}>
        {/* Wide outer glow for atmospheric effect */}
        <mesh>
          <torusGeometry args={[radius, 1.2, 32, 100]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.08}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Mid glow layer - thicker */}
        <mesh>
          <torusGeometry args={[radius, 0.9, 32, 100]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.15}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Inner glow */}
        <mesh>
          <torusGeometry args={[radius, 0.6, 32, 100]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.25}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Main rotating ring - THICKER (3x) with strong emissive glow */}
        <mesh>
          <torusGeometry args={[radius, 0.7, 32, 100]} />
          <meshStandardMaterial
            color={color}
            metalness={0.95}
            roughness={0.1}
            emissive={color}
            emissiveIntensity={1.2}
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </group>
  )
}

/**
 * Main OrbitRings component
 * Conditionally renders rings based on filter
 * Each ring represents one of the Five Pillars
 */

import { Pillar } from '@/hooks/useGraphData.orbital'

interface OrbitRingsProps {
  pillarFilter: Pillar | 'all'
}

export default function OrbitRings({ pillarFilter }: OrbitRingsProps) {
  // Define all rings with their properties
  const rings = [
    { pillar: 'shahada' as Pillar, radius: 32, label: "Shahada", color: "#9333EA", rotationSpeed: 0.15 },
    { pillar: 'salah' as Pillar, radius: 48, label: "Salah", color: "#2563EB", rotationSpeed: 0.12 },
    { pillar: 'zakat' as Pillar, radius: 64, label: "Zakat", color: "#059669", rotationSpeed: 0.1 },
    { pillar: 'sawm' as Pillar, radius: 80, label: "Sawm", color: "#EA580C", rotationSpeed: 0.08 },
    { pillar: 'hajj' as Pillar, radius: 96, label: "Hajj", color: "#DC2626", rotationSpeed: 0.06 }
  ]

  // Filter rings based on pillar filter
  const visibleRings = pillarFilter === 'all'
    ? rings
    : rings.filter(ring => ring.pillar === pillarFilter)

  return (
    <group>
      {visibleRings.map(ring => (
        <OrbitRing
          key={ring.pillar}
          radius={ring.radius}
          label={ring.label}
          color={ring.color}
          rotationSpeed={ring.rotationSpeed}
        />
      ))}
    </group>
  )
}
