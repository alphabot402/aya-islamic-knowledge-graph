/**
 * DivineScene - The Complete Integration
 * "He is Allah, the Creator, the Inventor, the Fashioner"
 *
 * The master scene component that composes all 4 Layers of Existence:
 * 1. The Atmosphere (DivineSky + Lighting)
 * 2. The Vastness (NebulaField)
 * 3. The Order (OrrerySystem)
 * 4. The Blessings (ParticleFlow)
 *
 * This is where Theology meets Physics in a living simulation.
 */

'use client'

import { Suspense } from 'react'
import { OrbitControls } from '@react-three/drei'
import DivineSky, { AtmosphericLight } from './DivineSky'
import NebulaField from './NebulaField'
import OrrerySystem from './OrrerySystem'
import ParticleFlow from './ParticleFlow'

export default function DivineScene() {
  return (
    <>
      {/* ================================================================
          LAYER 1: THE ATMOSPHERE
          Time-based dynamic sky and lighting that breathes with prayer
          ================================================================ */}
      <DivineSky />
      <AtmosphericLight />

      {/* ================================================================
          LAYER 2: THE VASTNESS
          The 99 Names as clouds of mercy in the far distance
          ================================================================ */}
      <Suspense fallback={null}>
        <NebulaField />
      </Suspense>

      {/* ================================================================
          LAYER 3: THE ORDER
          The Celestial Orrery - surahs and hadiths in orbital harmony
          ================================================================ */}
      <Suspense fallback={null}>
        <OrrerySystem />
      </Suspense>

      {/* ================================================================
          LAYER 4: THE BLESSINGS
          Golden particles - angels' wings for seekers of knowledge
          ================================================================ */}
      <ParticleFlow />

      {/* ================================================================
          CAMERA CONTROLS
          Allow exploration of the divine cosmos
          ================================================================ */}
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={30}
        maxDistance={250}
        maxPolarAngle={Math.PI * 0.9}
        // Start with a good overview angle
        target={[0, 0, 0]}
      />

      {/* ================================================================
          PERFORMANCE OPTIMIZATIONS
          ================================================================ */}
      {/* The fog helps with depth perception and hides far clipping */}
      <fog attach="fog" args={['#000000', 200, 450]} />
    </>
  )
}

/**
 * Performance Notes:
 *
 * 1. Suspense boundaries isolate loading of expensive components
 * 2. DivineSky and NebulaField use memoization to prevent re-renders
 * 3. ParticleFlow uses object pooling (no allocations during runtime)
 * 4. OrrerySystem uses memoized callbacks for node interactions
 * 5. Fog reduces rendering cost for distant objects
 *
 * Target: 60 FPS on mid-range hardware
 */

/**
 * Theological Architecture:
 *
 * The layering reflects Islamic cosmology:
 * - The Sky: The heavens (samawat) that change with time
 * - The Nebulae: The divine attributes surrounding creation
 * - The Orrery: The ordered structure of knowledge
 * - The Particles: The mercy and angels' blessing
 *
 * "He created the heavens and the earth in truth" - Quran 6:73
 */
