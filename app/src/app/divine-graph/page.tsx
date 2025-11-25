/**
 * Divine Graph Page - "The Living Cosmos"
 * Complete integration of the Divine Vastness architecture
 *
 * This page demonstrates the full vision:
 * - Prayer time-driven atmosphere
 * - 99 Names nebula field
 * - Celestial orrery with balanced rings
 * - Blessing particle effects
 */

'use client'

import { Canvas } from '@react-three/fiber'
import DivineScene from '@/components/canvas/DivineScene'
import { useStartPrayerClock, usePrayerTime } from '@/lib/stores/useCosmicStore'

export default function DivineGraphPage() {
  // Start the prayer time clock (updates every minute)
  useStartPrayerClock()

  // Get current prayer time for display
  const prayerTimeInfo = usePrayerTime()

  return (
    <div className="w-full h-screen relative bg-black">
      {/* 3D Canvas - The Divine Cosmos */}
      <Canvas
        camera={{
          position: [120, 80, 120],
          fov: 60
        }}
        className="bg-black"
        gl={{ antialias: true, alpha: false }}
      >
        <DivineScene />
      </Canvas>

      {/* Prayer Time Indicator */}
      <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-md border border-gold/30 rounded-lg px-6 py-3">
        <div className="text-gold text-sm font-medium uppercase tracking-wider">
          {prayerTimeInfo.current.toUpperCase()}
        </div>
        <div className="text-gold/60 text-xs mt-1">
          Prayer Time: {prayerTimeInfo.spiritualState}
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md border border-gold/30 rounded-lg px-6 py-3">
        <div className="text-gold/80 text-xs text-center uppercase tracking-wide">
          Drag to Explore • Scroll to Zoom • Click Nodes for Details
        </div>
      </div>

      {/* Architecture Info */}
      <div className="absolute bottom-6 right-6 bg-black/60 backdrop-blur-md border border-gold/30 rounded-lg px-6 py-4 max-w-xs">
        <h3 className="text-gold text-sm font-medium mb-2">
          Divine Vastness Architecture
        </h3>
        <div className="text-gold/60 text-xs space-y-1">
          <div>🌌 The Sky: Prayer-time atmosphere</div>
          <div>✨ The Stars: 99 Names of Allah</div>
          <div>⭕ The Rings: Five Pillars of Islam</div>
          <div>💫 The Particles: Angelic blessings</div>
        </div>
      </div>

      <style jsx>{`
        .text-gold {
          color: #fbbf24;
        }
        .border-gold\\/30 {
          border-color: rgba(251, 191, 36, 0.3);
        }
        .text-gold\\/60 {
          color: rgba(251, 191, 36, 0.6);
        }
        .text-gold\\/80 {
          color: rgba(251, 191, 36, 0.8);
        }
      `}</style>
    </div>
  )
}
