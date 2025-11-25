/**
 * Tests for useNodeSelection hook
 */

import { renderHook, act } from '@testing-library/react'
import { useNodeSelection } from '../useNodeSelection'
import { mockSurahNode, mockHadithNode } from '@/test-utils/mocks'

describe('useNodeSelection', () => {
  it('should initialize with null selected and hovered nodes', () => {
    const { result } = renderHook(() => useNodeSelection())

    expect(result.current.selectedNode).toBeNull()
    expect(result.current.hoveredNode).toBeNull()
  })

  it('should select a node', () => {
    const { result } = renderHook(() => useNodeSelection())

    act(() => {
      result.current.handleNodeSelect(mockSurahNode)
    })

    expect(result.current.selectedNode).toEqual(mockSurahNode)
  })

  it('should deselect a node when clicking the same node', () => {
    const { result } = renderHook(() => useNodeSelection())

    act(() => {
      result.current.handleNodeSelect(mockSurahNode)
    })

    expect(result.current.selectedNode).toEqual(mockSurahNode)

    act(() => {
      result.current.handleNodeSelect(mockSurahNode)
    })

    expect(result.current.selectedNode).toBeNull()
  })

  it('should switch selection when selecting different node', () => {
    const { result } = renderHook(() => useNodeSelection())

    act(() => {
      result.current.handleNodeSelect(mockSurahNode)
    })

    expect(result.current.selectedNode).toEqual(mockSurahNode)

    act(() => {
      result.current.handleNodeSelect(mockHadithNode)
    })

    expect(result.current.selectedNode).toEqual(mockHadithNode)
  })

  it('should handle node hover', () => {
    const { result } = renderHook(() => useNodeSelection())

    act(() => {
      result.current.handleNodeHover(mockSurahNode)
    })

    expect(result.current.hoveredNode).toEqual(mockSurahNode)
  })

  it('should clear hover when passing null', () => {
    const { result } = renderHook(() => useNodeSelection())

    act(() => {
      result.current.handleNodeHover(mockSurahNode)
    })

    expect(result.current.hoveredNode).toEqual(mockSurahNode)

    act(() => {
      result.current.handleNodeHover(null)
    })

    expect(result.current.hoveredNode).toBeNull()
  })

  it('should clear selection with clearSelection', () => {
    const { result } = renderHook(() => useNodeSelection())

    act(() => {
      result.current.handleNodeSelect(mockSurahNode)
    })

    expect(result.current.selectedNode).toEqual(mockSurahNode)

    act(() => {
      result.current.clearSelection()
    })

    expect(result.current.selectedNode).toBeNull()
  })

  it('should allow independent selection and hover', () => {
    const { result } = renderHook(() => useNodeSelection())

    act(() => {
      result.current.handleNodeSelect(mockSurahNode)
      result.current.handleNodeHover(mockHadithNode)
    })

    expect(result.current.selectedNode).toEqual(mockSurahNode)
    expect(result.current.hoveredNode).toEqual(mockHadithNode)
  })

  it('should maintain hover when selection changes', () => {
    const { result } = renderHook(() => useNodeSelection())

    act(() => {
      result.current.handleNodeHover(mockHadithNode)
      result.current.handleNodeSelect(mockSurahNode)
    })

    expect(result.current.selectedNode).toEqual(mockSurahNode)
    expect(result.current.hoveredNode).toEqual(mockHadithNode)
  })

  it('should handle null node selection', () => {
    const { result } = renderHook(() => useNodeSelection())

    act(() => {
      result.current.handleNodeSelect(mockSurahNode)
      result.current.handleNodeSelect(null)
    })

    expect(result.current.selectedNode).toBeNull()
  })
})
