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
    <div className={`fixed bottom-2 left-2 md:left-4 z-30 pointer-events-none ${className}`}>
      <div className="bg-black/60 backdrop-blur-lg border border-blue-300/20 rounded-lg px-3 py-1.5 shadow-lg">
        <p className="text-[10px] text-blue-200/90 font-medium whitespace-nowrap">
          Click nodes • Drag • Zoom
        </p>
      </div>
    </div>
  )
}
