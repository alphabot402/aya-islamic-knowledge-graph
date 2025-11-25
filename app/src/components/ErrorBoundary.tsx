/**
 * ErrorBoundary Component
 * Enterprise-grade error boundary for catching React render errors
 *
 * Features:
 * - Catches errors in child component tree
 * - Prevents entire app from crashing
 * - Provides user-friendly fallback UI
 * - Logs errors for monitoring
 * - Allows retry functionality
 */

'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'

// ============================================================================
// TYPES
// ============================================================================

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: (error: Error, errorInfo: ErrorInfo | null, reset: () => void) => ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  resetKeys?: Array<string | number>
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

// ============================================================================
// ERROR BOUNDARY COMPONENT
// ============================================================================

/**
 * Error Boundary Component
 *
 * Usage:
 * ```tsx
 * <ErrorBoundary
 *   fallback={(error, errorInfo, reset) => (
 *     <div>
 *       <h1>Error occurred</h1>
 *       <p>{error.message}</p>
 *       <button onClick={reset}>Try again</button>
 *     </div>
 *   )}
 *   onError={(error, errorInfo) => {
 *     // Log to error tracking service
 *     console.error('Error caught:', error, errorInfo)
 *   }}
 * >
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  /**
   * Update state when error is caught
   */
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    }
  }

  /**
   * Called after error is caught
   * Used for logging and side effects
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Store error info in state
    this.setState({ errorInfo })

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught error:', {
        error,
        errorInfo,
        componentStack: errorInfo.componentStack
      })
    }

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo)

    // TODO: Send to error tracking service (Sentry, etc.)
    // Example:
    // Sentry.captureException(error, {
    //   contexts: {
    //     react: {
    //       componentStack: errorInfo.componentStack
    //     }
    //   }
    // })
  }

  /**
   * Reset error boundary state
   * Allows user to retry after error
   */
  reset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  /**
   * Reset when resetKeys prop changes
   * Useful for resetting on route change or data refetch
   */
  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (
      this.state.hasError &&
      this.props.resetKeys &&
      !arraysEqual(prevProps.resetKeys, this.props.resetKeys)
    ) {
      this.reset()
    }
  }

  render() {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.state.errorInfo, this.reset)
      }

      // Default fallback UI
      return (
        <div
          style={{
            padding: '2rem',
            margin: '2rem',
            border: '2px solid #ef4444',
            borderRadius: '0.5rem',
            backgroundColor: '#fef2f2'
          }}
        >
          <h2 style={{ color: '#dc2626', marginBottom: '1rem' }}>
            Something went wrong
          </h2>
          <p style={{ color: '#7f1d1d', marginBottom: '1rem' }}>
            {this.state.error.message}
          </p>
          <details
            style={{
              marginBottom: '1rem',
              padding: '0.5rem',
              backgroundColor: '#fff',
              border: '1px solid #fecaca',
              borderRadius: '0.25rem'
            }}
          >
            <summary style={{ cursor: 'pointer', color: '#991b1b' }}>
              Technical details
            </summary>
            <pre
              style={{
                marginTop: '0.5rem',
                fontSize: '0.75rem',
                color: '#7f1d1d',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}
            >
              {this.state.error.stack}
              {this.state.errorInfo?.componentStack}
            </pre>
          </details>
          <button
            onClick={this.reset}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#dc2626',
              color: '#fff',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer'
            }}
          >
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Compare two arrays for equality
 */
function arraysEqual(a: unknown[] | undefined, b: unknown[] | undefined): boolean {
  if (a === b) return true
  if (a == null || b == null) return false
  if (a.length !== b.length) return false

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false
  }

  return true
}
