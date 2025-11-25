/**
 * CanvasErrorBoundary Component
 * Specialized error boundary for React Three Fiber Canvas
 *
 * Handles Canvas-specific errors:
 * - WebGL not supported
 * - GPU out of memory
 * - Geometry creation failures
 * - Texture loading failures
 * - Three.js internal errors
 */

'use client'

import { ErrorBoundary } from '../ErrorBoundary'
import { ErrorInfo } from 'react'

// ============================================================================
// ERROR TYPES
// ============================================================================

/**
 * Detect error type from error message
 */
function getCanvasErrorType(error: Error): {
  type: 'WEBGL_NOT_SUPPORTED' | 'GPU_ERROR' | 'GEOMETRY_ERROR' | 'TEXTURE_ERROR' | 'UNKNOWN'
  userMessage: string
  canRetry: boolean
} {
  const message = error.message.toLowerCase()

  if (message.includes('webgl') || message.includes('context')) {
    return {
      type: 'WEBGL_NOT_SUPPORTED',
      userMessage:
        'Your browser does not support WebGL, which is required for 3D visualization. Please use a modern browser like Chrome, Firefox, or Edge.',
      canRetry: false
    }
  }

  if (message.includes('gpu') || message.includes('memory') || message.includes('out of memory')) {
    return {
      type: 'GPU_ERROR',
      userMessage:
        'Your device ran out of graphics memory. Try closing other tabs or applications and retry.',
      canRetry: true
    }
  }

  if (message.includes('geometry') || message.includes('buffer')) {
    return {
      type: 'GEOMETRY_ERROR',
      userMessage: 'Failed to create 3D geometry. This may be a temporary issue.',
      canRetry: true
    }
  }

  if (message.includes('texture') || message.includes('image')) {
    return {
      type: 'TEXTURE_ERROR',
      userMessage: 'Failed to load graphics resources. Check your internet connection.',
      canRetry: true
    }
  }

  return {
    type: 'UNKNOWN',
    userMessage: 'An unexpected error occurred while rendering the 3D graph.',
    canRetry: true
  }
}

// ============================================================================
// CANVAS ERROR BOUNDARY COMPONENT
// ============================================================================

interface CanvasErrorBoundaryProps {
  children: React.ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

/**
 * Canvas Error Boundary
 *
 * Wraps React Three Fiber Canvas to catch rendering errors
 * and display user-friendly error messages
 */
export function CanvasErrorBoundary({ children, onError }: CanvasErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={(error, errorInfo, reset) => {
        const errorType = getCanvasErrorType(error)

        return (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-black/95 to-black/90 backdrop-blur-sm">
            <div className="bg-red-900/20 border-2 border-red-500/50 rounded-xl p-8 max-w-2xl mx-4 shadow-2xl">
              {/* Icon */}
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-red-500/20 rounded-full">
                <svg
                  className="w-10 h-10 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-red-400 text-center mb-4">
                3D Rendering Error
              </h2>

              {/* User-friendly message */}
              <p className="text-gray-300 text-center mb-6 leading-relaxed">
                {errorType.userMessage}
              </p>

              {/* Error type badge */}
              <div className="flex justify-center mb-6">
                <span className="px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-full text-xs text-red-300 font-mono">
                  Error Type: {errorType.type}
                </span>
              </div>

              {/* Technical details (collapsible) */}
              <details className="mb-6 bg-black/30 border border-red-500/20 rounded-lg overflow-hidden">
                <summary className="px-4 py-3 cursor-pointer text-sm text-gray-400 hover:text-gray-300 hover:bg-red-500/5 transition-colors">
                  <span className="font-semibold">Technical details</span>{' '}
                  <span className="text-xs">(for developers)</span>
                </summary>
                <div className="px-4 py-3 border-t border-red-500/20">
                  {/* Error message */}
                  <div className="mb-3">
                    <div className="text-xs text-red-400 font-semibold mb-1">Error Message:</div>
                    <div className="text-xs text-gray-400 font-mono bg-black/40 p-2 rounded">
                      {error.message}
                    </div>
                  </div>

                  {/* Stack trace */}
                  <div>
                    <div className="text-xs text-red-400 font-semibold mb-1">Stack Trace:</div>
                    <pre className="text-xs text-gray-500 font-mono bg-black/40 p-2 rounded overflow-auto max-h-40">
                      {error.stack}
                    </pre>
                  </div>

                  {/* Component stack (if available) */}
                  {errorInfo?.componentStack && (
                    <div className="mt-3">
                      <div className="text-xs text-red-400 font-semibold mb-1">
                        Component Stack:
                      </div>
                      <pre className="text-xs text-gray-500 font-mono bg-black/40 p-2 rounded overflow-auto max-h-32">
                        {errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>

              {/* Action buttons */}
              <div className="flex gap-3 justify-center">
                {errorType.canRetry && (
                  <button
                    onClick={reset}
                    className="px-6 py-3 bg-red-500/20 border border-red-500/40 rounded-lg text-sm font-semibold text-red-300 hover:bg-red-500/30 hover:border-red-500/60 transition-all duration-200 shadow-lg hover:shadow-red-500/20"
                  >
                    <span className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      Retry
                    </span>
                  </button>
                )}

                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-gray-700/30 border border-gray-600/40 rounded-lg text-sm font-semibold text-gray-300 hover:bg-gray-700/40 hover:border-gray-600/60 transition-all duration-200"
                >
                  <span className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Reload Page
                  </span>
                </button>
              </div>

              {/* Help text */}
              <div className="mt-6 pt-6 border-t border-red-500/20">
                <p className="text-xs text-center text-gray-500">
                  If this error persists, please try using a different browser or device.
                  {process.env.NODE_ENV === 'development' && (
                    <span className="block mt-2 text-yellow-500">
                      Development mode: Check console for detailed logs
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        )
      }}
      onError={(error, errorInfo) => {
        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
          console.group('🔴 Canvas Error Boundary')
          console.error('Error:', error)
          console.error('Error Info:', errorInfo)
          console.error('Component Stack:', errorInfo.componentStack)
          console.groupEnd()
        }

        // Call custom error handler
        onError?.(error, errorInfo)

        // TODO: Send to error tracking service
        // Example: Sentry, LogRocket, etc.
        // Sentry.captureException(error, {
        //   tags: { errorBoundary: 'CanvasErrorBoundary' },
        //   contexts: {
        //     react: { componentStack: errorInfo.componentStack }
        //   }
        // })
      }}
    >
      {children}
    </ErrorBoundary>
  )
}

// ============================================================================
// WEBGL SUPPORT CHECK
// ============================================================================

/**
 * Check if WebGL is supported
 * Can be used before rendering Canvas to show warning
 */
export function isWebGLSupported(): boolean {
  try {
    const canvas = document.createElement('canvas')
    const gl =
      canvas.getContext('webgl') ||
      canvas.getContext('webgl2') ||
      canvas.getContext('experimental-webgl')
    return !!gl
  } catch (e) {
    return false
  }
}

/**
 * Get WebGL info for debugging
 */
export function getWebGLInfo(): {
  supported: boolean
  version: 'WebGL 2' | 'WebGL 1' | 'Not Supported'
  renderer?: string
  vendor?: string
} {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')

    if (!gl) {
      return { supported: false, version: 'Not Supported' }
    }

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
    const renderer = debugInfo
      ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
      : gl.getParameter(gl.RENDERER)
    const vendor = debugInfo
      ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
      : gl.getParameter(gl.VENDOR)

    return {
      supported: true,
      version: canvas.getContext('webgl2') ? 'WebGL 2' : 'WebGL 1',
      renderer,
      vendor
    }
  } catch (e) {
    return { supported: false, version: 'Not Supported' }
  }
}
