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
      {/* Premium centered header with enhanced richness */}
      <div className="flex flex-col items-center justify-center pt-4 pb-2 px-4">
        {/* Title - Large and centered with enhanced glow */}
        <div className="flex items-center gap-3 md:gap-4 mb-3">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-blue-100 to-amber-200 tracking-tight drop-shadow-[0_0_25px_rgba(147,197,253,0.8)] [text-shadow:0_0_40px_rgba(59,130,246,0.4)]">
            AYA
          </h1>
          <span className="text-5xl md:text-6xl lg:text-7xl font-arabic text-blue-100 drop-shadow-[0_0_25px_rgba(191,219,254,0.8)] [text-shadow:0_0_40px_rgba(147,197,253,0.4)]">آية</span>
        </div>

        {/* Premium tagline with nuanced richness */}
        <div className="relative">
          {/* Subtle backdrop glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent blur-xl"></div>

          {/* Tagline with enhanced typography and multi-layer glow */}
          <p className="relative text-base md:text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-blue-200 to-amber-300 text-center max-w-3xl px-6 tracking-wide drop-shadow-[0_0_12px_rgba(147,197,253,0.8)] [text-shadow:0_0_20px_rgba(59,130,246,0.5),0_0_35px_rgba(251,191,36,0.3)]">
            Discover Quran & Hadith by Five Pillars
          </p>

          {/* Decorative underline accent */}
          <div className="mx-auto mt-2 w-24 h-[2px] bg-gradient-to-r from-transparent via-blue-400/60 to-transparent shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
        </div>
      </div>
    </div>
  )
}
