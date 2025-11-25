'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as random from 'maath/random'
import * as THREE from 'three'

/**
 * Enhanced StarField with multiple star layers and nebula effects
 * Creates depth and visual richness for the night sky theme
 */

interface StarsProps {
  count?: number
  radius?: number
  color?: string
  size?: number
  speed?: number
}

function Stars({ count = 5000, radius = 1.5, color = "#1ac7b1", size = 0.002, speed = 1 }: StarsProps) {
  const ref = useRef<THREE.Points>(null)

  const sphere = useMemo(() => {
    const positions = random.inSphere(new Float32Array(count * 3), { radius }) as Float32Array
    return positions
  }, [count, radius])

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= (delta / 10) * speed
      ref.current.rotation.y -= (delta / 15) * speed
    }
  })

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color={color}
          size={size}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  )
}

function NebulaCloud() {
  const ref = useRef<THREE.Points>(null)

  const cloud = useMemo(() => {
    const positions = random.inSphere(new Float32Array(2000 * 3), { radius: 1.2 }) as Float32Array
    return positions
  }, [])

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.05
      ref.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.2
    }
  })

  return (
    <Points ref={ref} positions={cloud} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#9333ea"
        size={0.008}
        sizeAttenuation={true}
        opacity={0.3}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
}

export default function StarField() {
  return (
    <div className="fixed inset-0 z-0">
      {/* Gradient background overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-celestial-void via-purple-950/20 to-celestial-void"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>

      {/* 3D Star layers */}
      <Canvas camera={{ position: [0, 0, 1] }}>
        {/* Background stars - Small and dim */}
        <Stars count={8000} radius={2.0} color="#4a5568" size={0.0015} speed={0.3} />

        {/* Mid-layer stars - Teal themed */}
        <Stars count={5000} radius={1.5} color="#1ac7b1" size={0.002} speed={0.6} />

        {/* Foreground stars - Larger and brighter */}
        <Stars count={2000} radius={1.0} color="#d8b4fe" size={0.004} speed={1.0} />

        {/* Purple nebula effect */}
        <NebulaCloud />

        {/* Ambient cosmic glow */}
        <ambientLight intensity={0.1} color="#9333ea" />
      </Canvas>
    </div>
  )
}

