/**
 * LoadingIndicator Component
 * Loading state display for graph
 * Extracted from QuranGraph.tsx (lines 510-514)
 */

'use client'

export default function LoadingIndicator() {
  return (
    <div className="absolute top-36 left-1/2 -translate-x-1/2 bg-black/90 backdrop-blur-md border border-purple-500/40 rounded-lg px-4 py-2">
      <div className="text-purple-400 text-sm font-semibold">
        Loading Islamic Knowledge Graph...
      </div>
    </div>
  )
}
