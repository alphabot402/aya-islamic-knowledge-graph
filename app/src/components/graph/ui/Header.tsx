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

      {/* Header content */}
      <div className={`absolute top-0 left-0 right-0 z-20 pointer-events-none ${className}`} style={{ paddingTop: 'max(1.5rem, env(safe-area-inset-top))' }}>
        <div className="text-center max-w-3xl mx-auto py-6 md:py-10 px-4">

          {/* Main Heading - Clean and Direct */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4 leading-tight drop-shadow-lg">
            Explore Islam's Five Pillars<br />
            Connected Through Sahih Hadith & Quran
          </h1>

          {/* Subtitle - Subtle and Minimal */}
          <p className="text-sm md:text-base text-gray-300/90 font-light max-w-2xl mx-auto mb-4">
            A curated selection of authenticated connections—not exhaustive, but verified for scholarly accuracy
          </p>

          {/* Clear Call to Action */}
          <div className="flex items-center justify-center gap-2 text-cyan-300 pointer-events-auto">
            <span className="text-sm md:text-base font-medium drop-shadow-md">
              ↓ Click any node below to begin exploring
            </span>
          </div>

        </div>
      </div>
    </>
  )
}
