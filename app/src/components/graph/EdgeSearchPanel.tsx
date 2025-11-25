'use client'

import { useState } from 'react'
import { type Edge, type EdgeSearchParams } from '@/validation/edge-schemas'

/**
 * ============================================================================
 * EDGE SEARCH PANEL
 * ============================================================================
 *
 * Search interface for the Knowledge Graph edges
 * Features:
 * - Full-text search with 7-factor ranking
 * - Filter by pillar, tier, connection type
 * - Verification status filtering
 * - Real-time results with pagination
 */

interface EdgeSearchPanelProps {
  onEdgeSelect?: (edge: Edge) => void
  className?: string
}

export default function EdgeSearchPanel({ onEdgeSelect, className = '' }: EdgeSearchPanelProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<Edge[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalResults, setTotalResults] = useState(0)

  // Filters
  const [pillarFilter, setPillarFilter] = useState('')
  const [tierFilter, setTierFilter] = useState('')
  const [verificationFilter, setVerificationFilter] = useState('')
  const [featuredOnly, setFeaturedOnly] = useState(false)

  async function performSearch() {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (searchQuery) params.set('query', searchQuery)
      if (pillarFilter) params.set('pillar', pillarFilter)
      if (tierFilter) params.set('tier', tierFilter)
      if (verificationFilter) params.set('verification_status', verificationFilter)
      if (featuredOnly) params.set('featured_only', 'true')

      const response = await fetch(`/api/edges/search?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setResults(data.edges)
        setTotalResults(data.total)
      } else {
        setError(data.error || 'Search failed')
      }
    } catch (err) {
      setError('Network error')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    performSearch()
  }

  return (
    <div className={`flex flex-col bg-gray-900 text-white ${className}`}>
      {/* Search Header */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold mb-3 text-teal-400">
          Search Knowledge Graph
        </h2>

        {/* Search Form */}
        <form onSubmit={handleSearchSubmit} className="space-y-3">
          {/* Search Input */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search verses, hadiths, themes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-teal-400"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-700 rounded-lg font-semibold transition-colors"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-2 gap-2">
            <select
              value={pillarFilter}
              onChange={(e) => setPillarFilter(e.target.value)}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-teal-400"
            >
              <option value="">All Pillars</option>
              <option value="shahada">Shahada</option>
              <option value="salah">Salah</option>
              <option value="zakat">Zakat</option>
              <option value="sawm">Sawm</option>
              <option value="hajj">Hajj</option>
              <option value="general">General</option>
            </select>

            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-teal-400"
            >
              <option value="">All Tiers</option>
              <option value="1">Tier 1 - Explicit</option>
              <option value="2">Tier 2 - Strong Implicit</option>
              <option value="3">Tier 3 - Thematic</option>
            </select>

            <select
              value={verificationFilter}
              onChange={(e) => setVerificationFilter(e.target.value)}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-teal-400"
            >
              <option value="">All Verification</option>
              <option value="manually_verified">Manually Verified</option>
              <option value="pending_review">Pending Review</option>
              <option value="ai_suggested">AI Suggested</option>
            </select>

            <label className="flex items-center px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={featuredOnly}
                onChange={(e) => setFeaturedOnly(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm">Featured Only</span>
            </label>
          </div>
        </form>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto p-4">
        {error && (
          <div className="text-center py-8 text-red-400">
            {error}
          </div>
        )}

        {!loading && !error && results.length === 0 && searchQuery && (
          <div className="text-center py-8 text-gray-400">
            No results found
          </div>
        )}

        {!loading && !error && results.length === 0 && !searchQuery && (
          <div className="text-center py-8 text-gray-400">
            Enter a search query to find connections
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-4">
            <div className="text-sm text-gray-400">
              Found {totalResults} result{totalResults !== 1 ? 's' : ''}
            </div>

            {results.map((edge: any) => (
              <EdgeResultCard
                key={edge.id}
                edge={edge}
                onSelect={() => onEdgeSelect?.(edge)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Individual edge result card
 */
interface EdgeResultCardProps {
  edge: any // Edge with _search_score
  onSelect: () => void
}

function EdgeResultCard({ edge, onSelect }: EdgeResultCardProps) {
  const getTierColor = (tier: string) => {
    switch (tier) {
      case '1': return 'text-green-400'
      case '2': return 'text-yellow-400'
      case '3': return 'text-orange-400'
      default: return 'text-gray-400'
    }
  }

  const getTierLabel = (tier: string) => {
    switch (tier) {
      case '1': return 'Explicit'
      case '2': return 'Strong Implicit'
      case '3': return 'Thematic'
      default: return 'Unknown'
    }
  }

  return (
    <div
      onClick={onSelect}
      className="p-4 bg-gray-800 border border-gray-700 rounded-lg cursor-pointer hover:border-teal-600 transition-colors"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-2">
          <span className="px-2 py-1 text-xs bg-teal-900/30 border border-teal-600 rounded capitalize">
            {edge.connection_metadata.pillar}
          </span>
          <span className={`px-2 py-1 text-xs bg-gray-700 rounded ${getTierColor(edge.connection_metadata.connection_strength.tier)}`}>
            {getTierLabel(edge.connection_metadata.connection_strength.tier)}
          </span>
          {edge.flags?.featured && (
            <span className="px-2 py-1 text-xs bg-yellow-900/30 border border-yellow-600 rounded">
              Featured
            </span>
          )}
        </div>
        {edge._search_score && (
          <span className="text-xs text-gray-500">
            Score: {(edge._search_score * 100).toFixed(1)}%
          </span>
        )}
      </div>

      {/* Quran Verse */}
      <div className="mb-3">
        <div className="text-xs text-gray-400 mb-1">
          Quran {edge.nodes.source.reference}
        </div>
        <p className="text-sm text-teal-300 mb-1" dir="rtl">
          {edge.nodes.source.text_arabic}
        </p>
        <p className="text-sm text-gray-300">
          {edge.nodes.source.text_english}
        </p>
      </div>

      {/* Connection Arrow */}
      <div className="text-center text-gray-600 text-xs my-2">
        ↓ {edge.connection_metadata.connection_type.primary.replace(/_/g, ' ')} ↓
      </div>

      {/* Hadith */}
      <div>
        <div className="text-xs text-gray-400 mb-1">
          {edge.nodes.target.collection} #{edge.nodes.target.hadith_number}
        </div>
        <p className="text-sm text-gray-300 line-clamp-2">
          {edge.nodes.target.text_english_snippet}
        </p>
      </div>

      {/* Theme */}
      {edge.contextual_metadata?.thematic_context?.primary_theme && (
        <div className="mt-3 text-xs text-gray-400">
          Theme: {edge.contextual_metadata.thematic_context.primary_theme}
        </div>
      )}
    </div>
  )
}
