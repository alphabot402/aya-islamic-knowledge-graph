/**
 * Header Component
 * Clean, centered design for the Five Pillars knowledge graph
 * Optimized for mobile and desktop viewing
 */

'use client'

interface HeaderProps {
  className?: string
}

export default function Header({ className = '' }: HeaderProps) {
  return (
    <>
      {/* Glassmorphism gradient background for text readability */}
      <div className="absolute top-0 left-0 right-0 h-80 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none z-10" />

      {/* Header content - COMPACT with adjusted sizing */}
      <div className={`absolute top-0 left-0 right-0 z-20 pointer-events-none ${className}`} style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}>
        <div className="text-center max-w-5xl mx-auto py-3 md:py-4 px-4">

          {/* Main Heading - Split into two lines for better visual rhythm */}
          <h1 className="text-xl md:text-[28px] lg:text-[32px] font-bold text-white mb-3 leading-tight drop-shadow-[0_0_20px_rgba(147,197,253,0.5)]">
            Explore the Five Pillars of Islam
            <br />
            Through Quranic Verses & Sahih Hadith
          </h1>

          {/* Subtitle - LARGER 16-18px for readability */}
          <p className="text-base md:text-lg text-gray-200/80 font-light max-w-3xl mx-auto mb-3 leading-relaxed">
            A curated selection of authentic connections from primary Islamic sources
          </p>

          {/* CTA - Polished interaction instructions */}
          <div className="flex items-center justify-center text-cyan-300 pointer-events-auto">
            <span className="text-sm md:text-[15px] font-medium drop-shadow-md">
              ↓ Click nodes to view sources • Drag to rotate • Scroll to zoom
            </span>
          </div>

        </div>
      </div>
    </>
  )
}
