-- ============================================================================
-- Enhanced Islamic Knowledge Graph Schema
-- Migration 001: Core Edge Schema with Scholarly Metadata
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable full-text search for Arabic
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- ============================================================================
-- ENUM TYPES
-- ============================================================================

CREATE TYPE edge_tier AS ENUM ('1', '2', '3');
CREATE TYPE connection_strength AS ENUM ('explicit', 'strong_implicit', 'thematic');
CREATE TYPE connection_type AS ENUM (
  'explicit_citation',
  'implicit_chapter',
  'exegetical_consensus',
  'legal_specification',
  'historical_context',
  'liturgical_wird',
  'thematic_connection'
);
CREATE TYPE legal_function AS ENUM ('takhsis', 'taqyeed', 'bayan', 'naskh', 'none');
CREATE TYPE verification_status AS ENUM (
  'manually_verified',
  'pending_review',
  'ai_suggested',
  'disputed',
  'rejected'
);
CREATE TYPE source_type AS ENUM ('classical_tafsir', 'hadith_commentary', 'usul_fiqh', 'scholarly_work');
CREATE TYPE consensus_level AS ENUM ('ijma', 'jumhur', 'mukhtalaf', 'none');
CREATE TYPE pillar_type AS ENUM ('shahada', 'salah', 'zakat', 'sawm', 'hajj', 'general');
CREATE TYPE educational_priority AS ENUM ('high', 'medium', 'low');

-- ============================================================================
-- CORE EDGES TABLE
-- ============================================================================

CREATE TABLE edges (
  -- Primary identification
  id VARCHAR(255) PRIMARY KEY,
  version VARCHAR(10) NOT NULL DEFAULT '1.0',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(255) NOT NULL DEFAULT 'system',

  -- Source node (Quran verse)
  source_type VARCHAR(50) NOT NULL DEFAULT 'quran_verse',
  source_id VARCHAR(255) NOT NULL,
  source_reference VARCHAR(50) NOT NULL, -- e.g., "2:43"
  source_surah INTEGER CHECK (source_surah BETWEEN 1 AND 114),
  source_ayah INTEGER CHECK (source_ayah > 0),
  source_text_arabic TEXT NOT NULL,
  source_text_english TEXT NOT NULL,

  -- Target node (Hadith)
  target_type VARCHAR(50) NOT NULL DEFAULT 'hadith',
  target_id VARCHAR(255) NOT NULL,
  target_reference VARCHAR(100) NOT NULL,
  target_collection VARCHAR(100) NOT NULL,
  target_hadith_number INTEGER NOT NULL,
  target_book_number INTEGER,
  target_text_arabic TEXT NOT NULL,
  target_text_english TEXT NOT NULL,
  target_narrator VARCHAR(255),
  target_authentication VARCHAR(50),

  -- Connection metadata
  pillar pillar_type NOT NULL,
  sub_pillars TEXT[], -- Array of sub-categorizations
  tier edge_tier NOT NULL,
  confidence_score DECIMAL(3,2) CHECK (confidence_score BETWEEN 0 AND 1),
  strength_label connection_strength NOT NULL,
  primary_connection_type connection_type NOT NULL,
  secondary_connection_types connection_type[],

  -- Legal analysis
  legal_function legal_function NOT NULL DEFAULT 'none',
  ruling_type VARCHAR(50), -- wajib, mustahabb, mubah, etc.
  madhab_positions JSONB, -- Positions of four madhabs
  areas_of_fiqh TEXT[], -- ibadat, muamalat, etc.

  -- Verification
  verification_status verification_status DEFAULT 'pending_review',
  verification_date TIMESTAMP WITH TIME ZONE,
  verified_by TEXT[], -- Array of verifier IDs
  scholarly_consensus consensus_level DEFAULT 'none',
  dissenting_views TEXT[],

  -- Weights and scoring
  base_weight DECIMAL(3,2) DEFAULT 0.50 CHECK (base_weight BETWEEN 0 AND 1),
  adjusted_weight DECIMAL(3,2) DEFAULT 0.50 CHECK (adjusted_weight BETWEEN 0 AND 1),
  ranking_score INTEGER DEFAULT 500 CHECK (ranking_score BETWEEN 0 AND 1000),
  weight_components JSONB, -- Breakdown of weight calculation
  last_weight_calculation TIMESTAMP WITH TIME ZONE,

  -- Graph properties
  directionality VARCHAR(20) DEFAULT 'bidirectional',
  relationship_label VARCHAR(50) DEFAULT 'EXPLICATES',
  inverse_relationship VARCHAR(50) DEFAULT 'EXPLICATED_BY',
  path_length INTEGER DEFAULT 1,
  centrality_scores JSONB, -- betweenness, closeness, eigenvector

  -- Contextual metadata
  historical_context JSONB, -- Revelation period, temporal alignment
  thematic_context JSONB, -- Primary/secondary themes, related concepts
  linguistic_context JSONB, -- Shared vocabulary, morphological links

  -- Flags
  requires_review BOOLEAN DEFAULT FALSE,
  disputed_connection BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  educational_priority educational_priority DEFAULT 'medium',
  pending_verification BOOLEAN DEFAULT TRUE,

  -- Usage statistics
  view_count INTEGER DEFAULT 0,
  citation_count INTEGER DEFAULT 0,
  helpful_votes INTEGER DEFAULT 0,
  not_helpful_votes INTEGER DEFAULT 0,
  last_accessed TIMESTAMP WITH TIME ZONE,

  -- Full flexible data (for future extensibility)
  full_metadata JSONB,

  -- Constraints
  CONSTRAINT edge_source_target_unique UNIQUE (source_id, target_id, primary_connection_type),
  CONSTRAINT edge_confidence_valid CHECK (confidence_score IS NULL OR confidence_score BETWEEN 0 AND 1)
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Primary lookup indexes
CREATE INDEX idx_edges_pillar ON edges(pillar);
CREATE INDEX idx_edges_tier ON edges(tier);
CREATE INDEX idx_edges_source_ref ON edges(source_reference);
CREATE INDEX idx_edges_target_ref ON edges(target_reference);
CREATE INDEX idx_edges_source ON edges(source_type, source_id);
CREATE INDEX idx_edges_target ON edges(target_type, target_id);

-- Search and filtering indexes
CREATE INDEX idx_edges_status ON edges(verification_status);
CREATE INDEX idx_edges_weight ON edges(adjusted_weight DESC);
CREATE INDEX idx_edges_ranking ON edges(ranking_score DESC);
CREATE INDEX idx_edges_connection_type ON edges(primary_connection_type);
CREATE INDEX idx_edges_created ON edges(created_at DESC);

-- Partial indexes for common queries
CREATE INDEX idx_edges_featured ON edges(featured) WHERE featured = TRUE;
CREATE INDEX idx_edges_verified ON edges(verification_status) WHERE verification_status = 'manually_verified';
CREATE INDEX idx_edges_pending ON edges(pending_verification) WHERE pending_verification = TRUE;
CREATE INDEX idx_edges_high_priority ON edges(educational_priority) WHERE educational_priority = 'high';

-- Composite indexes for complex queries
CREATE INDEX idx_edges_pillar_weight ON edges(pillar, adjusted_weight DESC);
CREATE INDEX idx_edges_pillar_ranking ON edges(pillar, ranking_score DESC);
CREATE INDEX idx_edges_status_weight ON edges(verification_status, adjusted_weight DESC);

-- GIN indexes for JSONB fields
CREATE INDEX idx_edges_madhab_gin ON edges USING GIN (madhab_positions);
CREATE INDEX idx_edges_centrality_gin ON edges USING GIN (centrality_scores);
CREATE INDEX idx_edges_metadata_gin ON edges USING GIN (full_metadata);

-- Full-text search indexes
CREATE INDEX idx_edges_arabic_fts ON edges USING GIN (
  to_tsvector('arabic',
    COALESCE(source_text_arabic, '') || ' ' ||
    COALESCE(target_text_arabic, '')
  )
);

CREATE INDEX idx_edges_english_fts ON edges USING GIN (
  to_tsvector('english',
    COALESCE(source_text_english, '') || ' ' ||
    COALESCE(target_text_english, '')
  )
);

-- ============================================================================
-- SUPPORTING TABLES
-- ============================================================================

-- Verification sources table
CREATE TABLE edge_sources (
  id SERIAL PRIMARY KEY,
  edge_id VARCHAR(255) REFERENCES edges(id) ON DELETE CASCADE,
  source_type source_type NOT NULL,
  work_title VARCHAR(500) NOT NULL,
  author VARCHAR(255),
  reference VARCHAR(500),
  citation TEXT,
  page INTEGER,
  volume INTEGER,
  edition VARCHAR(255),
  relevance TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_edge_sources_edge ON edge_sources(edge_id);
CREATE INDEX idx_edge_sources_type ON edge_sources(source_type);
CREATE INDEX idx_edge_sources_work ON edge_sources(work_title);

-- Tags and categorization
CREATE TABLE edge_tags (
  edge_id VARCHAR(255) REFERENCES edges(id) ON DELETE CASCADE,
  tag VARCHAR(100) NOT NULL,
  tag_type VARCHAR(50) NOT NULL, -- theme, concept, category
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (edge_id, tag, tag_type)
);

CREATE INDEX idx_edge_tags_edge ON edge_tags(edge_id);
CREATE INDEX idx_edge_tags_tag ON edge_tags(tag);
CREATE INDEX idx_edge_tags_type ON edge_tags(tag_type);

-- Audit trail / history
CREATE TABLE edge_history (
  id SERIAL PRIMARY KEY,
  edge_id VARCHAR(255) REFERENCES edges(id) ON DELETE CASCADE,
  modified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  modified_by VARCHAR(255) NOT NULL,
  change_type VARCHAR(50) NOT NULL, -- created, updated, verified, flagged
  old_value JSONB,
  new_value JSONB,
  notes TEXT
);

CREATE INDEX idx_edge_history_edge ON edge_history(edge_id);
CREATE INDEX idx_edge_history_date ON edge_history(modified_at DESC);
CREATE INDEX idx_edge_history_change ON edge_history(change_type);

-- ============================================================================
-- CONCEPT NODES TABLE (Future-proofing)
-- ============================================================================

CREATE TABLE concepts (
  id VARCHAR(255) PRIMARY KEY,
  version VARCHAR(10) NOT NULL DEFAULT '1.0',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  -- Core identification
  name_english VARCHAR(255) NOT NULL UNIQUE,
  name_arabic VARCHAR(255) NOT NULL,
  root_arabic VARCHAR(50),
  transliteration VARCHAR(255),

  -- Definitions
  definition_english TEXT NOT NULL,
  definition_arabic TEXT,
  quran_term_frequency INTEGER DEFAULT 0,
  hadith_term_frequency INTEGER DEFAULT 0,

  -- Classifications
  primary_category VARCHAR(100), -- virtue, obligation, prohibition, etc.
  sub_categories TEXT[],
  related_pillars pillar_type[],
  fiqh_domains TEXT[], -- aqidah, fiqh, akhlaq, etc.

  -- Graph properties
  centrality_scores JSONB,
  connected_verses_count INTEGER DEFAULT 0,
  connected_hadiths_count INTEGER DEFAULT 0,
  total_edge_count INTEGER DEFAULT 0,
  average_edge_weight DECIMAL(3,2),

  -- Educational
  importance_level VARCHAR(50), -- fundamental, important, supplementary
  difficulty_level VARCHAR(50), -- beginner, intermediate, advanced
  recommended_age VARCHAR(20),

  -- Usage
  view_count INTEGER DEFAULT 0,
  search_count INTEGER DEFAULT 0,
  helpful_votes INTEGER DEFAULT 0,
  not_helpful_votes INTEGER DEFAULT 0,

  -- Full metadata
  full_metadata JSONB
);

CREATE INDEX idx_concepts_english ON concepts(name_english);
CREATE INDEX idx_concepts_arabic ON concepts(name_arabic);
CREATE INDEX idx_concepts_category ON concepts(primary_category);
CREATE INDEX idx_concepts_importance ON concepts(importance_level);
CREATE INDEX idx_concepts_metadata_gin ON concepts USING GIN (full_metadata);

-- Concept relationships
CREATE TABLE concept_relationships (
  source_concept_id VARCHAR(255) REFERENCES concepts(id) ON DELETE CASCADE,
  target_concept_id VARCHAR(255) REFERENCES concepts(id) ON DELETE CASCADE,
  relationship_type VARCHAR(50) NOT NULL, -- synonym, antonym, related, parent, child
  strength DECIMAL(3,2) CHECK (strength BETWEEN 0 AND 1),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (source_concept_id, target_concept_id, relationship_type)
);

CREATE INDEX idx_concept_rel_source ON concept_relationships(source_concept_id);
CREATE INDEX idx_concept_rel_target ON concept_relationships(target_concept_id);
CREATE INDEX idx_concept_rel_type ON concept_relationships(relationship_type);

-- Concept scholarly definitions
CREATE TABLE concept_definitions (
  id SERIAL PRIMARY KEY,
  concept_id VARCHAR(255) REFERENCES concepts(id) ON DELETE CASCADE,
  scholar VARCHAR(255) NOT NULL,
  work VARCHAR(500) NOT NULL,
  definition TEXT NOT NULL,
  reference VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_concept_defs_concept ON concept_definitions(concept_id);
CREATE INDEX idx_concept_defs_scholar ON concept_definitions(scholar);

-- Concept to edge connections
CREATE TABLE concept_edge_links (
  concept_id VARCHAR(255) REFERENCES concepts(id) ON DELETE CASCADE,
  edge_id VARCHAR(255) REFERENCES edges(id) ON DELETE CASCADE,
  relevance_score DECIMAL(3,2) CHECK (relevance_score BETWEEN 0 AND 1),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (concept_id, edge_id)
);

CREATE INDEX idx_concept_edge_concept ON concept_edge_links(concept_id);
CREATE INDEX idx_concept_edge_edge ON concept_edge_links(edge_id);
CREATE INDEX idx_concept_edge_relevance ON concept_edge_links(relevance_score DESC);

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to calculate edge weight
CREATE OR REPLACE FUNCTION calculate_edge_weight(edge_record edges)
RETURNS DECIMAL(3,2) AS $$
DECLARE
  base_weight DECIMAL(3,2);
  multiplier DECIMAL(3,2) := 1.0;
  final_weight DECIMAL(3,2);
BEGIN
  -- Base weight from tier
  base_weight := CASE edge_record.tier
    WHEN '1' THEN 0.90
    WHEN '2' THEN 0.65
    WHEN '3' THEN 0.40
    ELSE 0.50
  END;

  -- Apply verification multiplier
  multiplier := multiplier * CASE edge_record.verification_status
    WHEN 'manually_verified' THEN 1.0
    WHEN 'pending_review' THEN 0.9
    WHEN 'ai_suggested' THEN 0.7
    ELSE 0.8
  END;

  -- Apply consensus multiplier
  multiplier := multiplier * CASE edge_record.scholarly_consensus
    WHEN 'ijma' THEN 1.0
    WHEN 'jumhur' THEN 0.95
    WHEN 'mukhtalaf' THEN 0.85
    ELSE 0.9
  END;

  -- Featured boost
  IF edge_record.featured THEN
    multiplier := multiplier * 1.1;
  END IF;

  -- Calculate final weight (capped at 1.0)
  final_weight := LEAST(base_weight * multiplier, 1.0);

  RETURN final_weight;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to update edge weight
CREATE OR REPLACE FUNCTION update_edge_weight()
RETURNS TRIGGER AS $$
BEGIN
  NEW.adjusted_weight := calculate_edge_weight(NEW);
  NEW.ranking_score := (NEW.adjusted_weight * 1000)::INTEGER;
  NEW.last_weight_calculation := CURRENT_TIMESTAMP;
  NEW.updated_at := CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update weights
CREATE TRIGGER edge_weight_update
  BEFORE INSERT OR UPDATE ON edges
  FOR EACH ROW
  EXECUTE FUNCTION update_edge_weight();

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_edge_view(edge_id_param VARCHAR(255))
RETURNS VOID AS $$
BEGIN
  UPDATE edges
  SET
    view_count = view_count + 1,
    last_accessed = CURRENT_TIMESTAMP
  WHERE id = edge_id_param;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- View for high-quality edges
CREATE VIEW verified_edges AS
SELECT *
FROM edges
WHERE verification_status = 'manually_verified'
  AND adjusted_weight >= 0.70
ORDER BY ranking_score DESC;

-- View for featured content
CREATE VIEW featured_edges AS
SELECT *
FROM edges
WHERE featured = TRUE
  AND verification_status = 'manually_verified'
ORDER BY ranking_score DESC;

-- View for edges by pillar
CREATE VIEW edges_by_pillar AS
SELECT
  pillar,
  COUNT(*) as edge_count,
  AVG(adjusted_weight) as avg_weight,
  AVG(confidence_score) as avg_confidence,
  COUNT(*) FILTER (WHERE verification_status = 'manually_verified') as verified_count
FROM edges
GROUP BY pillar
ORDER BY edge_count DESC;

-- ============================================================================
-- SAMPLE DATA FOR TESTING
-- ============================================================================

-- Insert a sample edge
INSERT INTO edges (
  id, source_id, source_reference, source_surah, source_ayah,
  source_text_arabic, source_text_english,
  target_id, target_reference, target_collection, target_hadith_number,
  target_text_arabic, target_text_english, target_narrator, target_authentication,
  pillar, tier, confidence_score, strength_label, primary_connection_type,
  legal_function, verification_status, scholarly_consensus, created_by
) VALUES (
  'edge_salah_2_43_bukhari_500',
  'verse_2_43', '2:43', 2, 43,
  'وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ وَارْكَعُوا مَعَ الرَّاكِعِينَ',
  'And establish prayer and give zakah and bow with those who bow [in worship and obedience].',
  'hadith_bukhari_500', 'Bukhari #500', 'Sahih al-Bukhari', 500,
  'الصلاة عماد الدين',
  'Prayer is the pillar of religion',
  'Abu Hurairah', 'Sahih',
  'salah', '1', 0.95, 'explicit', 'explicit_citation',
  'bayan', 'manually_verified', 'ijma', 'admin'
);

-- Insert source for the edge
INSERT INTO edge_sources (
  edge_id, source_type, work_title, author, reference, citation
) VALUES (
  'edge_salah_2_43_bukhari_500',
  'classical_tafsir',
  'Tafsir Ibn Kathir',
  'Ibn Kathir',
  'Commentary on 2:43',
  'Ibn Kathir explicitly mentions this hadith in his commentary on this verse'
);

-- ============================================================================
-- GRANTS (Adjust based on your security model)
-- ============================================================================

-- Grant read access to app user
-- GRANT SELECT ON ALL TABLES IN SCHEMA public TO app_user;
-- GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO app_user;

-- Grant write access to admin
-- GRANT ALL ON ALL TABLES IN SCHEMA public TO admin_user;
-- GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO admin_user;

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '============================================';
  RAISE NOTICE 'Enhanced Islamic Knowledge Graph Schema';
  RAISE NOTICE 'Migration 001: COMPLETE ✅';
  RAISE NOTICE '============================================';
  RAISE NOTICE 'Tables created: edges, edge_sources, edge_tags, edge_history, concepts';
  RAISE NOTICE 'Indexes created: 25+ performance indexes';
  RAISE NOTICE 'Functions created: Weight calculation, view increment';
  RAISE NOTICE 'Sample data: 1 edge inserted for testing';
  RAISE NOTICE '============================================';
END $$;
