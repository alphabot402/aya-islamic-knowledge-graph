-- AYA Islamic Knowledge Graph - Initial Schema Migration
-- Version: 1.0.0
-- Date: 2024-11-24

-- =====================================================
-- ENUMS (Custom Types)
-- =====================================================

CREATE TYPE revelation_type AS ENUM ('Meccan', 'Medinan');
CREATE TYPE pillar_type AS ENUM ('shahada', 'salah', 'zakat', 'sawm', 'hajj', 'general');
CREATE TYPE edge_connection_type AS ENUM ('direct', 'contextual', 'thematic', 'excellence', 'clarification');
CREATE TYPE edge_strength AS ENUM ('weak', 'moderate', 'strong');
CREATE TYPE hadith_grade AS ENUM ('Sahih', 'Hasan', 'Daif');

-- =====================================================
-- QURAN DOMAIN
-- =====================================================

-- Surahs (Chapters)
CREATE TABLE surahs (
  id SERIAL PRIMARY KEY,
  number INTEGER UNIQUE NOT NULL CHECK (number >= 1 AND number <= 114),
  name_arabic TEXT NOT NULL,
  name_transliteration TEXT NOT NULL,
  name_translation TEXT NOT NULL,
  revelation_type revelation_type NOT NULL,
  revelation_order INTEGER CHECK (revelation_order >= 1 AND revelation_order <= 114),
  verse_count INTEGER NOT NULL CHECK (verse_count > 0),
  primary_pillar pillar_type DEFAULT 'general',
  bismillah_pre BOOLEAN DEFAULT true,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Verses (Ayat)
CREATE TABLE verses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  surah_id INTEGER NOT NULL REFERENCES surahs(id) ON DELETE CASCADE,
  verse_number INTEGER NOT NULL CHECK (verse_number > 0),

  -- Text content
  text_arabic TEXT NOT NULL,
  text_simple TEXT NOT NULL,  -- Simplified for search indexing
  text_english TEXT,

  -- Location metadata
  juz INTEGER CHECK (juz >= 1 AND juz <= 30),
  hizb INTEGER CHECK (hizb >= 1 AND hizb <= 60),
  page INTEGER,

  -- Classification
  pillar_tags pillar_type[] DEFAULT '{}',
  topic_tags TEXT[] DEFAULT '{}',

  -- Full-text search vectors
  tsv_arabic tsvector,
  tsv_english tsvector,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(surah_id, verse_number)
);

-- =====================================================
-- HADITH DOMAIN
-- =====================================================

-- Hadith Collections (e.g., Sahih al-Bukhari)
CREATE TABLE hadith_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_arabic TEXT NOT NULL,
  name_english TEXT NOT NULL,
  author_arabic TEXT,
  author_english TEXT,
  total_hadiths INTEGER,
  description TEXT,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(name_english)
);

-- Hadiths
CREATE TABLE hadiths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID NOT NULL REFERENCES hadith_collections(id) ON DELETE CASCADE,

  -- Identification
  id_in_book INTEGER NOT NULL,
  book_id INTEGER,
  chapter_id INTEGER,

  -- Book/Chapter info
  book_name_arabic TEXT,
  book_name_english TEXT,
  chapter_name_arabic TEXT,
  chapter_name_english TEXT,

  -- Content
  narrator_primary TEXT,
  isnad_chain TEXT,  -- Chain of narrators (Arabic)
  text_arabic TEXT NOT NULL,
  text_english TEXT NOT NULL,

  -- Authentication
  grade hadith_grade NOT NULL,
  grade_source TEXT,
  authentication_notes TEXT,

  -- Classification
  pillar_tags pillar_type[] DEFAULT '{}',
  topic_tags TEXT[] DEFAULT '{}',

  -- Full-text search vectors
  tsv_arabic tsvector,
  tsv_english tsvector,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(collection_id, id_in_book)
);

-- =====================================================
-- CONNECTION/EDGE DOMAIN
-- =====================================================

-- Edges (Verse-Hadith Connections)
CREATE TABLE edges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- References
  verse_id UUID NOT NULL REFERENCES verses(id) ON DELETE CASCADE,
  hadith_id UUID NOT NULL REFERENCES hadiths(id) ON DELETE CASCADE,

  -- Connection metadata
  connection_type edge_connection_type NOT NULL,
  relationship_description TEXT NOT NULL,
  strength edge_strength NOT NULL,
  weight DECIMAL(3,2) CHECK (weight >= 0 AND weight <= 1) DEFAULT 0.5,
  pillar pillar_type DEFAULT 'general',

  -- Verification (CRITICAL for scholarly integrity)
  verified BOOLEAN DEFAULT false,
  verified_by TEXT,
  verified_at TIMESTAMP WITH TIME ZONE,
  verification_sources JSONB DEFAULT '[]',
  scholarly_notes TEXT,

  -- User tracking (for future crowdsourcing)
  created_by UUID,  -- Future: reference to users table
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  -- Tags for filtering
  tags TEXT[] DEFAULT '{}',

  UNIQUE(verse_id, hadith_id),  -- One edge per verse-hadith pair

  -- Ensure verse and hadith are different entities
  CHECK (verse_id != hadith_id)
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Surah indexes
CREATE INDEX idx_surahs_number ON surahs(number);
CREATE INDEX idx_surahs_revelation_type ON surahs(revelation_type);
CREATE INDEX idx_surahs_pillar ON surahs(primary_pillar);

-- Verse indexes
CREATE INDEX idx_verses_surah ON verses(surah_id);
CREATE INDEX idx_verses_surah_number ON verses(surah_id, verse_number);
CREATE INDEX idx_verses_juz ON verses(juz);
CREATE INDEX idx_verses_pillar ON verses USING GIN(pillar_tags);
CREATE INDEX idx_verses_topics ON verses USING GIN(topic_tags);
CREATE INDEX idx_verses_search_ar ON verses USING GIN(tsv_arabic);
CREATE INDEX idx_verses_search_en ON verses USING GIN(tsv_english);

-- Hadith indexes
CREATE INDEX idx_hadiths_collection ON hadiths(collection_id);
CREATE INDEX idx_hadiths_id_in_book ON hadiths(collection_id, id_in_book);
CREATE INDEX idx_hadiths_book ON hadiths(collection_id, book_id);
CREATE INDEX idx_hadiths_chapter ON hadiths(collection_id, book_id, chapter_id);
CREATE INDEX idx_hadiths_grade ON hadiths(grade);
CREATE INDEX idx_hadiths_pillar ON hadiths USING GIN(pillar_tags);
CREATE INDEX idx_hadiths_topics ON hadiths USING GIN(topic_tags);
CREATE INDEX idx_hadiths_search_ar ON hadiths USING GIN(tsv_arabic);
CREATE INDEX idx_hadiths_search_en ON hadiths USING GIN(tsv_english);

-- Edge indexes
CREATE INDEX idx_edges_verse ON edges(verse_id);
CREATE INDEX idx_edges_hadith ON edges(hadith_id);
CREATE INDEX idx_edges_verified ON edges(verified) WHERE verified = true;
CREATE INDEX idx_edges_pillar ON edges(pillar);
CREATE INDEX idx_edges_connection_type ON edges(connection_type);
CREATE INDEX idx_edges_strength ON edges(strength);
CREATE INDEX idx_edges_tags ON edges USING GIN(tags);

-- Composite indexes for common queries
CREATE INDEX idx_edges_verse_verified ON edges(verse_id, verified) WHERE verified = true;
CREATE INDEX idx_edges_hadith_verified ON edges(hadith_id, verified) WHERE verified = true;

-- =====================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =====================================================

-- Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_surahs_updated_at BEFORE UPDATE ON surahs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_verses_updated_at BEFORE UPDATE ON verses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hadiths_updated_at BEFORE UPDATE ON hadiths
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_edges_updated_at BEFORE UPDATE ON edges
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update full-text search vectors automatically
CREATE OR REPLACE FUNCTION update_verse_tsv()
RETURNS TRIGGER AS $$
BEGIN
    NEW.tsv_arabic := to_tsvector('arabic', COALESCE(NEW.text_arabic, ''));
    NEW.tsv_english := to_tsvector('english', COALESCE(NEW.text_english, ''));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER verses_tsv_update BEFORE INSERT OR UPDATE ON verses
    FOR EACH ROW EXECUTE FUNCTION update_verse_tsv();

CREATE OR REPLACE FUNCTION update_hadith_tsv()
RETURNS TRIGGER AS $$
BEGIN
    NEW.tsv_arabic := to_tsvector('arabic', COALESCE(NEW.text_arabic, ''));
    NEW.tsv_english := to_tsvector('english', COALESCE(NEW.text_english, ''));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER hadiths_tsv_update BEFORE INSERT OR UPDATE ON hadiths
    FOR EACH ROW EXECUTE FUNCTION update_hadith_tsv();

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- View: Graph data with all connections
CREATE VIEW graph_data AS
SELECT
    s.id as surah_id,
    s.number as surah_number,
    s.name_arabic as surah_name_arabic,
    s.revelation_type,
    s.primary_pillar as surah_pillar,
    COUNT(DISTINCT v.id) as verse_count,
    COUNT(DISTINCT e.id) FILTER (WHERE e.verified = true) as connection_count
FROM surahs s
LEFT JOIN verses v ON v.surah_id = s.id
LEFT JOIN edges e ON e.verse_id = v.id
GROUP BY s.id, s.number, s.name_arabic, s.revelation_type, s.primary_pillar
ORDER BY s.number;

-- View: Verified connections summary
CREATE VIEW verified_connections_summary AS
SELECT
    e.pillar,
    e.connection_type,
    e.strength,
    COUNT(*) as edge_count,
    AVG(e.weight) as avg_weight
FROM edges e
WHERE e.verified = true
GROUP BY e.pillar, e.connection_type, e.strength;

-- =====================================================
-- ROW LEVEL SECURITY (RLS) - Disabled for now
-- =====================================================
-- Will enable when user authentication is added

-- =====================================================
-- MATERIALIZED VIEWS FOR ANALYTICS
-- =====================================================

CREATE MATERIALIZED VIEW edge_statistics AS
SELECT
    pillar,
    connection_type,
    strength,
    COUNT(*) as total_edges,
    COUNT(*) FILTER (WHERE verified = true) as verified_edges,
    AVG(weight) as avg_weight
FROM edges
GROUP BY pillar, connection_type, strength;

-- Refresh function for materialized view
CREATE OR REPLACE FUNCTION refresh_edge_statistics()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW edge_statistics;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE surahs IS 'Chapters of the Quran (114 total)';
COMMENT ON TABLE verses IS 'Individual verses (ayat) from the Quran (~6,236 total)';
COMMENT ON TABLE hadith_collections IS 'Collections like Sahih al-Bukhari, Muslim, etc.';
COMMENT ON TABLE hadiths IS 'Individual hadiths with authentication grades';
COMMENT ON TABLE edges IS 'Scholarly verified connections between verses and hadiths';

COMMENT ON COLUMN edges.weight IS 'Connection strength from 0.0 to 1.0';
COMMENT ON COLUMN edges.verified IS 'Has this connection been verified by a scholar?';
COMMENT ON COLUMN edges.verification_sources IS 'JSON array of scholarly sources (tafsir, etc.)';
