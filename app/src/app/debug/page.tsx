'use client'

import { useGraphData } from '@/hooks/useGraphData.orbital'

export default function DebugPage() {
  const { nodes, isLoading, error } = useGraphData()

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">Graph Data Debug Page</h1>

      <div className="space-y-6">
        {/* Loading State */}
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Loading State:</h2>
          <p className={isLoading ? 'text-yellow-400' : 'text-green-400'}>
            {isLoading ? 'Loading...' : 'Loaded'}
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-900 p-4 rounded">
            <h2 className="text-xl font-semibold mb-2">Error:</h2>
            <pre className="text-sm overflow-auto">{error.message}</pre>
          </div>
        )}

        {/* Nodes Count */}
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Total Nodes:</h2>
          <p className="text-3xl font-bold text-teal-400">{nodes.length}</p>
        </div>

        {/* Node Type Breakdown */}
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Node Types:</h2>
          <div className="space-y-2">
            <p>
              Surah Nodes:{' '}
              <span className="text-teal-400 font-bold">
                {nodes.filter(n => n.type === 'surah').length}
              </span>
            </p>
            <p>
              Hadith Nodes:{' '}
              <span className="text-gold-400 font-bold">
                {nodes.filter(n => n.type === 'hadith').length}
              </span>
            </p>
          </div>
        </div>

        {/* Sample Nodes */}
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Sample Nodes (First 5):</h2>
          <div className="space-y-4 text-xs">
            {nodes.slice(0, 5).map(node => (
              <div key={node.id} className="bg-gray-700 p-3 rounded">
                <p className="font-semibold">{node.id}</p>
                <p>Type: {node.type}</p>
                <p>Position: [{node.position.join(', ')}]</p>
                {node.type === 'surah' && (
                  <>
                    <p>Surah Number: {node.surahNumber}</p>
                    <p>Pillar: {node.pillar}</p>
                  </>
                )}
                {node.type === 'hadith' && (
                  <>
                    <p>Hadith ID: {node.hadith.idInBook}</p>
                    <p>Connections: {node.connections.length}</p>
                    <p>Pillar: {node.pillar}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* All Node IDs */}
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">All Node IDs:</h2>
          <div className="text-xs max-h-96 overflow-auto">
            {nodes.map(node => (
              <div key={node.id} className="py-1">
                {node.id} - {node.type} - pos: [{node.position.map(p => p.toFixed(2)).join(', ')}]
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
