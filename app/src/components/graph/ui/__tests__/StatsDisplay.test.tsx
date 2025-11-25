/**
 * Tests for StatsDisplay component
 */

import { render, screen } from '@/test-utils'
import StatsDisplay from '../StatsDisplay'
import { mockNodes } from '@/test-utils/mocks'

describe('StatsDisplay', () => {
  it('should display correct surah count', () => {
    render(<StatsDisplay nodes={mockNodes} />)

    // mockNodes has 3 surahs
    expect(screen.getByText(/3 Surahs/)).toBeInTheDocument()
  })

  it('should display correct hadith count', () => {
    render(<StatsDisplay nodes={mockNodes} />)

    // mockNodes has 1 hadith
    expect(screen.getByText(/1 Hadiths/)).toBeInTheDocument()
  })

  it('should display correct connection count', () => {
    render(<StatsDisplay nodes={mockNodes} />)

    // mockHadithNode has 2 connections
    expect(screen.getByText(/2 Verified Connections/)).toBeInTheDocument()
  })

  it('should display all stats together', () => {
    render(<StatsDisplay nodes={mockNodes} />)

    const statsText = screen.getByText(/3 Surahs • 1 Hadiths • 2 Verified Connections/)
    expect(statsText).toBeInTheDocument()
  })

  it('should handle empty nodes array', () => {
    render(<StatsDisplay nodes={[]} />)

    expect(screen.getByText(/0 Surahs • 0 Hadiths • 0 Verified Connections/)).toBeInTheDocument()
  })

  it('should handle nodes with no connections', () => {
    const noConnectionNodes = mockNodes.filter(n => n.type === 'surah')
    render(<StatsDisplay nodes={noConnectionNodes} />)

    expect(screen.getByText(/0 Verified Connections/)).toBeInTheDocument()
  })

  it('should calculate connections from multiple hadiths', () => {
    const multipleHadithNodes = [
      ...mockNodes,
      {
        ...mockNodes[3], // Copy hadith node
        id: 'hadith-2',
        connections: ['surah-1', 'surah-2', 'surah-3'], // 3 connections
      },
    ]

    render(<StatsDisplay nodes={multipleHadithNodes} />)

    // 2 connections from hadith-1 + 3 from hadith-2 = 5 total
    expect(screen.getByText(/5 Verified Connections/)).toBeInTheDocument()
  })
})
