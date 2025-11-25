/**
 * Tests for LoadingIndicator component
 */

import { render, screen } from '@/test-utils'
import LoadingIndicator from '../LoadingIndicator'

describe('LoadingIndicator', () => {
  it('should render loading message', () => {
    render(<LoadingIndicator />)

    expect(screen.getByText('Loading Islamic Knowledge Graph...')).toBeInTheDocument()
  })

  it('should have correct styling classes', () => {
    const { container } = render(<LoadingIndicator />)

    const loadingDiv = container.querySelector('.absolute.top-36')
    expect(loadingDiv).toBeInTheDocument()
  })
})
