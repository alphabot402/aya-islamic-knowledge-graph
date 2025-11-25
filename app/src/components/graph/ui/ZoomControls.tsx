/**
 * ZoomControls Component
 * Compact zoom controls at bottom right
 * Night-time celestial aesthetic
 */

'use client'

interface ZoomControlsProps {
  onZoomIn: () => void
  onZoomOut: () => void
  onReset: () => void
  className?: string
}

export default function ZoomControls({ onZoomIn, onZoomOut, onReset, className = '' }: ZoomControlsProps) {
  return (
    <div className={`fixed right-2 bottom-16 z-30 ${className}`}>
      {/* Vertical stack - bottom right */}
      <div className="bg-black/70 backdrop-blur-xl border border-blue-300/20 rounded-xl p-2 shadow-2xl shadow-blue-500/10">
        <div className="flex flex-col gap-2">
          {/* Zoom In */}
          <button
            onClick={onZoomIn}
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 hover:border-blue-400/50 transition-all duration-200 hover:shadow-[0_0_15px_rgba(96,165,250,0.4)] active:scale-95"
            aria-label="Zoom in"
          >
            <span className="text-xl text-blue-200 font-bold">+</span>
          </button>

          {/* Zoom Out */}
          <button
            onClick={onZoomOut}
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 hover:border-blue-400/50 transition-all duration-200 hover:shadow-[0_0_15px_rgba(96,165,250,0.4)] active:scale-95"
            aria-label="Zoom out"
          >
            <span className="text-xl text-blue-200 font-bold">−</span>
          </button>

          {/* Divider */}
          <div className="h-px bg-blue-300/20"></div>

          {/* Reset View */}
          <button
            onClick={onReset}
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-teal-500/20 hover:bg-teal-500/30 border border-teal-400/30 hover:border-teal-400/50 transition-all duration-200 hover:shadow-[0_0_15px_rgba(20,184,166,0.4)] active:scale-95"
            aria-label="Reset view"
          >
            <span className="text-lg text-teal-200">⟲</span>
          </button>
        </div>
      </div>
    </div>
  )
}
