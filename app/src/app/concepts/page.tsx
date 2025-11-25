import ConceptBrowser from '@/components/concepts/ConceptBrowser'

/**
 * ============================================================================
 * CONCEPTS PAGE
 * ============================================================================
 *
 * Browse 30 core Islamic concepts with scholarly metadata
 * Part of the Islamic Knowledge Graph system
 */

export default function ConceptsPage() {
  return (
    <main className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-teal-400 mb-2">
            Islamic Concepts
          </h1>
          <p className="text-gray-400">
            Explore fundamental Islamic concepts with scholarly definitions and references
          </p>
        </div>
      </header>

      {/* Concept Browser */}
      <div className="max-w-7xl mx-auto p-6">
        <ConceptBrowser />
      </div>
    </main>
  )
}
