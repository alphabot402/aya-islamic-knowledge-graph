/**
 * ParticleFlow - The Blessings
 * "The angels lower their wings for the seeker of knowledge"
 *
 * A particle system that emits golden "blessing" particles when a node is selected.
 * Particles float upward gracefully and fade, symbolizing divine mercy and angels' wings.
 *
 * Features:
 * - Burst pattern from selected node
 * - Upward floating motion with wind-like drift
 * - Additive blending for divine glow
 * - Performance optimized with particle pooling
 */

'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useCosmicStore } from '@/lib/stores/useCosmicStore'

interface Particle {
  position: THREE.Vector3
  velocity: THREE.Vector3
  life: number // 0 to 1, decreases over time
  maxLife: number
  size: number
}

const PARTICLE_COUNT = 50 // Particles per burst
const PARTICLE_POOL_SIZE = 200 // Total particles in pool

export default function ParticleFlow() {
  const pointsRef = useRef<THREE.Points>(null)
  const particlesRef = useRef<Particle[]>([])
  const activeParticles = useRef<Set<number>>(new Set())

  // Get selected node and blessing trigger from store
  const selectedNode = useCosmicStore((state) => state.selectedNode)
  const triggerBlessing = useCosmicStore((state) => state.triggerBlessing)

  // Initialize particle pool
  useMemo(() => {
    particlesRef.current = Array.from({ length: PARTICLE_POOL_SIZE }, () => ({
      position: new THREE.Vector3(),
      velocity: new THREE.Vector3(),
      life: 0,
      maxLife: 1,
      size: 1
    }))
  }, [])

  // Create geometry and attributes
  const { geometry, positions, colors, sizes } = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(PARTICLE_POOL_SIZE * 3)
    const colors = new Float32Array(PARTICLE_POOL_SIZE * 3)
    const sizes = new Float32Array(PARTICLE_POOL_SIZE)

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    return { geometry, positions, colors, sizes }
  }, [])

  // Create material
  const material = useMemo(() => {
    return new THREE.PointsMaterial({
      size: 1,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
  }, [])

  // Emit particles when blessing is triggered
  useEffect(() => {
    if (!triggerBlessing || !selectedNode) return

    const emitPosition = new THREE.Vector3(...selectedNode.position)
    let emitted = 0

    // Find inactive particles and activate them
    for (let i = 0; i < PARTICLE_POOL_SIZE && emitted < PARTICLE_COUNT; i++) {
      if (!activeParticles.current.has(i)) {
        const particle = particlesRef.current[i]

        // Set position at source
        particle.position.copy(emitPosition)

        // Random velocity in upward burst pattern
        const angle = Math.random() * Math.PI * 2
        const speed = 2 + Math.random() * 3
        const upwardBias = 8 + Math.random() * 4 // Strong upward
        particle.velocity.set(
          Math.cos(angle) * speed,
          upwardBias,
          Math.sin(angle) * speed
        )

        // Random life and size
        particle.maxLife = 2 + Math.random() * 2 // 2-4 seconds
        particle.life = particle.maxLife
        particle.size = 2 + Math.random() * 3

        activeParticles.current.add(i)
        emitted++
      }
    }
  }, [triggerBlessing, selectedNode])

  // Animate particles
  useFrame((state, delta) => {
    if (!pointsRef.current) return

    const geometry = pointsRef.current.geometry
    const positionAttr = geometry.attributes.position as THREE.BufferAttribute
    const colorAttr = geometry.attributes.color as THREE.BufferAttribute
    const sizeAttr = geometry.attributes.size as THREE.BufferAttribute

    let needsUpdate = false

    // Update active particles
    activeParticles.current.forEach((index) => {
      const particle = particlesRef.current[index]

      // Decrease life
      particle.life -= delta
      if (particle.life <= 0) {
        activeParticles.current.delete(index)
        return
      }

      // Update position based on velocity
      particle.position.x += particle.velocity.x * delta
      particle.position.y += particle.velocity.y * delta
      particle.position.z += particle.velocity.z * delta

      // Add wind-like drift
      particle.position.x += Math.sin(state.clock.elapsedTime + index) * 0.5 * delta
      particle.position.z += Math.cos(state.clock.elapsedTime + index) * 0.5 * delta

      // Apply slight drag
      particle.velocity.multiplyScalar(0.98)

      // Calculate alpha based on life
      const lifeRatio = particle.life / particle.maxLife
      const alpha = Math.min(1, lifeRatio * 2) // Fade out in last half of life

      // Update buffer attributes
      positionAttr.setXYZ(index, particle.position.x, particle.position.y, particle.position.z)

      // Golden color with fade
      const goldColor = new THREE.Color('#fbbf24')
      colorAttr.setXYZ(index, goldColor.r * alpha, goldColor.g * alpha, goldColor.b * alpha)

      sizeAttr.setX(index, particle.size * alpha)

      needsUpdate = true
    })

    // Update geometry if particles changed
    if (needsUpdate) {
      positionAttr.needsUpdate = true
      colorAttr.needsUpdate = true
      sizeAttr.needsUpdate = true
    }
  })

  return <points ref={pointsRef} geometry={geometry} material={material} />
}

/**
 * Metaphor Note:
 *
 * The Prophet Muhammad (peace be upon him) said:
 * "The angels lower their wings out of pleasure for the one who seeks knowledge."
 * - Sunan Abi Dawud 3641
 *
 * These golden particles represent those angelic wings, blessing the seeker
 * of Islamic knowledge as they explore the connections between Quran and Hadith.
 *
 * The upward motion symbolizes the elevation of the soul through learning.
 * The golden glow represents divine light and mercy.
 * The graceful fade represents the subtle, gentle nature of angels.
 */
