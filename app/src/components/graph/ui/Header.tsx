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

        {/* Subtitle */}
        <p className="text-base md:text-lg text-blue-200/90 mb-1 drop-shadow-lg">
          Islamic Knowledge Navigator
        </p>

        {/* Single concise description */}
        <p className="text-xs md:text-sm text-blue-300/70 text-center max-w-2xl">
          Exploring 114 Quranic surahs connected to 72 verified hadiths through 101 scholarly links
        </p>
      </div>
    </div>
  )
}
