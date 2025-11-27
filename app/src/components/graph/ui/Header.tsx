/**
 * Header Component
 * Clean, centered design for the Five Pillars knowledge graph
 * Optimized for mobile and desktop viewing with responsive text
 */

'use client'

import { useState, useEffect } from 'react'

interface HeaderProps {
  className?: string
}

export default function Header({ className = '' }: HeaderProps) {
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    // Detect touch capability on mount
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    setIsTouchDevice(hasTouch)
  }, [])

  return (
    <>
      {/* Glassmorphism gradient background for text readability */}
      <div className="absolute top-0 left-0 right-0 h-80 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none z-10" />

      {/* Header content - COMPACT with adjusted sizing */}
      <div className={`absolute top-0 left-0 right-0 z-20 pointer-events-none ${className}`} style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}>
        <div className="text-center max-w-5xl mx-auto py-3 md:py-4 px-4">

          {/* Main Heading - Split into two lines with elegant glow */}
          <h1 className="text-[32px] md:text-[42px] lg:text-[48px] font-bold text-white mb-3 leading-tight" style={{
            textShadow: '0 0 20px rgba(255, 255, 255, 0.5), 0 0 40px rgba(96, 165, 250, 0.3)'
          }}>
            Explore the Five Pillars of Islam
            <br />
            Through Quranic Verses & Sahih Hadith
          </h1>

          {/* Subtitle - Responsive sizing */}
          <p className="text-[15px] md:text-base lg:text-lg text-gray-200/80 font-light max-w-3xl mx-auto mb-3 leading-relaxed">
            A curated selection of authentic connections from primary Islamic sources
          </p>

          {/* CTA - Platform-specific interaction instructions */}
          <div className="flex items-center justify-center text-cyan-300 pointer-events-auto">
            <span className="text-[14px] md:text-[15px] lg:text-base font-light drop-shadow-md">
              {isTouchDevice
                ? "↓ Tap nodes to explore • Drag to rotate • Pinch to zoom"
                : "↓ Click nodes to view sources • Drag to rotate • Scroll to zoom"
              }
            </span>
          </div>

        </div>
      </div>
    </>
  )
}
