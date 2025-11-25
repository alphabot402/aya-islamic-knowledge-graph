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
      {/* SHAHADA - Purple */}
      <OrbitRing radius={25} label="Shahada-Surah" color="#9333ea" rotationSpeed={0.4} />
      <OrbitRing radius={30} label="Shahada-Hadith" color="#a855f7" rotationSpeed={0.38} />

      {/* SALAH - Blue */}
      <OrbitRing radius={35} label="Salah-Surah" color="#3b82f6" rotationSpeed={0.35} />
      <OrbitRing radius={40} label="Salah-Hadith" color="#60a5fa" rotationSpeed={0.33} />

      {/* ZAKAT - Teal */}
      <OrbitRing radius={45} label="Zakat-Surah" color="#14b8a6" rotationSpeed={0.3} />
      <OrbitRing radius={50} label="Zakat-Hadith" color="#2dd4bf" rotationSpeed={0.28} />

      {/* SAWM - Violet */}
      <OrbitRing radius={55} label="Sawm-Surah" color="#8b5cf6" rotationSpeed={0.25} />
      <OrbitRing radius={60} label="Sawm-Hadith" color="#a78bfa" rotationSpeed={0.23} />

      {/* HAJJ - Gold */}
      <OrbitRing radius={65} label="Hajj-Surah" color="#f59e0b" rotationSpeed={0.2} />
      <OrbitRing radius={70} label="Hajj-Hadith" color="#fbbf24" rotationSpeed={0.18} />

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
