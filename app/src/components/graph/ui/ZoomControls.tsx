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
      {/* Vertical stack - responsive sizing */}
      <div className="bg-black/85 md:bg-black/70 backdrop-blur-lg border border-blue-300/30 rounded-lg md:rounded-xl p-1 md:p-2 shadow-xl">
        <div className="flex flex-col gap-1 md:gap-1.5">
          {/* Zoom In - responsive sizing with tooltip */}
          <button
            onClick={onZoomIn}
            className="w-9 md:w-11 h-9 md:h-11 flex items-center justify-center rounded-md md:rounded-lg bg-blue-500/30 hover:bg-blue-500/50 border-2 border-blue-400/40 hover:border-blue-400/70 transition-all duration-200 hover:shadow-[0_0_16px_rgba(96,165,250,0.6)] active:scale-95"
            aria-label="Zoom in"
            title="Zoom In"
          >
            <span className="text-lg md:text-xl text-blue-100 font-bold drop-shadow-md">+</span>
          </button>

          {/* Zoom Out - responsive sizing with tooltip */}
          <button
            onClick={onZoomOut}
            className="w-9 md:w-11 h-9 md:h-11 flex items-center justify-center rounded-md md:rounded-lg bg-blue-500/30 hover:bg-blue-500/50 border-2 border-blue-400/40 hover:border-blue-400/70 transition-all duration-200 hover:shadow-[0_0_16px_rgba(96,165,250,0.6)] active:scale-95"
            aria-label="Zoom out"
            title="Zoom Out"
          >
            <span className="text-lg md:text-xl text-blue-100 font-bold drop-shadow-md">−</span>
          </button>

          {/* Divider - more visible */}
          <div className="h-px bg-blue-300/30"></div>

          {/* Reset View - responsive sizing with tooltip */}
          <button
            onClick={onReset}
            className="w-9 md:w-11 h-9 md:h-11 flex items-center justify-center rounded-md md:rounded-lg bg-teal-500/30 hover:bg-teal-500/50 border-2 border-teal-400/40 hover:border-teal-400/70 transition-all duration-200 hover:shadow-[0_0_16px_rgba(20,184,166,0.6)] active:scale-95"
            aria-label="Reset view"
            title="Reset View"
          >
            <span className="text-base md:text-lg text-teal-100 drop-shadow-md">⟲</span>
          </button>
        </div>
      </div>
    </div>
  )
}
