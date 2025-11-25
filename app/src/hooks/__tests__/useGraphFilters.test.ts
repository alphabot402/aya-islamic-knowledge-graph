/**
 * Tests for useGraphFilters hook
 */

import { renderHook, act } from '@testing-library/react'
import { useGraphFilters } from '../useGraphFilters'
import { mockNodes } from '@/test-utils/mocks'

describe('useGraphFilters', () => {
  it('should initialize with empty search and all filter', () => {
    const { result } = renderHook(() => useGraphFilters(mockNodes))

    expect(result.current.searchQuery).toBe('')
    expect(result.current.pillarFilter).toBe('all')
    expect(result.current.filteredNodes).toEqual(mockNodes)
  })

  it('should filter nodes by search query (surah number)', () => {
    const { result } = renderHook(() => useGraphFilters(mockNodes))

    act(() => {
      result.current.setSearchQuery('1')
    })

    // Should match surah-1 and hadith-1 (both contain "1")
    expect(result.current.filteredNodes.length).toBeGreaterThanOrEqual(1)
    const surahNode = result.current.filteredNodes.find(n => n.id === 'surah-1')
    expect(surahNode).toBeDefined()
  })

  it('should filter nodes by search query (surah name)', () => {
    const { result } = renderHook(() => useGraphFilters(mockNodes))

    act(() => {
      result.current.setSearchQuery('baqarah')
    })

    // Should match Al-Baqarah
    expect(result.current.filteredNodes).toHaveLength(1)
    expect(result.current.filteredNodes[0].id).toBe('surah-2')
  })

  it('should filter nodes by search query (hadith text)', () => {
    const { result } = renderHook(() => useGraphFilters(mockNodes))

    act(() => {
      result.current.setSearchQuery('intentions')
    })

    // Should match the hadith with "intentions" in text
    expect(result.current.filteredNodes).toHaveLength(1)
    expect(result.current.filteredNodes[0].type).toBe('hadith')
  })

  it('should filter nodes by pillar', () => {
    const { result } = renderHook(() => useGraphFilters(mockNodes))

    act(() => {
      result.current.setPillarFilter('shahada')
    })

    // Should match surah-1 and surah-3 (both shahada) and hadith (always included)
    expect(result.current.filteredNodes).toHaveLength(3)
    const surahNodes = result.current.filteredNodes.filter(n => n.type === 'surah')
    expect(surahNodes.every(n => n.type === 'surah' && n.pillar === 'shahada')).toBe(true)
  })

  it('should combine search query and pillar filter', () => {
    const { result } = renderHook(() => useGraphFilters(mockNodes))

    act(() => {
      result.current.setPillarFilter('shahada')
      result.current.setSearchQuery('Fatihah')
    })

    // Should match only surah-1 (shahada pillar and contains "Fatihah")
    expect(result.current.filteredNodes).toHaveLength(1)
    expect(result.current.filteredNodes[0].id).toBe('surah-1')
  })

  it('should handle empty search query', () => {
    const { result } = renderHook(() => useGraphFilters(mockNodes))

    act(() => {
      result.current.setSearchQuery('test')
      result.current.setSearchQuery('')
    })

    // Should show all nodes when search is cleared
    expect(result.current.filteredNodes).toEqual(mockNodes)
  })

  it('should handle whitespace-only search query', () => {
    const { result } = renderHook(() => useGraphFilters(mockNodes))

    act(() => {
      result.current.setSearchQuery('   ')
    })

    // Should show all nodes for whitespace-only query
    expect(result.current.filteredNodes).toEqual(mockNodes)
  })

  it('should be case-insensitive for search', () => {
    const { result } = renderHook(() => useGraphFilters(mockNodes))

    act(() => {
      result.current.setSearchQuery('BAQARAH')
    })

    // Should match Al-Baqarah regardless of case
    expect(result.current.filteredNodes).toHaveLength(1)
    expect(result.current.filteredNodes[0].id).toBe('surah-2')
  })

  it('should reset to all nodes when filter is set to "all"', () => {
    const { result } = renderHook(() => useGraphFilters(mockNodes))

    act(() => {
      result.current.setPillarFilter('shahada')
      result.current.setPillarFilter('all')
    })

    // Should show all nodes
    expect(result.current.filteredNodes).toEqual(mockNodes)
  })

  it('should return empty array when no matches found', () => {
    const { result } = renderHook(() => useGraphFilters(mockNodes))

    act(() => {
      result.current.setSearchQuery('nonexistent')
    })

    expect(result.current.filteredNodes).toHaveLength(0)
  })
})
