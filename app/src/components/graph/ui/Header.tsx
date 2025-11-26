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
    <div className={`absolute top-0 left-0 right-0 z-20 pointer-events-none ${className}`}>
      <div className="text-center max-w-2xl mx-auto py-6 md:py-12 px-4">

        {/* The Scholar's Anchor */}
        <span className="text-xs font-medium tracking-[0.2em] text-gray-500 uppercase mb-4 block">
          Al-Masadir • The Authentic Sources
        </span>

        {/* The Product's Value Proposition */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 md:mb-6 leading-tight">
          The Scriptural Architecture <br />
          <span className="text-slate-700">of the Five Pillars</span>
        </h1>

        {/* The Nuanced Explanation */}
        <p className="text-base md:text-lg text-slate-600 leading-relaxed font-light">
          A curated mapping of primary evidences (<span className="italic">Adillah</span>),
          selected to bridge the gap between sacred text and structural understanding.
          Explore the mandates, wisdoms, and rewards that form the foundation of your faith.
        </p>

      </div>
    </div>
  )
}
