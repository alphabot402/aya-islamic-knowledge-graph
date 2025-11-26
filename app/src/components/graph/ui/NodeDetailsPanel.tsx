/**
 * NodeDetailsPanel Component - Simplified for new dataset
 * Displays basic information when a node is selected
 */

'use client'

import { GraphNode } from '@/hooks/useGraphData.orbital'
import { PILLAR_INFO } from '../nodes/SurahNode'

interface NodeDetailsPanelProps {
  node: GraphNode
  onClose: () => void
}

export default function NodeDetailsPanel({
  node,
  onClose
}: NodeDetailsPanelProps) {
  return (
    <>
      {/* Semi-transparent backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Details panel */}
      <div className="fixed left-2 right-2 bottom-14 md:top-4 md:right-4 md:left-auto md:w-96 bg-black/95 backdrop-blur-xl border border-blue-400/50 rounded-2xl shadow-2xl z-50 max-h-[60vh] md:max-h-[85vh] overflow-auto">
        <div className="p-6">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>

          {/* Header */}
          <div className="mb-4">
            <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">
              {PILLAR_INFO[node.pillar].name}
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {node.source} {node.citation}
            </h2>
            <div className="text-sm text-blue-400">{node.function}</div>
          </div>

          {/* Core Text */}
          <div className="bg-gray-900/50 rounded-lg p-4 mb-4">
            <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">Core Text</div>
            <p className="text-gray-200 leading-relaxed">{node.coreText}</p>
          </div>

          {/* Tags */}
          {node.tags && node.tags.length > 0 && (
            <div className="mb-4">
              <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">Tags</div>
              <div className="flex flex-wrap gap-2">
                {node.tags.map((tag, i) => (
                  <span key={i} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* API Link */}
          <a
            href={node.apiLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-center rounded-lg transition-colors"
          >
            View Full Reference
          </a>
        </div>
      </div>
    </>
  )
}
