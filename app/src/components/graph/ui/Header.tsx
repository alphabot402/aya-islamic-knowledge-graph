/**
 * Header Component
 * Centered, clean design with title and stats always visible
 * Night-time celestial aesthetic
 */

'use client'

interface HeaderProps {
  className?: string
}

export default function Header({ className = '' }: HeaderProps) {
  return (
    <div className={`absolute top-0 left-0 right-0 z-20 pointer-events-none ${className}`}>
      {/* Centered container */}
      <div className="flex flex-col items-center justify-center pt-6 pb-4 px-4">
        {/* Title - Large and centered */}
        <div className="flex items-center gap-3 md:gap-4 mb-4">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-blue-100 to-amber-200 tracking-tight drop-shadow-[0_0_20px_rgba(147,197,253,0.6)]">
            AYA
          </h1>
          <span className="text-5xl md:text-6xl lg:text-7xl font-arabic text-blue-100 drop-shadow-[0_0_20px_rgba(191,219,254,0.6)]">آية</span>
        </div>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-blue-200/90 mb-4 drop-shadow-lg">
          Islamic Knowledge Navigator
        </p>

        {/* Stats - Always visible, clean row */}
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 text-sm md:text-base mb-3">
          <div className="px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-blue-300/30 text-blue-200 shadow-[0_0_20px_rgba(147,197,253,0.2)]">
            <span className="font-semibold">114</span> Quran chapters
          </div>
          <span className="text-blue-300/50 hidden sm:inline">•</span>
          <div className="px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-amber-300/30 text-amber-200 shadow-[0_0_20px_rgba(251,191,36,0.2)]">
            <span className="font-semibold">72</span> hadiths
          </div>
          <span className="text-blue-300/50 hidden sm:inline">•</span>
          <div className="px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-teal-300/30 text-teal-200 shadow-[0_0_20px_rgba(20,184,166,0.2)]">
            <span className="font-semibold">101</span> connections
          </div>
        </div>

        {/* Quick guide hint */}
        <div className="text-xs md:text-sm text-blue-300/60">
          Click nodes • Drag to explore • Scroll to zoom
        </div>
      </div>
    </div>
  )
}
