'use client'

import { useState, useEffect } from 'react'
import { type Concept } from '@/app/api/concepts/route'

/**
 * ============================================================================
 * CONCEPT BROWSER COMPONENT
 * ============================================================================
 *
 * Interactive browser for exploring 30 core Islamic concepts
 * Features:
 * - Search by name or definition
 * - Filter by category, pillar, or tag
 * - Expandable concept cards with scholarly references
 * - Responsive grid layout
 */

interface ConceptBrowserProps {
  onConceptSelect?: (concept: Concept) => void
}

export default function ConceptBrowser({ onConceptSelect }: ConceptBrowserProps) {
  const [concepts, setConcepts] = useState<Concept[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedConcept, setSelectedConcept] = useState<Concept | null>(null)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('')
  const [pillarFilter, setPillarFilter] = useState<string>('')

  // Load concepts
  useEffect(() => {
    loadConcepts()
  }, [searchQuery, categoryFilter, pillarFilter])

  async function loadConcepts() {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (searchQuery) params.set('query', searchQuery)
      if (categoryFilter) params.set('category', categoryFilter)
      if (pillarFilter) params.set('pillar', pillarFilter)

      const response = await fetch(`/api/concepts?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setConcepts(data.concepts)
      } else {
        setError(data.error || 'Failed to load concepts')
      }
    } catch (err) {
      setError('Network error loading concepts')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function handleConceptClick(concept: Concept) {
    setSelectedConcept(concept)
    onConceptSelect?.(concept)
  }

  return (
    <div className="w-full h-full flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-2xl font-bold mb-4 text-teal-400">
          Islamic Concepts
        </h2>

        {/* Search */}
        <input
          type="text"
          placeholder="Search concepts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 mb-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-teal-400 text-white"
        />

        {/* Filters */}
        <div className="flex gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-teal-400 text-white"
          >
            <option value="">All Categories</option>
            <option value="spiritual_states">Spiritual States</option>
            <option value="moral_virtues">Moral Virtues</option>
            <option value="worship_states">Worship States</option>
            <option value="worship_practice">Worship Practice</option>
            <option value="aqeedah">Aqeedah (Creed)</option>
            <option value="social_ethics">Social Ethics</option>
            <option value="social_duty">Social Duty</option>
            <option value="intellectual_virtues">Intellectual Virtues</option>
            <option value="financial_virtue">Financial Virtue</option>
          </select>

          <select
            value={pillarFilter}
            onChange={(e) => setPillarFilter(e.target.value)}
            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-teal-400 text-white"
          >
            <option value="">All Pillars</option>
            <option value="shahada">Shahada</option>
            <option value="salah">Salah</option>
            <option value="zakat">Zakat</option>
            <option value="sawm">Sawm</option>
            <option value="hajj">Hajj</option>
            <option value="general">General</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading && (
          <div className="text-center py-8 text-gray-400">
            Loading concepts...
          </div>
        )}

        {error && (
          <div className="text-center py-8 text-red-400">
            {error}
          </div>
        )}

        {!loading && !error && concepts.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No concepts found
          </div>
        )}

        {!loading && !error && concepts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {concepts.map((concept) => (
              <ConceptCard
                key={concept.id}
                concept={concept}
                selected={selectedConcept?.id === concept.id}
                onClick={() => handleConceptClick(concept)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Selected Concept Detail */}
      {selectedConcept && (
        <ConceptDetailPanel
          concept={selectedConcept}
          onClose={() => setSelectedConcept(null)}
        />
      )}
    </div>
  )
}

/**
 * Individual concept card
 */
interface ConceptCardProps {
  concept: Concept
  selected: boolean
  onClick: () => void
}

function ConceptCard({ concept, selected, onClick }: ConceptCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        p-4 rounded-lg border cursor-pointer transition-all
        ${selected
          ? 'border-teal-400 bg-teal-900/20'
          : 'border-gray-700 bg-gray-800 hover:border-teal-600'
        }
      `}
    >
      {/* Arabic Name */}
      <h3 className="text-xl font-bold text-teal-400 mb-1 text-right" dir="rtl">
        {concept.arabic_name}
      </h3>

      {/* English Name */}
      <p className="text-lg font-semibold mb-2">
        {concept.english_name}
      </p>

      {/* Transliteration */}
      <p className="text-sm text-gray-400 mb-2 italic">
        {concept.transliteration}
      </p>

      {/* Root */}
      <p className="text-xs text-gray-500 mb-3">
        Root: {concept.root}
      </p>

      {/* Definition (truncated) */}
      <p className="text-sm text-gray-300 line-clamp-3">
        {concept.definition.english}
      </p>

      {/* Tags */}
      <div className="mt-3 flex flex-wrap gap-1">
        {concept.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-1 bg-gray-700 rounded"
          >
            {tag.replace(/_/g, ' ')}
          </span>
        ))}
      </div>
    </div>
  )
}

/**
 * Detailed concept panel (modal)
 */
interface ConceptDetailPanelProps {
  concept: Concept
  onClose: () => void
}

function ConceptDetailPanel({ concept, onClose }: ConceptDetailPanelProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-4 flex justify-between items-start">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-teal-400 mb-1 text-right" dir="rtl">
              {concept.arabic_name}
            </h2>
            <p className="text-xl font-semibold mb-1">
              {concept.english_name}
            </p>
            <p className="text-sm text-gray-400 italic">
              {concept.transliteration}
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Root */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-1">Root Letters</h3>
            <p className="text-lg" dir="rtl">{concept.root}</p>
          </div>

          {/* Definition - Arabic */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-1">Definition (Arabic)</h3>
            <p className="text-lg leading-relaxed" dir="rtl">{concept.definition.arabic}</p>
          </div>

          {/* Definition - English */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-1">Definition (English)</h3>
            <p className="text-base leading-relaxed">{concept.definition.english}</p>
          </div>

          {/* Category */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-1">Category</h3>
            <p className="text-base capitalize">{concept.category.replace(/_/g, ' ')}</p>
          </div>

          {/* Related Pillars */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-2">Related Pillars</h3>
            <div className="flex flex-wrap gap-2">
              {concept.related_pillars.map((pillar) => (
                <span
                  key={pillar}
                  className="px-3 py-1 bg-teal-900/30 border border-teal-600 rounded-lg capitalize"
                >
                  {pillar}
                </span>
              ))}
            </div>
          </div>

          {/* Frequency */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 mb-1">Quranic Frequency</h3>
              <p className="text-base capitalize">{concept.quranic_frequency.replace(/_/g, ' ')}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 mb-1">Hadith Frequency</h3>
              <p className="text-base capitalize">{concept.hadith_frequency.replace(/_/g, ' ')}</p>
            </div>
          </div>

          {/* Scholarly References */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-2">Scholarly References</h3>
            <div className="space-y-3">
              {concept.scholarly_references.map((ref, index) => (
                <div
                  key={index}
                  className="p-3 bg-gray-800 border border-gray-700 rounded-lg"
                >
                  <p className="font-semibold text-teal-400">{ref.work}</p>
                  {ref.author && (
                    <p className="text-sm text-gray-400">by {ref.author}</p>
                  )}
                  {ref.reference && (
                    <p className="text-sm text-gray-300">Reference: {ref.reference}</p>
                  )}
                  {ref.hadith_number && (
                    <p className="text-sm text-gray-300">Hadith #{ref.hadith_number}</p>
                  )}
                  {ref.volume && (
                    <p className="text-sm text-gray-300">Volume {ref.volume}</p>
                  )}
                  {ref.note && (
                    <p className="text-sm text-gray-300 mt-1">{ref.note}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {concept.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-800 border border-gray-700 rounded"
                >
                  {tag.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
