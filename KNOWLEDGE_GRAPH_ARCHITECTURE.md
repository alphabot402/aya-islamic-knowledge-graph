# Islamic Knowledge Graph Architecture
## Scholarly Data Curation System

**Author Role:** Data Scientist + Islamic Scholar
**Date:** 2024-11-24
**Objective:** Design a scalable, scholarly-rigorous system for managing thousands of verse-hadith connections

---

## Table of Contents

1. [Enhanced Data Schema Design](#1-enhanced-data-schema-design)
2. [Weighted Search Algorithm](#2-weighted-search-algorithm)
3. [Future-Proofing: Concept Nodes](#3-future-proofing-concept-nodes)
4. [Implementation Roadmap](#4-implementation-roadmap)

---

# 1. Enhanced Data Schema Design

## 1.1 Core Principles

### Islamic Scholarly Methodology
- **Rigor:** Every connection must be verifiable through traditional sources
- **Transparency:** Clear attribution of scholarly opinions (not consensus fabrication)
- **Hierarchy:** Distinguish between explicit (Sarih) and implicit (Dalil) connections
- **Context:** Preserve historical and textual context of connections

### Data Science Principles
- **Scalability:** Handle 10,000+ edges without performance degradation
- **Queryability:** Enable complex graph traversals and pattern matching
- **Versioning:** Track changes to connections over time
- **Extensibility:** Support future node types (concepts, scholars, books)

---

## 1.2 Enhanced Edge Schema

### Base Schema (JSON/PostgreSQL/Neo4j Compatible)

```json
{
  "id": "edge_salah_2_43_bukhari_500",
  "version": "1.0",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z",
  "created_by": "curator_id_123",

  "nodes": {
    "source": {
      "type": "quran_verse",
      "id": "verse_2_43",
      "reference": "2:43",
      "surah": 2,
      "ayah": 43,
      "text_arabic": "وَأَقِيمُوا الصَّلَاةَ...",
      "text_english": "And establish prayer..."
    },
    "target": {
      "type": "hadith",
      "id": "hadith_bukhari_500",
      "collection": "Sahih al-Bukhari",
      "hadith_number": 500,
      "book_number": 8,
      "text_arabic_snippet": "الصلاة عماد الدين",
      "text_english_snippet": "Prayer is the pillar of religion",
      "narrator_chain": "Abu Hurairah → Ibn Shihab → Malik",
      "authentication": "sahih"
    }
  },

  "connection_metadata": {
    "pillar": "salah",
    "sub_pillars": ["establishment", "obligation"],
    "connection_strength": {
      "tier": 1,
      "confidence_score": 0.95,
      "strength_label": "explicit"
    },
    "connection_type": {
      "primary": "explicit_citation",
      "secondary": ["legal_specification", "exegetical_support"],
      "linguistic_features": [
        "shared_root_slw",
        "command_form_aqimu"
      ]
    },
    "legal_analysis": {
      "legal_function": "bayan",
      "ruling_type": "wajib",
      "madhab_positions": {
        "hanafi": "supports_fard_salah",
        "maliki": "supports_fard_salah",
        "shafii": "supports_fard_salah",
        "hanbali": "supports_fard_salah"
      },
      "areas_of_fiqh": ["ibadat", "prayer_rulings"]
    }
  },

  "verification": {
    "status": "manually_verified",
    "verification_date": "2024-01-15T10:30:00Z",
    "verified_by": ["scholar_id_456", "curator_id_123"],
    "sources": [
      {
        "type": "classical_tafsir",
        "work": "Tafsir Ibn Kathir",
        "reference": "Commentary on 2:43",
        "citation": "Ibn Kathir explicitly mentions this hadith...",
        "page": 145,
        "edition": "Dar Tayyibah, 1999"
      },
      {
        "type": "hadith_commentary",
        "work": "Fath al-Bari",
        "reference": "Commentary on Bukhari 500",
        "author": "Ibn Hajar al-Asqalani",
        "volume": 2,
        "page": 234
      },
      {
        "type": "usul_fiqh",
        "work": "Al-Risalah",
        "author": "Imam al-Shafi'i",
        "reference": "Section on Bayan",
        "relevance": "Defines the relationship between Quran and Hadith"
      }
    ],
    "scholarly_consensus": {
      "consensus_level": "ijma",
      "dissenting_views": [],
      "notes": "All four madhahib agree on this connection"
    }
  },

  "contextual_metadata": {
    "historical_context": {
      "revelation_period": "medinan",
      "hadith_narration_period": "early_medinan",
      "temporal_alignment": true,
      "historical_notes": "Both texts refer to the establishment of communal prayer in Medina"
    },
    "thematic_context": {
      "primary_theme": "establishment_of_prayer",
      "secondary_themes": ["community_worship", "zakah_obligation"],
      "related_concepts": ["khushu", "jamaah", "iqamah"]
    },
    "linguistic_context": {
      "shared_vocabulary": ["salah", "iqamah"],
      "morphological_links": [
        {
          "term": "aqimu",
          "form": "imperative_plural",
          "root": "qwm",
          "meaning": "establish/uphold"
        }
      ]
    }
  },

  "weights": {
    "base_weight": 0.95,
    "components": {
      "textual_explicitness": 1.0,
      "scholarly_consensus": 1.0,
      "source_authenticity": 1.0,
      "temporal_proximity": 0.9,
      "thematic_centrality": 0.95
    },
    "adjusted_weight": 0.95,
    "ranking_score": 950,
    "last_recalculated": "2024-01-15T10:30:00Z"
  },

  "graph_properties": {
    "directionality": "bidirectional",
    "relationship_label": "EXPLICATES",
    "inverse_relationship": "EXPLICATED_BY",
    "path_length": 1,
    "centrality_scores": {
      "betweenness": 0.0234,
      "closeness": 0.0456,
      "eigenvector": 0.0123
    }
  },

  "flags": {
    "requires_review": false,
    "disputed_connection": false,
    "pending_verification": false,
    "featured": true,
    "educational_priority": "high"
  },

  "usage_statistics": {
    "view_count": 1543,
    "citation_count": 23,
    "user_ratings": {
      "helpful": 145,
      "not_helpful": 3
    },
    "last_accessed": "2024-01-20T15:45:00Z"
  }
}
```

---

## 1.3 Schema Variants for Different Storage Systems

### PostgreSQL Schema

```sql
-- Core edges table
CREATE TABLE edges (
  id VARCHAR(255) PRIMARY KEY,
  version VARCHAR(10) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(255) NOT NULL,

  -- Source node
  source_type VARCHAR(50) NOT NULL,
  source_id VARCHAR(255) NOT NULL,
  source_reference VARCHAR(50),

  -- Target node
  target_type VARCHAR(50) NOT NULL,
  target_id VARCHAR(255) NOT NULL,
  target_reference VARCHAR(50),

  -- Connection metadata
  pillar VARCHAR(50) NOT NULL,
  tier INTEGER CHECK (tier BETWEEN 1 AND 3),
  confidence_score DECIMAL(3,2) CHECK (confidence_score BETWEEN 0 AND 1),
  strength_label VARCHAR(50),
  primary_connection_type VARCHAR(100) NOT NULL,

  -- Verification
  verification_status VARCHAR(50) DEFAULT 'pending_review',
  verification_date TIMESTAMP WITH TIME ZONE,

  -- Weights
  base_weight DECIMAL(3,2) DEFAULT 0.50,
  adjusted_weight DECIMAL(3,2) DEFAULT 0.50,
  ranking_score INTEGER DEFAULT 500,

  -- Flags
  requires_review BOOLEAN DEFAULT FALSE,
  disputed_connection BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  educational_priority VARCHAR(20) DEFAULT 'medium',

  -- Usage stats
  view_count INTEGER DEFAULT 0,
  citation_count INTEGER DEFAULT 0,
  helpful_votes INTEGER DEFAULT 0,
  not_helpful_votes INTEGER DEFAULT 0,

  -- Full data (JSONB for flexibility)
  nodes JSONB NOT NULL,
  connection_metadata JSONB NOT NULL,
  verification JSONB NOT NULL,
  contextual_metadata JSONB,
  weights JSONB NOT NULL,
  graph_properties JSONB,

  -- Indexes
  CONSTRAINT edge_source_target_unique UNIQUE (source_id, target_id, primary_connection_type)
);

-- Indexes for performance
CREATE INDEX idx_edges_pillar ON edges(pillar);
CREATE INDEX idx_edges_tier ON edges(tier);
CREATE INDEX idx_edges_source ON edges(source_type, source_id);
CREATE INDEX idx_edges_target ON edges(target_type, target_id);
CREATE INDEX idx_edges_status ON edges(verification_status);
CREATE INDEX idx_edges_weight ON edges(adjusted_weight DESC);
CREATE INDEX idx_edges_ranking ON edges(ranking_score DESC);
CREATE INDEX idx_edges_featured ON edges(featured) WHERE featured = TRUE;
CREATE INDEX idx_edges_connection_type ON edges(primary_connection_type);

-- GIN index for JSONB fields (enables JSON querying)
CREATE INDEX idx_edges_nodes_gin ON edges USING GIN (nodes);
CREATE INDEX idx_edges_metadata_gin ON edges USING GIN (connection_metadata);
CREATE INDEX idx_edges_context_gin ON edges USING GIN (contextual_metadata);

-- Full-text search on Arabic and English texts
CREATE INDEX idx_edges_arabic_fts ON edges USING GIN (
  to_tsvector('arabic',
    COALESCE(nodes->'source'->>'text_arabic', '') || ' ' ||
    COALESCE(nodes->'target'->>'text_arabic_snippet', '')
  )
);
CREATE INDEX idx_edges_english_fts ON edges USING GIN (
  to_tsvector('english',
    COALESCE(nodes->'source'->>'text_english', '') || ' ' ||
    COALESCE(nodes->'target'->>'text_english_snippet', '')
  )
);

-- Supporting tables
CREATE TABLE edge_sources (
  id SERIAL PRIMARY KEY,
  edge_id VARCHAR(255) REFERENCES edges(id) ON DELETE CASCADE,
  source_type VARCHAR(50) NOT NULL,
  work_title VARCHAR(500) NOT NULL,
  author VARCHAR(255),
  reference VARCHAR(500),
  citation TEXT,
  page INTEGER,
  volume INTEGER,
  edition VARCHAR(255),
  relevance TEXT
);

CREATE INDEX idx_edge_sources_edge ON edge_sources(edge_id);
CREATE INDEX idx_edge_sources_type ON edge_sources(source_type);

CREATE TABLE edge_tags (
  edge_id VARCHAR(255) REFERENCES edges(id) ON DELETE CASCADE,
  tag VARCHAR(100) NOT NULL,
  tag_type VARCHAR(50) NOT NULL,
  PRIMARY KEY (edge_id, tag)
);

CREATE INDEX idx_edge_tags_edge ON edge_tags(edge_id);
CREATE INDEX idx_edge_tags_tag ON edge_tags(tag);

CREATE TABLE edge_history (
  id SERIAL PRIMARY KEY,
  edge_id VARCHAR(255) REFERENCES edges(id) ON DELETE CASCADE,
  modified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  modified_by VARCHAR(255) NOT NULL,
  change_type VARCHAR(50) NOT NULL,
  old_value JSONB,
  new_value JSONB,
  notes TEXT
);

CREATE INDEX idx_edge_history_edge ON edge_history(edge_id);
CREATE INDEX idx_edge_history_date ON edge_history(modified_at DESC);
```

### Neo4j Cypher Schema

```cypher
// Node types
CREATE CONSTRAINT quran_verse_id IF NOT EXISTS
FOR (v:QuranVerse) REQUIRE v.id IS UNIQUE;

CREATE CONSTRAINT hadith_id IF NOT EXISTS
FOR (h:Hadith) REQUIRE h.id IS UNIQUE;

CREATE CONSTRAINT concept_id IF NOT EXISTS
FOR (c:Concept) REQUIRE c.id IS UNIQUE;

// Indexes
CREATE INDEX verse_reference IF NOT EXISTS
FOR (v:QuranVerse) ON (v.reference);

CREATE INDEX hadith_collection IF NOT EXISTS
FOR (h:Hadith) ON (h.collection);

CREATE INDEX concept_name IF NOT EXISTS
FOR (c:Concept) ON (c.name_english);

// Edge creation example
MATCH (v:QuranVerse {id: 'verse_2_43'})
MATCH (h:Hadith {id: 'hadith_bukhari_500'})
CREATE (v)-[r:EXPLICATES {
  id: 'edge_salah_2_43_bukhari_500',
  pillar: 'salah',
  tier: 1,
  confidence_score: 0.95,
  connection_type: 'explicit_citation',
  legal_function: 'bayan',
  base_weight: 0.95,
  ranking_score: 950,
  verification_status: 'manually_verified',
  created_at: datetime(),
  // Additional properties as needed
}]->(h)
RETURN r;

// Inverse relationship
MATCH (v:QuranVerse {id: 'verse_2_43'})
MATCH (h:Hadith {id: 'hadith_bukhari_500'})
CREATE (h)-[r:EXPLICATED_BY {
  id: 'edge_salah_2_43_bukhari_500_inverse',
  // Same properties
}]->(v)
RETURN r;
```

---

## 1.4 Connection Strength Classification

### Tier System (Based on Islamic Methodology)

| Tier | Strength | Arabic Term | Criteria | Weight Range | Example |
|------|----------|-------------|----------|--------------|---------|
| **1** | **Explicit** | صريح (Sarih) | Direct textual link, same vocabulary, explicit scholarly consensus | 0.80 - 1.00 | Quran command + Hadith explaining that exact command |
| **2** | **Strong Implicit** | دليل قوي (Dalil Qawi) | Shared theme, indirect textual link, majority scholarly support | 0.50 - 0.79 | Quran principle + Hadith demonstrating principle in practice |
| **3** | **Thematic** | موضوعي (Mawdu'i) | Common theme or concept, scholarly interpretation required | 0.20 - 0.49 | Quran virtue + Hadith describing similar virtue |

### Weight Calculation Formula

```python
def calculate_edge_weight(edge):
    """
    Calculate comprehensive edge weight using multiple factors

    Weight = Base_Weight * Π(Component_Multipliers) * Context_Boost
    """

    # Base weight from tier
    base_weights = {
        1: 0.90,  # Explicit
        2: 0.65,  # Strong implicit
        3: 0.40   # Thematic
    }
    base = base_weights[edge.tier]

    # Component multipliers (0.8 to 1.2)
    components = {
        'textual_explicitness': calculate_textual_score(edge),
        'scholarly_consensus': calculate_consensus_score(edge),
        'source_authenticity': calculate_authenticity_score(edge),
        'temporal_proximity': calculate_temporal_score(edge),
        'thematic_centrality': calculate_centrality_score(edge)
    }

    # Product of all multipliers
    multiplier = 1.0
    for component, score in components.items():
        multiplier *= score

    # Context boost (e.g., featured content, educational priority)
    context_boost = 1.0
    if edge.flags['featured']:
        context_boost *= 1.1
    if edge.flags['educational_priority'] == 'high':
        context_boost *= 1.05

    # Final weight (capped at 1.0)
    final_weight = min(base * multiplier * context_boost, 1.0)

    # Ranking score (for sorting, 0-1000)
    ranking_score = int(final_weight * 1000)

    return {
        'base_weight': base,
        'adjusted_weight': final_weight,
        'ranking_score': ranking_score,
        'components': components
    }
```

---

# 2. Weighted Search Algorithm

## 2.1 Five Pillars Prioritization System

### Pillar Weight Matrix

```json
{
  "pillar_weights": {
    "shahada": {
      "base_importance": 1.0,
      "frequency_multiplier": 0.3,
      "educational_priority": 1.0,
      "notes": "Foundation of Islam, but less frequent in hadith corpus"
    },
    "salah": {
      "base_importance": 0.95,
      "frequency_multiplier": 1.0,
      "educational_priority": 1.0,
      "notes": "Second pillar, most frequent in hadith"
    },
    "zakat": {
      "base_importance": 0.90,
      "frequency_multiplier": 0.7,
      "educational_priority": 0.9,
      "notes": "Third pillar, moderate frequency"
    },
    "sawm": {
      "base_importance": 0.85,
      "frequency_multiplier": 0.6,
      "educational_priority": 0.85,
      "notes": "Fourth pillar, seasonal relevance"
    },
    "hajj": {
      "base_importance": 0.80,
      "frequency_multiplier": 0.4,
      "educational_priority": 0.8,
      "notes": "Fifth pillar, limited applicability"
    },
    "general": {
      "base_importance": 0.70,
      "frequency_multiplier": 0.8,
      "educational_priority": 0.75,
      "notes": "Not specific to a pillar"
    }
  }
}
```

### User Context Weights

```json
{
  "user_contexts": {
    "new_muslim": {
      "pillar_boosts": {
        "shahada": 1.5,
        "salah": 1.3,
        "zakat": 1.0,
        "sawm": 1.0,
        "hajj": 0.8
      },
      "connection_type_preference": ["explicit_citation", "legal_specification"],
      "complexity_threshold": 0.3
    },
    "advanced_student": {
      "pillar_boosts": {
        "shahada": 1.0,
        "salah": 1.0,
        "zakat": 1.0,
        "sawm": 1.0,
        "hajj": 1.0
      },
      "connection_type_preference": ["exegetical_consensus", "historical_context"],
      "complexity_threshold": 0.7
    },
    "scholar": {
      "pillar_boosts": {
        "shahada": 1.0,
        "salah": 1.0,
        "zakat": 1.0,
        "sawm": 1.0,
        "hajj": 1.0
      },
      "connection_type_preference": ["all"],
      "complexity_threshold": 1.0
    }
  }
}
```

## 2.2 Search Algorithm Implementation

### Multi-Dimensional Ranking Algorithm

```python
from typing import List, Dict, Optional
import numpy as np

class IslamicKnowledgeGraphSearch:
    """
    Weighted search algorithm for Islamic Knowledge Graph

    Features:
    - Five Pillars prioritization
    - Textual relevance (TF-IDF)
    - Graph centrality (PageRank)
    - Scholarly consensus weighting
    - User context personalization
    - Temporal relevance (e.g., Ramadan boosts Sawm)
    """

    def __init__(self, edges: List[Dict], user_context: str = 'general'):
        self.edges = edges
        self.user_context = user_context
        self.pillar_weights = self.load_pillar_weights()
        self.context_weights = self.load_context_weights(user_context)

    def search(
        self,
        query: str,
        pillar_filter: Optional[str] = None,
        connection_type_filter: Optional[List[str]] = None,
        min_confidence: float = 0.5,
        limit: int = 20,
        seasonal_boost: bool = True
    ) -> List[Dict]:
        """
        Execute weighted search across knowledge graph

        Returns: Ranked list of edges with relevance scores
        """

        # Step 1: Filter by criteria
        candidates = self.filter_edges(
            pillar=pillar_filter,
            connection_types=connection_type_filter,
            min_confidence=min_confidence
        )

        # Step 2: Calculate multi-dimensional scores
        scored_edges = []
        for edge in candidates:
            score = self.calculate_composite_score(
                edge,
                query,
                seasonal_boost
            )
            scored_edges.append({
                'edge': edge,
                'score': score,
                'score_breakdown': score.breakdown
            })

        # Step 3: Sort by composite score
        ranked_edges = sorted(
            scored_edges,
            key=lambda x: x['score'].total,
            reverse=True
        )

        # Step 4: Apply re-ranking for diversity
        final_results = self.diversify_results(ranked_edges, limit)

        return final_results[:limit]

    def calculate_composite_score(
        self,
        edge: Dict,
        query: str,
        seasonal_boost: bool
    ) -> 'CompositeScore':
        """
        Calculate composite relevance score

        Score Components:
        1. Textual Relevance (TF-IDF)
        2. Connection Strength (edge weight)
        3. Pillar Importance (Five Pillars weighting)
        4. Scholarly Consensus (verification quality)
        5. Graph Centrality (PageRank/betweenness)
        6. User Context Fit
        7. Temporal Relevance (seasonal)
        """

        # 1. Textual Relevance (0-1)
        text_relevance = self.calculate_text_relevance(edge, query)

        # 2. Connection Strength (from edge weight)
        connection_strength = edge['weights']['adjusted_weight']

        # 3. Pillar Importance
        pillar = edge['connection_metadata']['pillar']
        pillar_score = self.pillar_weights[pillar]['base_importance']

        # Apply user context boost
        context_boost = self.context_weights['pillar_boosts'].get(pillar, 1.0)
        pillar_score *= context_boost

        # 4. Scholarly Consensus (0-1)
        consensus_score = self.calculate_consensus_score(edge)

        # 5. Graph Centrality (normalized 0-1)
        centrality_score = self.normalize_centrality(
            edge['graph_properties']['centrality_scores']
        )

        # 6. User Context Fit (0-1)
        context_fit = self.calculate_context_fit(edge)

        # 7. Temporal Relevance (1.0 baseline, up to 1.5 boost)
        temporal_score = 1.0
        if seasonal_boost:
            temporal_score = self.calculate_temporal_boost(edge)

        # Weighted combination
        weights = {
            'text': 0.25,
            'strength': 0.20,
            'pillar': 0.15,
            'consensus': 0.15,
            'centrality': 0.10,
            'context': 0.10,
            'temporal': 0.05
        }

        components = {
            'text_relevance': text_relevance,
            'connection_strength': connection_strength,
            'pillar_importance': pillar_score,
            'scholarly_consensus': consensus_score,
            'graph_centrality': centrality_score,
            'user_context_fit': context_fit,
            'temporal_relevance': temporal_score
        }

        # Calculate weighted sum
        total_score = sum(
            components[component] * weights[weight_key]
            for component, weight_key in zip(
                components.keys(),
                weights.keys()
            )
        )

        return CompositeScore(total=total_score, breakdown=components)

    def calculate_text_relevance(self, edge: Dict, query: str) -> float:
        """
        Calculate textual relevance using TF-IDF and semantic similarity
        """
        from sklearn.feature_extraction.text import TfidfVectorizer
        from sklearn.metrics.pairwise import cosine_similarity

        # Extract all text from edge
        edge_texts = [
            edge['nodes']['source'].get('text_english', ''),
            edge['nodes']['source'].get('text_arabic', ''),
            edge['nodes']['target'].get('text_english_snippet', ''),
            edge['nodes']['target'].get('text_arabic_snippet', ''),
            edge.get('notes', '')
        ]
        combined_text = ' '.join(edge_texts)

        # TF-IDF vectorization
        vectorizer = TfidfVectorizer()
        tfidf_matrix = vectorizer.fit_transform([query, combined_text])

        # Cosine similarity
        similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]

        return float(similarity)

    def calculate_consensus_score(self, edge: Dict) -> float:
        """
        Calculate scholarly consensus quality score
        """
        verification = edge['verification']

        # Base score from status
        status_scores = {
            'manually_verified': 1.0,
            'pending_review': 0.5,
            'ai_suggested': 0.3
        }
        base_score = status_scores.get(verification['status'], 0.0)

        # Boost from number of sources
        source_count = len(verification['sources'])
        source_boost = min(source_count / 3.0, 1.0)  # Cap at 3 sources

        # Boost from consensus level
        consensus_level = verification.get('scholarly_consensus', {}).get('consensus_level', '')
        consensus_boosts = {
            'ijma': 1.0,      # Unanimous consensus
            'jumhur': 0.9,    # Majority
            'mukhtalaf': 0.7  # Disputed
        }
        consensus_boost = consensus_boosts.get(consensus_level, 0.8)

        return base_score * source_boost * consensus_boost

    def normalize_centrality(self, centrality_scores: Dict) -> float:
        """
        Normalize graph centrality scores to 0-1 range
        """
        # Use weighted average of different centrality measures
        betweenness = centrality_scores.get('betweenness', 0)
        closeness = centrality_scores.get('closeness', 0)
        eigenvector = centrality_scores.get('eigenvector', 0)

        # Weighted combination
        normalized = (
            betweenness * 0.4 +
            closeness * 0.3 +
            eigenvector * 0.3
        )

        return min(normalized, 1.0)

    def calculate_context_fit(self, edge: Dict) -> float:
        """
        Calculate how well edge fits user's context/level
        """
        # Get preferred connection types for this context
        preferred_types = self.context_weights['connection_type_preference']
        edge_type = edge['connection_metadata']['connection_type']['primary']

        # Check if edge type matches preferences
        if 'all' in preferred_types or edge_type in preferred_types:
            type_fit = 1.0
        else:
            type_fit = 0.7

        # Check complexity threshold
        complexity = edge['weights']['adjusted_weight']
        threshold = self.context_weights['complexity_threshold']

        if complexity >= threshold:
            complexity_fit = 1.0
        else:
            complexity_fit = 0.8

        return (type_fit + complexity_fit) / 2.0

    def calculate_temporal_boost(self, edge: Dict) -> float:
        """
        Apply seasonal/temporal relevance boost

        Example: Boost Ramadan-related content during Ramadan
        """
        import datetime
        from hijri_converter import Hijri, Gregorian

        # Get current Hijri date
        today = datetime.date.today()
        hijri_date = Gregorian(today.year, today.month, today.day).to_hijri()

        pillar = edge['connection_metadata']['pillar']

        # Seasonal boosts
        if hijri_date.month == 9 and pillar == 'sawm':  # Ramadan
            return 1.5
        elif hijri_date.month == 12 and pillar == 'hajj':  # Dhul Hijjah
            return 1.4
        elif pillar == 'salah':  # Always relevant
            return 1.1
        else:
            return 1.0

    def diversify_results(
        self,
        ranked_edges: List[Dict],
        limit: int
    ) -> List[Dict]:
        """
        Ensure diversity in results (different pillars, connection types)

        Uses MMR (Maximal Marginal Relevance) algorithm
        """
        if len(ranked_edges) <= limit:
            return ranked_edges

        # Select top result
        selected = [ranked_edges[0]]
        remaining = ranked_edges[1:]

        while len(selected) < limit and remaining:
            # Calculate MMR for each remaining edge
            mmr_scores = []
            for edge in remaining:
                relevance = edge['score'].total

                # Calculate similarity to already selected edges
                max_similarity = max(
                    self.edge_similarity(edge['edge'], s['edge'])
                    for s in selected
                )

                # MMR formula: λ * relevance - (1-λ) * max_similarity
                lambda_param = 0.7  # Balance between relevance and diversity
                mmr = (lambda_param * relevance -
                       (1 - lambda_param) * max_similarity)

                mmr_scores.append((edge, mmr))

            # Select edge with highest MMR
            best_edge, best_score = max(mmr_scores, key=lambda x: x[1])
            selected.append(best_edge)
            remaining.remove(best_edge)

        return selected

    def edge_similarity(self, edge1: Dict, edge2: Dict) -> float:
        """
        Calculate similarity between two edges for diversity
        """
        # Same pillar?
        same_pillar = (
            edge1['connection_metadata']['pillar'] ==
            edge2['connection_metadata']['pillar']
        )

        # Same connection type?
        same_type = (
            edge1['connection_metadata']['connection_type']['primary'] ==
            edge2['connection_metadata']['connection_type']['primary']
        )

        # Connected to same verse/hadith?
        same_source = (
            edge1['nodes']['source']['id'] ==
            edge2['nodes']['source']['id']
        )
        same_target = (
            edge1['nodes']['target']['id'] ==
            edge2['nodes']['target']['id']
        )

        # Calculate similarity score
        similarity = 0.0
        if same_pillar:
            similarity += 0.3
        if same_type:
            similarity += 0.3
        if same_source or same_target:
            similarity += 0.4

        return similarity


class CompositeScore:
    """Container for composite score with breakdown"""
    def __init__(self, total: float, breakdown: Dict):
        self.total = total
        self.breakdown = breakdown

    def __repr__(self):
        return f"CompositeScore(total={self.total:.3f}, breakdown={self.breakdown})"
```

### PostgreSQL Query Example

```sql
-- Weighted search query example
WITH scored_edges AS (
  SELECT
    e.*,
    -- Text relevance (using full-text search)
    ts_rank(
      to_tsvector('english',
        COALESCE(e.nodes->'source'->>'text_english', '') || ' ' ||
        COALESCE(e.nodes->'target'->>'text_english_snippet', '')
      ),
      plainto_tsquery('english', :search_query)
    ) AS text_relevance,
    -- Connection strength
    e.adjusted_weight AS connection_strength,
    -- Pillar importance (from lookup table)
    p.base_importance * p.frequency_multiplier AS pillar_score,
    -- Scholarly consensus
    CASE
      WHEN e.verification_status = 'manually_verified' THEN 1.0
      WHEN e.verification_status = 'pending_review' THEN 0.5
      ELSE 0.3
    END * (jsonb_array_length(e.verification->'sources') / 3.0) AS consensus_score,
    -- Graph centrality (average of scores)
    (
      COALESCE((e.graph_properties->'centrality_scores'->>'betweenness')::float, 0) * 0.4 +
      COALESCE((e.graph_properties->'centrality_scores'->>'closeness')::float, 0) * 0.3 +
      COALESCE((e.graph_properties->'centrality_scores'->>'eigenvector')::float, 0) * 0.3
    ) AS centrality_score
  FROM edges e
  LEFT JOIN pillar_weights p ON e.pillar = p.pillar
  WHERE
    -- Filters
    (:pillar_filter IS NULL OR e.pillar = :pillar_filter)
    AND e.adjusted_weight >= :min_confidence
    AND e.verification_status != 'rejected'
    -- Text search filter
    AND (
      :search_query IS NULL OR
      to_tsvector('english',
        COALESCE(e.nodes->'source'->>'text_english', '') || ' ' ||
        COALESCE(e.nodes->'target'->>'text_english_snippet', '')
      ) @@ plainto_tsquery('english', :search_query)
    )
)
SELECT
  *,
  -- Composite score (weighted sum)
  (
    text_relevance * 0.25 +
    connection_strength * 0.20 +
    pillar_score * 0.15 +
    consensus_score * 0.15 +
    centrality_score * 0.10 +
    1.0 * 0.10 + -- User context fit (placeholder)
    1.0 * 0.05   -- Temporal relevance (placeholder)
  ) AS composite_score
FROM scored_edges
ORDER BY composite_score DESC
LIMIT :limit;
```

---

# 3. Future-Proofing: Concept Nodes

## 3.1 Concept Node Architecture

### What Are Concept Nodes?

**Concept Nodes** are abstract thematic entities that connect multiple verses and hadiths through shared concepts, rather than direct textual links.

**Examples:**
- **Patience (Sabr):** Connects all verses and hadiths discussing patience
- **Righteousness (Taqwa):** Connects verses and hadiths about God-consciousness
- **Justice ('Adl):** Connects legal and ethical teachings on justice

### Why Concept Nodes?

1. **Thematic Exploration:** Enable users to explore Islam by concept, not just by text
2. **Educational Pathways:** Create learning paths (e.g., "Learn about Patience")
3. **Cross-Pillar Connections:** Reveal how concepts span multiple pillars
4. **AI/ML Ready:** Foundation for semantic search and recommendation systems

---

## 3.2 Concept Node Schema

```json
{
  "id": "concept_sabr_patience",
  "version": "1.0",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z",

  "concept_metadata": {
    "name_english": "Patience",
    "name_arabic": "الصبر",
    "root_arabic": "صبر",
    "transliteration": "Sabr",
    "definition_english": "The quality of endurance in the face of difficulty while maintaining faith and avoiding complaint",
    "definition_arabic": "حبس النفس عن الجزع والتسخط",
    "quran_term_frequency": 103,
    "hadith_term_frequency": 342
  },

  "classifications": {
    "primary_category": "virtue",
    "sub_categories": ["spiritual_state", "ethical_quality"],
    "related_pillars": ["shahada", "salah", "sawm"],
    "fiqh_domains": ["aqidah", "akhlaq"],
    "theological_school": "universal"
  },

  "semantic_relationships": {
    "synonyms": [
      {
        "term_arabic": "التحمل",
        "term_english": "Forbearance",
        "strength": 0.8
      },
      {
        "term_arabic": "الصمود",
        "term_english": "Steadfastness",
        "strength": 0.7
      }
    ],
    "antonyms": [
      {
        "term_arabic": "الجزع",
        "term_english": "Panic",
        "related_concept_id": "concept_jaza_panic"
      }
    ],
    "related_concepts": [
      {
        "concept_id": "concept_tawakkul_trust",
        "relationship_type": "complementary",
        "strength": 0.9
      },
      {
        "concept_id": "concept_shukr_gratitude",
        "relationship_type": "related",
        "strength": 0.7
      }
    ],
    "parent_concepts": ["concept_iman_faith"],
    "child_concepts": [
      "concept_sabr_jameel_beautiful_patience",
      "concept_sabr_ala_taat_patience_in_obedience"
    ]
  },

  "scholarly_definitions": [
    {
      "scholar": "Ibn Qayyim al-Jawziyya",
      "work": "Madarij al-Salikin",
      "definition": "Patience is of three types: patience in obedience, patience in avoiding sin, and patience with trials",
      "reference": "Volume 2, Page 150"
    },
    {
      "scholar": "Al-Ghazali",
      "work": "Ihya Ulum al-Din",
      "definition": "Patience is the fortress of the believer and the weapon against Satan",
      "reference": "Book of Patience and Gratitude"
    }
  ],

  "graph_properties": {
    "node_type": "concept",
    "centrality_scores": {
      "betweenness": 0.156,
      "closeness": 0.234,
      "eigenvector": 0.189
    },
    "connected_verses_count": 87,
    "connected_hadiths_count": 145,
    "total_edge_count": 232,
    "average_edge_weight": 0.67
  },

  "educational_metadata": {
    "importance_level": "fundamental",
    "difficulty_level": "intermediate",
    "recommended_age": "12+",
    "learning_objectives": [
      "Understand the Islamic concept of patience",
      "Recognize different types of patience",
      "Apply patience in daily life situations"
    ],
    "related_lessons": [
      "lesson_trials_in_islam",
      "lesson_prophetic_patience"
    ]
  },

  "usage_statistics": {
    "view_count": 5432,
    "search_queries_leading_here": 287,
    "average_time_spent": 185,
    "user_ratings": {
      "helpful": 456,
      "not_helpful": 12
    }
  }
}
```

---

## 3.3 Hybrid Graph Architecture

### Three-Layer Model

```
┌─────────────────────────────────────────────────────────┐
│                  CONCEPT LAYER                          │
│         (Abstract Thematic Nodes)                       │
│                                                         │
│  [Sabr] ←─→ [Tawakkul] ←─→ [Iman] ←─→ [Shukr]        │
│    ↓            ↓             ↓            ↓           │
└────┼────────────┼─────────────┼────────────┼───────────┘
     │            │             │            │
┌────┼────────────┼─────────────┼────────────┼───────────┐
│    ↓            ↓             ↓            ↓           │
│               EDGE LAYER                                │
│     (Verse-Hadith Connections)                         │
│                                                         │
│  Edge₁ ←─→ Edge₂ ←─→ Edge₃ ←─→ Edge₄                 │
│    ↓            ↓             ↓            ↓           │
└────┼────────────┼─────────────┼────────────┼───────────┘
     │            │             │            │
┌────┼────────────┼─────────────┼────────────┼───────────┐
│    ↓            ↓             ↓            ↓           │
│               TEXT LAYER                                │
│        (Verses & Hadiths)                              │
│                                                         │
│  [Verse 2:153] [Verse 3:200] [Bukhari 52] [Muslim 44] │
└─────────────────────────────────────────────────────────┘
```

### Graph Relationships

```cypher
// Concept to Text (many-to-many)
(:Concept)-[:MENTIONS_IN]->(:QuranVerse)
(:Concept)-[:MENTIONS_IN]->(:Hadith)

// Concept to Concept (semantic relationships)
(:Concept)-[:RELATED_TO]->(:Concept)
(:Concept)-[:SYNONYM_OF]->(:Concept)
(:Concept)-[:ANTONYM_OF]->(:Concept)
(:Concept)-[:PARENT_OF]->(:Concept)
(:Concept)-[:CHILD_OF]->(:Concept)

// Edge to Concept (thematic tagging)
(:Edge)-[:TAGGED_WITH]->(:Concept)

// Existing relationships remain
(:QuranVerse)-[:EXPLICATES]->(:Hadith)
(:Hadith)-[:EXPLICATED_BY]->(:QuranVerse)

// Example query: Find all verses about Patience
MATCH (c:Concept {name_english: 'Patience'})-[:MENTIONS_IN]->(v:QuranVerse)
RETURN v
ORDER BY v.surah, v.ayah;

// Example query: Find concepts related to a verse
MATCH (v:QuranVerse {reference: '2:153'})<-[:MENTIONS_IN]-(c:Concept)
RETURN c
ORDER BY c.centrality_scores.eigenvector DESC;

// Example query: Find hadith-verse pairs connected through a concept
MATCH (c:Concept {name_english: 'Patience'})-[:MENTIONS_IN]->(v:QuranVerse)
MATCH (c)-[:MENTIONS_IN]->(h:Hadith)
MATCH path = (v)-[e:EXPLICATES*1..2]-(h)
RETURN path, e.ranking_score
ORDER BY e.ranking_score DESC
LIMIT 20;
```

---

## 3.4 Concept Extraction Strategy

### Manual Curation (Phase 1)

1. **Identify Core Concepts**
   - Start with 100 fundamental concepts
   - Focus on Quranic terms with high frequency
   - Include concepts from Islamic sciences (Aqidah, Fiqh, Akhlaq)

2. **Define Each Concept**
   - Arabic term and root
   - English translation
   - Classical scholarly definitions
   - Quranic and Hadith occurrences

3. **Tag Existing Edges**
   - Review each edge
   - Assign 1-5 relevant concepts
   - Weight concept-edge relationships

### Semi-Automated Extraction (Phase 2)

```python
def extract_concepts_from_text(text: str, language: str = 'arabic') -> List[str]:
    """
    Extract potential concepts from Quran/Hadith text

    Uses:
    - Named Entity Recognition (NER)
    - Root extraction (for Arabic)
    - Frequency analysis
    - Co-occurrence patterns
    """

    if language == 'arabic':
        # Arabic NLP pipeline
        roots = extract_arabic_roots(text)
        entities = extract_named_entities(text)

        # Filter to keep only significant theological/ethical terms
        concepts = filter_theological_terms(roots + entities)

    else:
        # English NLP pipeline
        concepts = extract_english_concepts(text)

    return concepts

def build_concept_ontology(edges: List[Dict]) -> Dict:
    """
    Build concept ontology from edge corpus

    Steps:
    1. Extract all concepts from all edges
    2. Calculate co-occurrence matrix
    3. Identify parent-child relationships
    4. Identify synonyms/antonyms
    5. Calculate concept centrality
    """

    # Extract concepts
    all_concepts = {}
    for edge in edges:
        concepts = extract_concepts_from_text(
            edge['nodes']['source']['text_arabic']
        )
        for concept in concepts:
            if concept not in all_concepts:
                all_concepts[concept] = {
                    'frequency': 0,
                    'co_occurrences': {},
                    'edges': []
                }
            all_concepts[concept]['frequency'] += 1
            all_concepts[concept]['edges'].append(edge['id'])

    # Build relationships
    ontology = build_relationships(all_concepts)

    return ontology
```

### AI-Assisted Curation (Phase 3)

```python
def ai_suggest_concept_links(
    concept: Dict,
    verses: List[Dict],
    hadiths: List[Dict]
) -> List[Dict]:
    """
    Use LLM to suggest concept-text links

    Prompt engineering for Islamic scholarship:
    - Provide concept definition
    - Ask LLM to identify relevant verses/hadiths
    - Request scholarly justification
    - Flag for human review
    """

    prompt = f"""
    You are an Islamic scholar analyzing texts for thematic connections.

    Concept: {concept['name_english']} ({concept['name_arabic']})
    Definition: {concept['definition_english']}

    Task: Identify which of the following verses mention or relate to this concept.
    For each match, provide:
    1. Relevance score (0-1)
    2. Brief scholarly justification
    3. Connection type (explicit mention / thematic implication / related concept)

    Verses:
    {format_verses(verses)}

    Output format: JSON array of matches
    """

    # Call LLM (GPT-4, Claude, etc.)
    suggestions = call_llm(prompt)

    # Flag for human review
    for suggestion in suggestions:
        suggestion['status'] = 'ai_suggested'
        suggestion['requires_review'] = True

    return suggestions
```

---

# 4. Implementation Roadmap

## Phase 1: Foundation (Months 1-3)

### Month 1: Schema Implementation
- [ ] Implement enhanced edge schema in PostgreSQL
- [ ] Add JSONB fields for flexibility
- [ ] Create indexes for performance
- [ ] Migrate existing edges to new schema
- [ ] Add weight calculation functions

### Month 2: Search Algorithm
- [ ] Implement composite scoring system
- [ ] Add Five Pillars weighting
- [ ] Create user context profiles
- [ ] Implement diversity re-ranking
- [ ] Add seasonal/temporal boosts

### Month 3: Testing & Optimization
- [ ] Performance testing with 1000+ edges
- [ ] Query optimization
- [ ] A/B testing of ranking algorithms
- [ ] User feedback collection
- [ ] Documentation

## Phase 2: Concept Nodes (Months 4-6)

### Month 4: Concept Schema
- [ ] Design concept node schema
- [ ] Implement in database
- [ ] Create concept management UI
- [ ] Start manual curation (100 core concepts)

### Month 5: Concept-Edge Linking
- [ ] Tag existing edges with concepts
- [ ] Create concept-verse relationships
- [ ] Create concept-hadith relationships
- [ ] Build concept ontology

### Month 6: Concept Search
- [ ] Extend search to concept layer
- [ ] Implement concept-based browsing
- [ ] Create concept learning paths
- [ ] User testing

## Phase 3: AI Assistance (Months 7-9)

### Month 7: NLP Pipeline
- [ ] Arabic root extraction
- [ ] Named entity recognition
- [ ] Concept extraction from texts
- [ ] Co-occurrence analysis

### Month 8: LLM Integration
- [ ] Prompt engineering for concept suggestions
- [ ] AI-assisted edge creation
- [ ] Automated tagging
- [ ] Quality scoring

### Month 9: Human-in-the-Loop
- [ ] Review interface for AI suggestions
- [ ] Approval workflow
- [ ] Scholar collaboration tools
- [ ] Feedback incorporation

## Phase 4: Scale & Polish (Months 10-12)

### Month 10: Performance
- [ ] Handle 10,000+ edges
- [ ] Sub-second search response
- [ ] Graph database optimization
- [ ] Caching strategies

### Month 11: Advanced Features
- [ ] Graph visualization
- [ ] Network analysis
- [ ] Recommendation engine
- [ ] Personalization

### Month 12: Launch
- [ ] Production deployment
- [ ] Monitoring & analytics
- [ ] User onboarding
- [ ] Marketing & outreach

---

# 5. Conclusion

## Summary

This architecture provides:

1. **Scholarly Rigor:** Every connection verified through classical sources
2. **Scalability:** Handle thousands of edges with sub-second query times
3. **Intelligence:** Multi-dimensional ranking considers textual, scholarly, and contextual factors
4. **Future-Proof:** Concept nodes enable thematic exploration and AI integration
5. **Flexibility:** JSON schema allows evolution without breaking changes

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| PostgreSQL + JSONB | Balance between structure (SQL) and flexibility (JSONB) |
| Multi-tier weight system | Captures nuance of Islamic scholarly tradition |
| Concept nodes as separate layer | Enables thematic connections without conflating with textual links |
| Human-in-the-loop AI | Maintains scholarly integrity while leveraging automation |
| Temporal boosting | Increases relevance during Ramadan, Hajj season |

## Next Steps

1. **Review this architecture** with Islamic scholars
2. **Prototype** PostgreSQL schema with 100 sample edges
3. **Implement** basic search algorithm
4. **Test** with real users
5. **Iterate** based on feedback

---

**End of Document**

*This architecture balances traditional Islamic scholarship with modern data science to create a knowledge graph that is both intellectually rigorous and technically scalable.*
