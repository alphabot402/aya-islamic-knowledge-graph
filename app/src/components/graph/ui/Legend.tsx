/**
 * Legend Component
 * Visual guide showing Surah vs Hadith color coding
 */

'use client'

interface LegendProps {
  className?: string
}

export default function Legend({ className = '' }: LegendProps) {
  return (
    <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-20 pointer-events-none ${className}`}>
      <div className="bg-black/50 backdrop-blur-lg border border-blue-300/20 rounded-full px-4 py-2 shadow-lg">
        <div className="flex items-center gap-4 text-xs">
          {/* Surah indicator */}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]"></div>
            <span className="text-blue-200/90 font-medium">Surahs</span>
          </div>

          {/* Divider */}
          <div className="w-px h-4 bg-blue-300/30"></div>

          {/* Hadith indicator */}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]"></div>
            <span className="text-amber-200/90 font-medium">Hadith</span>
          </div>
        </div>
      </div>
    </div>
  )
}
