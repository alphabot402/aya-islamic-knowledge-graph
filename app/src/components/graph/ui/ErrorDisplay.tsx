/**
 * ErrorDisplay Component
 * Error message display for graph loading failures
 * New component for proper error handling
 */

'use client'

interface ErrorDisplayProps {
  error: Error | string
  onRetry?: () => void
}

export default function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  const errorMessage = typeof error === 'string' ? error : error.message

  return (
    <div className="absolute top-36 left-1/2 -translate-x-1/2 bg-black/90 backdrop-blur-md border border-red-500/40 rounded-lg px-4 py-3 shadow-lg max-w-md">
      <div className="text-red-400 text-sm font-semibold mb-2">
        Failed to load graph data
      </div>
      <div className="text-gray-300 text-xs mb-3">{errorMessage}</div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-3 py-1.5 bg-red-500/20 border border-red-500/40 rounded text-xs text-red-300 hover:bg-red-500/30 transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  )
}
