/**
 * Legend Component
 * Visual guide showing the Five Pillars and node types
 * Prominent display for easy understanding
 */

'use client'

interface LegendProps {
  className?: string
}

export default function Legend({ className = '' }: LegendProps) {
  return (
    <div className={`fixed left-1/2 -translate-x-1/2 bottom-12 z-30 ${className}`} style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      {/* Centered legend - Five Pillars clearly labeled */}
      <div className="bg-black/70 backdrop-blur-xl border border-blue-300/30 rounded-xl px-4 py-2.5 shadow-2xl">
        <div className="flex flex-col gap-2">
          {/* Title */}
          <div className="text-[10px] text-blue-300/80 font-semibold uppercase tracking-wider text-center border-b border-blue-400/20 pb-1.5">
            The Five Pillars
          </div>

          {/* Pillars with clear labels */}
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#9333ea] shadow-[0_0_8px_rgba(147,51,234,0.9)]"></div>
              <span className="text-xs text-purple-300 font-medium">Shahada</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#2563eb] shadow-[0_0_8px_rgba(37,99,235,0.9)]"></div>
              <span className="text-xs text-blue-300 font-medium">Salah</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#059669] shadow-[0_0_8px_rgba(5,150,105,0.9)]"></div>
              <span className="text-xs text-emerald-300 font-medium">Zakat</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#dc2626] shadow-[0_0_8px_rgba(220,38,38,0.9)]"></div>
              <span className="text-xs text-red-300 font-medium">Sawm</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#b91c1c] shadow-[0_0_8px_rgba(185,28,28,0.9)]"></div>
              <span className="text-xs text-red-400 font-medium">Hajj</span>
            </div>
          </div>

          {/* Source types */}
          <div className="flex items-center justify-center gap-4 pt-1.5 border-t border-blue-400/20">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_6px_rgba(45,212,191,0.9)]"></div>
              <span className="text-[10px] text-teal-300/90 font-medium">Quran</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.9)]"></div>
              <span className="text-[10px] text-amber-300/90 font-medium">Hadith</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
