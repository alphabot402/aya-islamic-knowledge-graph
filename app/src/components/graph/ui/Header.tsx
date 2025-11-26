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

      {/* Header content - COMPRESSED to 15-20% viewport height */}
      <div className={`absolute top-0 left-0 right-0 z-20 pointer-events-none ${className}`} style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}>
        <div className="text-center max-w-5xl mx-auto py-3 md:py-4 px-4">

          {/* Main Heading - ONE LINE, 32-36px */}
          <h1 className="text-2xl md:text-[32px] lg:text-[36px] font-bold text-white mb-1 leading-none drop-shadow-lg whitespace-nowrap">
            Explore Islam's Five Pillars Through Quranic Verses & Sahih Hadith
          </h1>

          {/* Subtitle - 14-16px, subtle opacity */}
          <p className="text-xs md:text-sm lg:text-base text-gray-300/75 font-light max-w-3xl mx-auto mb-1.5">
            A curated selection of authentic connections from primary Islamic sources
          </p>

          {/* CTA - 12-14px, light blue */}
          <div className="flex items-center justify-center text-cyan-400/90 pointer-events-auto">
            <span className="text-xs md:text-sm font-normal drop-shadow-md">
              ↓ Click any node below to begin exploring
            </span>
          </div>

        </div>
      </div>
    </>
  )
}
