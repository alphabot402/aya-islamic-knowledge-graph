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

      {/* Header content - ULTRA COMPACT on mobile, optimized to prevent text spillover */}
      <div className={`absolute top-0 left-0 right-0 z-20 pointer-events-none ${className}`} style={{ paddingTop: 'max(0.5rem, env(safe-area-inset-top))' }}>
        <div className="text-center max-w-5xl mx-auto py-1.5 md:py-4 px-2.5 md:px-4">

          {/* Main Heading - Reduced font size to prevent word spillover */}
          <h1
            className="font-bold text-white mb-1.5 md:mb-3 md:leading-tight main-heading"
            style={{
              fontSize: 'clamp(18px, 5vw, 24px)',
              lineHeight: '1.15',
              letterSpacing: '-0.5px',
              wordSpacing: '-1px',
              textShadow: window.innerWidth < 768
                ? '0 0 15px rgba(255, 255, 255, 0.6), 0 0 30px rgba(96, 165, 250, 0.5), 0 2px 4px rgba(0, 0, 0, 0.5)'
                : '0 0 25px rgba(255, 255, 255, 0.6), 0 0 50px rgba(96, 165, 250, 0.4), 0 0 80px rgba(96, 165, 250, 0.2)'
            }}
          >
            <span className="block sm:inline">Explore the Five Pillars of Islam</span>
            <br className="hidden sm:block" />
            <span className="block sm:inline mt-0.5 sm:mt-0">Through Quranic Verses & Sahih Hadith</span>
          </h1>

          {/* Subtitle - Reduced size to prevent 'sources' spillover */}
          <p
            className="text-gray-200/70 md:text-gray-200/80 font-light max-w-3xl mx-auto mb-1 md:mb-3 md:leading-relaxed"
            style={{
              fontSize: 'clamp(10px, 2.8vw, 13px)',
              lineHeight: '1.3',
              letterSpacing: '-0.3px',
              wordSpacing: '-0.5px'
            }}
          >
            A curated selection of authentic connections from primary Islamic sources
          </p>

          {/* CTA - Compact with fluid sizing */}
          <div className="flex items-center justify-center text-cyan-300 pointer-events-auto mb-1.5 md:mb-0">
            <span
              className="md:text-[15px] lg:text-base font-light drop-shadow-md"
              style={{
                fontSize: 'clamp(10px, 3vw, 12px)',
                lineHeight: '1.2'
              }}
            >
              {isTouchDevice
                ? "Tap nodes to explore • Drag to rotate • Pinch to zoom"
                : "Click nodes to view sources • Drag to rotate • Scroll to zoom"
              }
            </span>
          </div>

        </div>
      </div>
    </>
  )
}
