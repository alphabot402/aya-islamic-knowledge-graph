/**
 * OrbitRings Component
 * Renders the golden orbital tracks for the "Islamic Astrolabe" visualization
 * Each ring represents one of the Five Pillars
 */

'use client'

import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// PART 1: Fix Ring Alignment - Perfect Concentric Circles
// ALL DEVICES: Rings must be completely flat so nodes sit perfectly on them
const RING_ROTATION = {
  mobile: 0,      // COMPLETELY FLAT - top-down view
  tablet: 0,      // Also flat
  desktop: 0      // CHANGED: Now flat on desktop too (was 12°) to match node positions
}

function getRingRotation(): number {
  // Always return 0 - rings are flat on all devices to match node Y=0 plane
  return 0
}

interface OrbitRingProps {
  radius: number
  label: string
  color: string
  rotationSpeed: number
}

function OrbitRing({ radius, label, color, rotationSpeed }: OrbitRingProps) {
  const rotatingRingRef = useRef<THREE.Group>(null)
  const [ringRotation, setRingRotation] = useState<number>(0)

  // Set responsive ring rotation (REMOVED resize listener to prevent crashes)
  useEffect(() => {
    const rotation = getRingRotation()
    setRingRotation(rotation)
    // All rings are now flat (0°) to match node Y=0 plane
  }, [label])

  // Animate rotation around Y-axis (only the rotating ring moves)
  useFrame((state, delta) => {
    if (rotatingRingRef.current) {
      rotatingRingRef.current.rotation.y += rotationSpeed * delta
    }
  })

  return (
    <group>
      {/* STATIC ORBITAL TRACK - FLAT on mobile, ALL rings same rotation */}
      <group rotation={[Math.PI / 2 + ringRotation, 0, 0]}>
        {/* Outer glow layer - creates atmospheric depth */}
        <mesh>
          <torusGeometry args={[radius, 0.25, 32, 100]} />
          <meshStandardMaterial
            color={color}
            transparent
            opacity={0.12}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            emissive={color}
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* Main band with 3D gradient effect */}
        <mesh>
          <torusGeometry args={[radius, 0.12, 32, 100]} />
          <meshStandardMaterial
            color={color}
            transparent
            opacity={0.35}
            side={THREE.DoubleSide}
            metalness={0.6}
            roughness={0.3}
            emissive={color}
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* Inner highlight - creates thickness illusion */}
        <mesh>
          <torusGeometry args={[radius, 0.06, 32, 100]} />
          <meshStandardMaterial
            color={color}
            transparent
            opacity={0.45}
            side={THREE.DoubleSide}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* ROTATING RING - 3D HIGHLIGHT WITH GRADIENT - Same rotation as static ring */}
      <group ref={rotatingRingRef} rotation={[Math.PI / 2 + ringRotation, 0, 0]}>
        {/* Wide atmospheric glow */}
        <mesh>
          <torusGeometry args={[radius, 0.35, 32, 100]} />
          <meshStandardMaterial
            color={color}
            transparent
            opacity={0.15}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            emissive={color}
            emissiveIntensity={0.5}
          />
        </mesh>

        {/* Main rotating band with strong 3D effect */}
        <mesh>
          <torusGeometry args={[radius, 0.18, 32, 100]} />
          <meshStandardMaterial
            color={color}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
            metalness={0.9}
            roughness={0.1}
            emissive={color}
            emissiveIntensity={0.8}
          />
        </mesh>

        {/* Bright highlight on top curve */}
        <mesh>
          <torusGeometry args={[radius, 0.1, 32, 100]} />
          <meshStandardMaterial
            color={color}
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
            metalness={1.0}
            roughness={0.05}
            emissive={color}
            emissiveIntensity={1.2}
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
  // Get responsive scale factor - MUST MATCH useGraphData.orbital.ts
  const getScale = () => {
    if (typeof window === 'undefined') return 1.0
    const width = window.innerWidth
    if (width < 768) return 0.75  // Mobile: 25% reduction (MATCHES node scale)
    if (width < 1024) return 0.85 // Tablet: 15% reduction (MATCHES node scale)
    return 1.0                     // Desktop: no reduction
  }

  const scale = getScale()

  // Define all rings with responsive radii
  const rings = [
    { pillar: 'shahada' as Pillar, radius: 32 * scale, label: "Shahada", color: "#9333EA", rotationSpeed: 0.15 },
    { pillar: 'salah' as Pillar, radius: 48 * scale, label: "Salah", color: "#2563EB", rotationSpeed: 0.12 },
    { pillar: 'zakat' as Pillar, radius: 64 * scale, label: "Zakat", color: "#059669", rotationSpeed: 0.1 },
    { pillar: 'sawm' as Pillar, radius: 80 * scale, label: "Sawm", color: "#EA580C", rotationSpeed: 0.08 },
    { pillar: 'hajj' as Pillar, radius: 96 * scale, label: "Hajj", color: "#DC2626", rotationSpeed: 0.06 }
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
