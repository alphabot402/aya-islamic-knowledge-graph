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
    <div className={`absolute top-0 left-0 right-0 z-20 pointer-events-none ${className}`} style={{ paddingTop: 'max(1.5rem, env(safe-area-inset-top))' }}>
      <div className="text-center max-w-2xl mx-auto py-6 md:py-12 px-4">

        {/* The Scholar's Anchor */}
        <span className="text-xs font-medium tracking-[0.2em] text-gray-500 uppercase mb-4 block">
          Al-Masadir • The Authentic Sources
        </span>

        {/* The Product's Value Proposition */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 md:mb-6 leading-tight">
          Explore Islam's Five Pillars <br />
          <span className="text-slate-700">Connected Through Sahih Hadith & Quran</span>
        </h1>

        {/* The Nuanced Explanation */}
        <p className="text-base md:text-lg text-slate-600 leading-relaxed font-light max-w-xl mx-auto">
          Explore curated connections between Quran verses and authenticated
          hadiths (Sahih Bukhari & Sahih Muslim). Click any node to discover
          the evidence, wisdom, and rewards behind each pillar.
          <br />
          <span className="text-sm text-slate-500 mt-2 block">
            This is a focused selection of primary sources—not exhaustive,
            but carefully verified for authenticity.
          </span>
        </p>

        {/* Clear Call to Action */}
        <div className="mt-6 flex items-center justify-center gap-2 text-cyan-400 pointer-events-auto">
          <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
          <span className="text-sm font-medium">
            Click any node below to begin exploring
          </span>
        </div>

      </div>
    </div>
  )
}
