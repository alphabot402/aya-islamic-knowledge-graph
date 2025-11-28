# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AYA (آية) is an Islamic Knowledge Graph that visualizes authenticated connections between Quran verses and hadiths. The project consists of three main components:

1. **Data Pipeline** - Scripts to download and process Islamic texts
2. **Next.js Application** - Web interface with 3D graph visualization
3. **Data Layer** - Authenticated Quran verses, hadiths, and verified edges (connections)

## Architecture

### Monorepo Structure

```
AYA/
├── app/                    # Next.js application (workspace)
│   ├── src/
│   │   ├── app/           # Next.js app router pages and API routes
│   │   │   ├── api/       # Backend API endpoints
│   │   │   │   ├── quran/     # Serves Quran verse data
│   │   │   │   ├── hadith/    # Serves hadith data
│   │   │   │   └── edges/     # Serves edge/connection data
│   │   │   ├── graph/     # 3D graph visualization page
│   │   │   ├── layout.tsx # Root layout
│   │   │   └── page.tsx   # Home page
│   │   ├── components/    # React components
│   │   │   ├── graph/     # QuranGraph (3D visualization using react-three-fiber)
│   │   │   └── layout/    # StarField background
│   │   ├── lib/           # Core data loading utilities
│   │   │   ├── quran-data.ts        # Load surahs and verses from filesystem
│   │   │   └── graph-data-loader.ts # Transform data for 3D graph
│   │   └── types/         # TypeScript type definitions
│   │       ├── quran.ts   # QuranVerse, QuranSurah interfaces
│   │       ├── hadith.ts  # Hadith reference types
│   │       └── edge.ts    # Edge schema with verification metadata
│   └── package.json       # App dependencies (Next.js, React, Three.js)
├── pipeline/              # Data processing scripts (Node.js)
│   ├── quran/
│   │   ├── download-tanzil.js  # Downloads Tanzil Quran XML
│   │   └── convert-tanzil.js   # Converts XML to 114 JSON files + checksums
│   ├── hadith/
│   │   └── download-bukhari.js # Downloads Sahih al-Bukhari collection
│   └── edges/
│       └── edge-template.json  # Schema template for manual edge curation
├── data/                  # Generated data files (not in git)
│   ├── quran/            # 114 surah JSON files (surah_001.json - surah_114.json)
│   ├── hadith/           # bukhari-raw.json
│   └── edges/            # Manually curated edge files (JSONL format)
├── tests/
│   └── checksums/        # quran.json - SHA-256 hashes for data integrity
└── docs/                 # Documentation
```

### Data Flow

1. **Pipeline Scripts** download and convert source texts → `data/` directory
2. **API Routes** (`app/src/app/api/`) read from `data/` using `lib/quran-data.ts`
3. **Graph Visualization** fetches from API and positions nodes in 3D space
4. **Edge System** (future) will link Quran verses to hadiths with scholarly verification

### Key Design Patterns

**Data Loading Pattern:**
- API routes use filesystem reads (via `lib/quran-data.ts`)
- Path resolution: `path.join(process.cwd(), '..', 'data', 'quran')`
- This navigates from `app/` workspace to root `data/` directory

**Edge Verification Schema:**
- Each edge has a `tier` (1-3) indicating connection strength
- `linkage_type` categorizes the relationship (e.g., Explicit_Citation, Legal_Specification)
- `verification` object tracks sources (tafsir, hadith collections) and status
- All edges must be manually verified before marking as "manually_verified"

**3D Graph Layout:**
- Each surah forms a cluster in 3D space
- Surahs arranged in circular pattern with radius based on surah number
- Verses within surah form smaller circles around cluster center
- Color coding: Teal (Meccan), Gold (Medinan)

## Common Commands

### Development Workflow

**IMPORTANT: This project uses GitHub → Vercel deployment. DO NOT use localhost or npm run dev.**

```bash
# Install all dependencies (run from root, if needed)
npm install
cd app && npm install

# Deployment workflow (ALWAYS use this):
# 1. Make code changes
# 2. Commit to git
git add .
git commit -m "Your commit message"

# 3. Push to GitHub
git push

# 4. Vercel automatically deploys from GitHub
# 5. View changes at: https://projectayat.vercel.app/
```

**Never run `npm run dev` or test on localhost. All testing happens on the live Vercel deployment.**

### Data Pipeline

```bash
# Quick start: Run all pipeline steps at once
run-pipeline.bat           # Windows batch script

# Or manually step-by-step:
node pipeline/quran/download-tanzil.js    # Downloads ~2-3 MB XML
node pipeline/quran/convert-tanzil.js     # Generates 114 JSON files + checksums
node pipeline/hadith/download-bukhari.js  # Downloads ~7,563 hadiths

# Verify data integrity
dir data\quran\*.json | measure          # Should show 114 files
dir data\hadith\*.json | measure         # Should show 1 file
```

### Edge Curation (Manual Process)

Edges are manually curated following these steps:

1. Copy `pipeline/edges/edge-template.json`
2. Fill in verse/hadith references and verification sources
3. Save to `data/edges/edges_{topic}.jsonl` (one JSON object per line)
4. Follow checklist in `PIPELINE_GUIDE.md`

## Type System

**Core Data Types:**

```typescript
// Quran structure
interface QuranVerse {
  index: number                    // Verse number within surah
  text_uthmani: string            // Display text with diacritics
  text_simple: string             // Simplified for search
  structural_tags?: {
    pillar_tags?: string[]        // e.g., ["Salah", "Zakat"]
    topic_tags?: string[]
  }
  cross_refs?: string[]           // References to edges
}

interface QuranSurah {
  surah_number: number
  revelation_order: number        // Currently 0, to be filled
  juz_list: number[]             // Currently [], to be filled
  verses: QuranVerse[]
}

// Edge/connection schema
interface Edge {
  id: string
  pillar: string                  // e.g., "Salah", "Zakat"
  verse_ref: VerseReference       // { surah, ayah, reference }
  hadith_ref: HadithReference
  linkage: {
    tier: 1 | 2 | 3              // 1=Explicit, 2=Implicit, 3=Thematic
    linkage_type: LinkageType    // How verse and hadith relate
    legal_function: LegalFunction[]  // Fiqh relationships
    weight: number               // Connection strength (0-1)
  }
  verification: {
    sources: VerificationSource[]   // Tafsir, scholarly works
    status: VerificationStatus      // manually_verified | pending_review
  }
  // ... full verse/hadith text included in edge
}
```

## API Routes

All routes use Next.js App Router with `GET` handlers:

### `/api/quran`
- **Query params:** `?surah=2` (optional)
- **Returns:** Single surah OR all 114 surahs (first 10 verses for long surahs, all verses for short surahs after surah 78)
- **Used by:** Graph visualization to load node data

### `/api/hadith`
- **Status:** Route exists but implementation pending
- **Purpose:** Will serve hadith data filtered by collection/book

### `/api/edges`
- **Status:** Route exists but implementation pending
- **Purpose:** Will serve verified edges between verses and hadiths

## Important Conventions

### Data Integrity
- All Quran data has SHA-256 checksums in `tests/checksums/quran.json`
- Never modify `data/quran/*.json` directly - regenerate from XML source
- Source of truth: Tanzil.net Uthmani text

### Edge Quality Standards (from PIPELINE_GUIDE.md)
- **Quality over quantity:** 5 perfect edges > 50 questionable ones
- Every edge requires 30+ minutes of verification
- Must check: Ibn Kathir's tafsir, hadith authentication, scholarly consensus
- Use only Sahih or Hasan grade hadiths

### File Naming
- Surahs: `surah_001.json` through `surah_114.json` (zero-padded)
- Edges: `edges_{topic}.jsonl` (e.g., `edges_salah.jsonl`)

### Graph Node IDs
- Format: `"{surah}:{verse}"` (e.g., `"2:255"` for Ayat al-Kursi)
- Used consistently across verse references and graph node identification

## Technology Stack

- **Frontend:** Next.js 14, React 18, TypeScript
- **3D Visualization:** react-three-fiber, @react-three/drei, three.js
- **Styling:** Tailwind CSS
- **Data Pipeline:** Node.js (vanilla - no frameworks)
- **Data Format:** JSON (structured), JSONL (edges)

## Development Notes

### When working on the graph visualization:
- Graph data loader is in `lib/graph-data-loader.ts`
- Position generation algorithm in `generatePosition()` function
- Cross-references currently hardcoded - will be replaced by edge system

### When adding new API routes:
- Use filesystem reads with proper path resolution (see existing routes)
- Return NextResponse.json() for all responses
- Handle errors with appropriate status codes

### When curating edges:
- Follow the template schema exactly
- Document all sources in verification.sources array
- Use appropriate tier (1=direct quote, 2=same topic, 3=thematic)
- Include full Arabic and English text in the edge object

## Future Work (from documentation)

1. Complete edge curation workflow (currently manual)
2. Implement `/api/edges` endpoint
3. Add edge-based connections to graph (replace hardcoded cross-references)
4. Display verse detail pages with connected hadiths
5. Add search functionality
6. Implement surah metadata (revelation_order, juz_list)
