/**
 * Legend Component
 * Visual guide showing Surah colors, Hadith, and connections
 * Positioned at bottom right, near zoom controls
 */

'use client'

interface LegendProps {
  className?: string
}

export default function Legend({ className = '' }: LegendProps) {
  return (
    <div className={`fixed right-16 bottom-2 z-30 ${className}`}>
      {/* Vertical stack matching zoom controls style */}
      <div className="bg-black/60 backdrop-blur-lg border border-blue-300/20 rounded-lg p-1.5 shadow-lg">
        <div className="flex flex-col gap-1">
          <span className="text-[8px] text-blue-300/60 font-semibold uppercase tracking-wide text-center mb-0.5">
            Legend
          </span>

          {/* Surah - 5 Pillars colors */}
          <div className="flex items-center gap-1.5 px-2 py-1">
            <div className="flex gap-0.5">
              <div className="w-2 h-2 rounded-full bg-[#9333ea] shadow-[0_0_6px_rgba(147,51,234,0.8)]" title="Shahada"></div>
              <div className="w-2 h-2 rounded-full bg-[#2563eb] shadow-[0_0_6px_rgba(37,99,235,0.8)]" title="Salah"></div>
              <div className="w-2 h-2 rounded-full bg-[#059669] shadow-[0_0_6px_rgba(5,150,105,0.8)]" title="Zakat"></div>
              <div className="w-2 h-2 rounded-full bg-[#dc2626] shadow-[0_0_6px_rgba(220,38,38,0.8)]" title="Sawm"></div>
              <div className="w-2 h-2 rounded-full bg-[#b91c1c] shadow-[0_0_6px_rgba(185,28,28,0.8)]" title="Hajj"></div>
            </div>
            <span className="text-[10px] text-blue-200/90 font-medium">Surahs</span>
          </div>

          {/* Hadith */}
          <div className="flex items-center gap-1.5 px-2 py-1">
            <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.9)]"></div>
            <span className="text-[10px] text-amber-200/90 font-medium">Hadith</span>
          </div>

          {/* Divider */}
          <div className="h-px bg-blue-300/20 my-0.5"></div>

          {/* Connection Line */}
          <div className="flex items-center gap-1.5 px-2 py-1">
            <div className="w-4 h-[2px] bg-gradient-to-r from-blue-400 to-amber-400 shadow-[0_0_4px_rgba(251,191,36,0.6)]"></div>
            <span className="text-[10px] text-blue-200/80 font-medium">Link</span>
          </div>
        </div>
      </div>
    </div>
  )
}
