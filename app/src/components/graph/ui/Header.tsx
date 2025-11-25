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
      {/* Compact centered header */}
      <div className="flex flex-col items-center justify-center pt-4 pb-2 px-4">
        {/* Title - Large and centered */}
        <div className="flex items-center gap-3 md:gap-4 mb-2">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-blue-100 to-amber-200 tracking-tight drop-shadow-[0_0_20px_rgba(147,197,253,0.6)]">
            AYA
          </h1>
          <span className="text-5xl md:text-6xl lg:text-7xl font-arabic text-blue-100 drop-shadow-[0_0_20px_rgba(191,219,254,0.6)]">آية</span>
        </div>

        {/* Single concise tagline */}
        <p className="text-sm md:text-base text-blue-200/80 text-center max-w-3xl px-4 drop-shadow-lg">
          Quranic wisdom and prophetic traditions mapped across the Five Pillars
        </p>
      </div>
    </div>
  )
}
