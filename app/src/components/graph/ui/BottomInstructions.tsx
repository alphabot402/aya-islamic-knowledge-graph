/**
 * BottomInstructions Component
 * Usage instructions displayed at the bottom center
 */

'use client'

interface BottomInstructionsProps {
  className?: string
}

export default function BottomInstructions({ className = '' }: BottomInstructionsProps) {
  return (
    <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none ${className}`}>
      <div className="bg-black/60 backdrop-blur-lg border border-blue-300/20 rounded-full px-4 py-2 shadow-lg">
        <p className="text-xs md:text-sm text-blue-300/80 whitespace-nowrap">
          Click nodes • Drag to explore • Scroll to zoom
        </p>
      </div>
    </div>
  )
}
