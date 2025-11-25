/**
 * Tests for ErrorDisplay component
 */

import { render, screen } from '@/test-utils'
import userEvent from '@testing-library/user-event'
import ErrorDisplay from '../ErrorDisplay'

describe('ErrorDisplay', () => {
  it('should display error message from string', () => {
    render(<ErrorDisplay error="Network error occurred" />)

    expect(screen.getByText('Failed to load graph data')).toBeInTheDocument()
    expect(screen.getByText('Network error occurred')).toBeInTheDocument()
  })

  it('should display error message from Error object', () => {
    const error = new Error('Test error message')
    render(<ErrorDisplay error={error} />)

    expect(screen.getByText('Failed to load graph data')).toBeInTheDocument()
    expect(screen.getByText('Test error message')).toBeInTheDocument()
  })

  it('should show retry button when onRetry provided', () => {
    const onRetry = jest.fn()
    render(<ErrorDisplay error="Test error" onRetry={onRetry} />)

    const retryButton = screen.getByRole('button', { name: /retry/i })
    expect(retryButton).toBeInTheDocument()
  })

  it('should not show retry button when onRetry not provided', () => {
    render(<ErrorDisplay error="Test error" />)

    const retryButton = screen.queryByRole('button', { name: /retry/i })
    expect(retryButton).not.toBeInTheDocument()
  })

  it('should call onRetry when retry button clicked', async () => {
    const user = userEvent.setup()
    const onRetry = jest.fn()

    render(<ErrorDisplay error="Test error" onRetry={onRetry} />)

    const retryButton = screen.getByRole('button', { name: /retry/i })
    await user.click(retryButton)

    expect(onRetry).toHaveBeenCalledTimes(1)
  })
})
