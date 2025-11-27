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
    <div className={`fixed right-2 md:right-4 bottom-2 md:bottom-4 z-30 ${className}`}>
      {/* Vertical stack - compact on mobile for maximum graph space */}
      <div className="bg-black/90 md:bg-black/70 backdrop-blur-lg border border-blue-300/30 rounded-md md:rounded-xl p-1 md:p-2 shadow-xl">
        <div className="flex flex-col gap-0.5 md:gap-1.5">
          {/* Zoom In - 32px on mobile, 44px on desktop */}
          <button
            onClick={onZoomIn}
            className="w-8 md:w-11 h-8 md:h-11 flex items-center justify-center rounded md:rounded-lg bg-blue-500/30 hover:bg-blue-500/50 border-2 border-blue-400/40 hover:border-blue-400/70 transition-all duration-200 hover:shadow-[0_0_16px_rgba(96,165,250,0.6)] active:scale-95"
            aria-label="Zoom in"
            title="Zoom In"
          >
            <span className="text-base md:text-xl text-blue-100 font-bold drop-shadow-md">+</span>
          </button>

          {/* Zoom Out - 32px on mobile, 44px on desktop */}
          <button
            onClick={onZoomOut}
            className="w-8 md:w-11 h-8 md:h-11 flex items-center justify-center rounded md:rounded-lg bg-blue-500/30 hover:bg-blue-500/50 border-2 border-blue-400/40 hover:border-blue-400/70 transition-all duration-200 hover:shadow-[0_0_16px_rgba(96,165,250,0.6)] active:scale-95"
            aria-label="Zoom out"
            title="Zoom Out"
          >
            <span className="text-base md:text-xl text-blue-100 font-bold drop-shadow-md">−</span>
          </button>

          {/* Divider - more visible */}
          <div className="h-px bg-blue-300/30"></div>

          {/* Reset View - 32px on mobile, 44px on desktop */}
          <button
            onClick={onReset}
            className="w-8 md:w-11 h-8 md:h-11 flex items-center justify-center rounded md:rounded-lg bg-teal-500/30 hover:bg-teal-500/50 border-2 border-teal-400/40 hover:border-teal-400/70 transition-all duration-200 hover:shadow-[0_0_16px_rgba(20,184,166,0.6)] active:scale-95"
            aria-label="Reset view"
            title="Reset View"
          >
            <span className="text-sm md:text-lg text-teal-100 drop-shadow-md">⟲</span>
          </button>
        </div>
      </div>
    </div>
  )
}
