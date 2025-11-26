# Project Cleanup Plan - Fresh Start

## Goal
Remove ALL current data and references while preserving the visual orbital structure.
Ready to accept new 100-item dataset with new headers.

## What We're KEEPING ✅

### Visual Components (Untouched)
```
app/src/components/
├── canvas/
│   └── OrrerySystem.tsx           ← Main orchestrator
├── graph/
│   ├── nodes/
│   │   ├── SurahNode.tsx          ← Node appearance
│   │   ├── HadithNode.tsx         ← Node appearance
│   │   └── ConnectionLines.tsx
│   └── OrbitRings.tsx             ← Ring visuals
└── ui/
    ├── PillarFilter.tsx           ← Filter UI
    └── InfoPanel.tsx              ← Info display
```

### Core Systems (Untouched)
```
app/src/lib/
├── orbital-layout.ts              ← Positioning logic
└── stores/
    └── useCosmicStore.ts          ← State management
```

### Pages & Layouts (Untouched)
```
app/src/app/
├── graph/page.tsx                 ← Main page
└── layout.tsx                     ← Root layout
```

## What We're REMOVING ❌

### Data Files
```
app/src/data/
├── five-pillars-references.ts     ← DELETE (old 100 references)
└── hadith-citation-mapping.json   ← DELETE (mapping file)
```

### API Routes
```
app/src/app/api/
├── quran/route.ts                 ← DELETE
├── hadith/route.ts                ← DELETE
└── edges/route.ts                 ← DELETE (if exists)
```

### Data Loading Hook
```
app/src/hooks/
└── useGraphData.orbital.ts        ← REWRITE (remove data loading)
```

### Validation
```
app/src/validation/
└── schemas.ts                     ← DELETE or simplify
```

### Generated Data Files
```
data/
├── quran/*.json                   ← KEEP structure, clear content
├── hadith/*.json                  ← KEEP structure, clear content
└── edges/*.jsonl                  ← KEEP structure, clear content
```

### Scripts
```
scripts/
├── map-hadith-citations.js        ← DELETE
├── map-hadith-citations-v2.js     ← DELETE
└── analyze-authenticated-mapping.js ← DELETE
```

## New Data Structure (To Be Provided)

User will provide:
1. **New headers** (column names, data structure)
2. **100 line items** (fresh dataset)
3. **API links** for each item
4. **Ring assignment** for each item

## Cleanup Steps

1. Delete old data files
2. Delete API routes
3. Rewrite useGraphData to return empty/mock data
4. Commit as "Clean slate - remove all data references"
5. Ready for new 100-item dataset

## Post-Cleanup State

The app should:
- ✅ Still render the orbital rings
- ✅ Still show the filter UI
- ✅ Show empty visualization (no nodes)
- ✅ Be ready to accept new data format

---

**Ready to proceed with cleanup?**
