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
    <div className={`fixed left-1/2 -translate-x-1/2 bottom-2 z-30 pointer-events-none ${className}`}>
      {/* Bottom centered bar - Instructions */}
      <div className="bg-black/60 backdrop-blur-lg border border-blue-300/20 rounded-lg px-3 py-1.5 shadow-lg">
        <p className="text-[10px] text-blue-200/90 font-medium whitespace-nowrap">
          Click nodes • Drag • Zoom
        </p>
      </div>
    </div>
  )
}
