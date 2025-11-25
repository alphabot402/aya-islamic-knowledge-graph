'use client'

import { useState } from 'react'
import QuranGraph from '@/components/graph/QuranGraph'
import EdgeSearchPanel from '@/components/graph/EdgeSearchPanel'

export default function GraphPage() {
  const [searchPanelOpen, setSearchPanelOpen] = useState(false)

  return (
    <main className="min-h-screen w-full">
      <div className="absolute inset-0 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-black/50 backdrop-blur-sm border-b border-teal-500/20">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">
              <span className="text-teal-400">AYA</span>
              <span className="text-gold-400 font-arabic mr-2">آية</span>
            </h1>
            <span className="text-gray-400 text-sm">Graph Visualization</span>
          </div>

          <div className="flex gap-2 items-center">
            <button
              onClick={() => setSearchPanelOpen(!searchPanelOpen)}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded-lg text-sm font-semibold transition-colors"
            >
              {searchPanelOpen ? 'Close Search' : 'Search Connections'}
            </button>

            <div className="flex gap-2 text-xs">
              <div className="px-3 py-1 bg-teal-500/20 border border-teal-500/30 rounded text-teal-300">
                Quran Verses
              </div>
              <div className="px-3 py-1 bg-gold-500/20 border border-gold-500/30 rounded text-gold-300">
                Hadith
              </div>
            </div>
          </div>
        </div>

        {/* Main Content with Search Panel */}
        <div className="flex-1 relative flex">
          {/* Search Panel (Collapsible) */}
          {searchPanelOpen && (
            <div className="w-96 border-r border-gray-700 bg-gray-900 overflow-hidden">
              <EdgeSearchPanel />
            </div>
          )}

          {/* Graph Container */}
          <div className="flex-1 relative">
            <QuranGraph />
          </div>
        </div>

        {/* Color Legend */}
        <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md border border-gray-500/30 rounded-lg p-3">
        <div className="text-xs text-gray-300 font-semibold mb-2">Revelation Type</div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-teal-400"></div>
            <span className="text-xs text-gray-300">Meccan</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gold-400"></div>
            <span className="text-xs text-gray-300">Medinan</span>
          </div>
        </div>
      </div>

      {/* Instructions Overlay - updated position */}
      <div className="absolute bottom-4 left-4 w-96 bg-black/70 backdrop-blur-md border border-teal-500/30 rounded-lg p-4">
          <h3 className="text-teal-400 font-semibold mb-2">Controls</h3>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• <span className="text-teal-300">Click</span> nodes to see verse details</li>
            <li>• <span className="text-teal-300">Drag</span> to move nodes</li>
            <li>• <span className="text-teal-300">Scroll</span> to zoom in/out</li>
            <li>• <span className="text-teal-300">Hover</span> for quick preview</li>
          </ul>
        </div>
      </div>
    </main>
  )
}
