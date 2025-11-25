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
    <div className={`fixed bottom-2 left-1/2 -translate-x-1/2 z-30 pointer-events-none ${className}`}>
      <div className="bg-black/60 backdrop-blur-lg border border-blue-300/20 rounded-full px-3 py-1.5 shadow-lg">
        <p className="text-[10px] md:text-xs text-blue-300/80 whitespace-nowrap">
          Click nodes • Drag • Zoom
        </p>
      </div>
    </div>
  )
}
