/**
 * ZoomControls Component
 * Beautiful, mobile-friendly zoom controls for the 3D graph
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
    <div className={`fixed right-4 bottom-20 md:bottom-4 z-30 ${className}`}>
      <div className="flex flex-col gap-2">
        {/* Glass morphism container with glow */}
        <div className="bg-black/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-2 shadow-2xl shadow-purple-500/20">
          {/* Zoom In */}
          <button
            onClick={onZoomIn}
            className="group relative w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 hover:from-purple-500/40 hover:to-purple-600/40 border border-purple-400/30 hover:border-purple-400/60 transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] active:scale-95"
            aria-label="Zoom in"
          >
            <span className="text-2xl text-purple-300 group-hover:text-purple-200 transition-colors drop-shadow-[0_0_8px_rgba(216,180,254,0.8)]">+</span>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-400/0 to-purple-600/0 group-hover:from-purple-400/10 group-hover:to-purple-600/10 transition-all duration-300"></div>
          </button>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent my-2"></div>

          {/* Zoom Out */}
          <button
            onClick={onZoomOut}
            className="group relative w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 hover:from-purple-500/40 hover:to-purple-600/40 border border-purple-400/30 hover:border-purple-400/60 transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] active:scale-95"
            aria-label="Zoom out"
          >
            <span className="text-2xl text-purple-300 group-hover:text-purple-200 transition-colors drop-shadow-[0_0_8px_rgba(216,180,254,0.8)]">−</span>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-400/0 to-purple-600/0 group-hover:from-purple-400/10 group-hover:to-purple-600/10 transition-all duration-300"></div>
          </button>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent my-2"></div>

          {/* Reset View */}
          <button
            onClick={onReset}
            className="group relative w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-teal-500/20 to-teal-600/20 hover:from-teal-500/40 hover:to-teal-600/40 border border-teal-400/30 hover:border-teal-400/60 transition-all duration-300 hover:shadow-[0_0_20px_rgba(20,184,166,0.5)] active:scale-95"
            aria-label="Reset view"
          >
            <span className="text-xl text-teal-300 group-hover:text-teal-200 transition-colors drop-shadow-[0_0_8px_rgba(20,184,166,0.8)]">⟲</span>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-teal-400/0 to-teal-600/0 group-hover:from-teal-400/10 group-hover:to-teal-600/10 transition-all duration-300"></div>
          </button>
        </div>

        {/* Hint text - desktop only */}
        <div className="hidden md:block text-center text-xs text-gray-500 px-2">
          or scroll
        </div>
      </div>
    </div>
  )
}
