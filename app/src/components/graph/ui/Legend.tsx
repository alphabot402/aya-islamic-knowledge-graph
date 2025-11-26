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
      {/* Centered legend - Five Pillars and Sources */}
      <div className="bg-black/70 backdrop-blur-xl border border-blue-300/30 rounded-xl px-5 py-3 shadow-2xl">
        <div className="flex flex-col gap-2.5">
          {/* THE FIVE PILLARS */}
          <div className="text-center">
            <div className="text-[10px] text-blue-200 font-bold uppercase tracking-widest mb-1.5">
              THE FIVE PILLARS
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-xs">
              <span className="flex items-center gap-1">🟣 <span className="text-purple-300 font-medium">Shahada</span></span>
              <span className="flex items-center gap-1">🔵 <span className="text-blue-300 font-medium">Salah</span></span>
              <span className="flex items-center gap-1">🟢 <span className="text-emerald-300 font-medium">Zakat</span></span>
              <span className="flex items-center gap-1">🟠 <span className="text-orange-300 font-medium">Sawm</span></span>
              <span className="flex items-center gap-1">🔴 <span className="text-red-300 font-medium">Hajj</span></span>
            </div>
          </div>

          {/* SOURCES */}
          <div className="text-center pt-1.5 border-t border-blue-400/20">
            <div className="text-[10px] text-blue-200 font-bold uppercase tracking-widest mb-1.5">
              SOURCES
            </div>
            <div className="flex items-center justify-center gap-4 text-xs">
              <span className="flex items-center gap-1">🕋 <span className="text-cyan-300 font-medium">Quran (Outer Rings)</span></span>
              <span className="flex items-center gap-1">📖 <span className="text-amber-300 font-medium">Hadith (Center Core)</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
