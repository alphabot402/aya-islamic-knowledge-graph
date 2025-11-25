# 🚀 AYA Data Pipeline Guide

## Quick Start - Run These Commands

### Step 1: Download Quran Data (2 minutes)

```powershell
cd C:\Users\asifi\OneDrive\Desktop\AYA
node pipeline/quran/download-tanzil.js
```

**What happens:**
- Downloads Tanzil Quran XML (~2-3 MB)
- Saves to `data/quran/tanzil-quran-uthmani.xml`
- Contains all 114 surahs with Uthmani text

### Step 2: Convert to JSON (1 minute)

```powershell
node pipeline/quran/convert-tanzil.js
```

**What happens:**
- Parses XML into our JSON schema
- Creates 114 individual surah files
- Generates SHA-256 checksums
- Saves to `data/quran/surah_001.json` through `surah_114.json`

### Step 3: Download Hadith Data (2 minutes)

```powershell
node pipeline/hadith/download-bukhari.js
```

**What happens:**
- Downloads Sahih al-Bukhari collection
- ~7,563 authentic hadiths
- Saves to `data/hadith/bukhari-raw.json`

---

## ✅ Success Indicators

After running all scripts, you should have:

```
C:\Users\asifi\OneDrive\Desktop\AYA\
├── data\
│   ├── quran\
│   │   ├── tanzil-quran-uthmani.xml  ✅
│   │   ├── surah_001.json            ✅
│   │   ├── surah_002.json            ✅
│   │   └── ... (all 114 surahs)      ✅
│   └── hadith\
│       └── bukhari-raw.json          ✅
└── tests\
    └── checksums\
        └── quran.json                ✅
```

---

## 🎯 Next: Create Your First Edge

Now that you have the data, let's create your first verified connection!

### Example: Surah 2, Verse 43 (Prayer Command)

**1. Read the verse:**
```
"And establish prayer and give zakah and bow with those who bow"
```

**2. Find matching hadith in Bukhari:**
- Open: `data/hadith/bukhari-raw.json`
- Search for: Book 8 (Prayer)
- Look for hadiths about establishing prayer

**3. Verify in Ibn Kathir:**
- Search: "Ibn Kathir Surah 2 Verse 43"
- Check if he mentions the hadith
- Document the reference

**4. Create edge file:**
- Copy: `pipeline/edges/edge-template.json`
- Fill in actual details
- Save to: `data/edges/edges_salah.jsonl`

---

## 📋 Edge Curation Checklist

Before creating an edge:

- [ ] Verse is from authenticated Quran source (Tanzil)
- [ ] Hadith is Sahih or Hasan grade
- [ ] Connection verified in classical tafsir
- [ ] All Arabic text is accurate
- [ ] English translations are from Sahih International
- [ ] Sources properly documented
- [ ] Tier classification is correct
- [ ] Weight reflects connection strength

---

## 🔍 Verification Steps

For each edge you create:

1. **Read the Quran verse** in context (read surrounding verses)
2. **Read the full hadith** (not just snippet)
3. **Check Ibn Kathir's tafsir** on that verse
4. **Verify hadith chain** (isnad) if possible
5. **Document everything** in the notes field
6. **Have someone review** before marking as verified

---

## 💡 Tips for Success

**Start Small:**
- Begin with 5 edges, not 20
- Focus on Tier 1 (explicit) connections first
- Use only Sahih al-Bukhari initially

**Be Thorough:**
- Spend 30+ minutes per edge
- Double-check all Arabic text
- Verify references are accurate

**Document Everything:**
- Write clear notes explaining the connection
- Include page numbers from tafsir
- Note any scholarly disagreements

---

## 🆘 Troubleshooting

### "Cannot find module"
```powershell
# Make sure you're in the root directory
cd C:\Users\asifi\OneDrive\Desktop\AYA
```

### Download fails
- Check internet connection
- Try manual download from:
  - Quran: https://tanzil.net/download/
  - Hadith: https://github.com/AhmedBaset/hadith-json

### Conversion errors
- Verify XML file downloaded completely
- Check file isn't corrupted
- Try downloading again

---

## 📚 Resources

**Quran Sources:**
- https://tanzil.net/
- https://quran.com/
- https://alquran.cloud/api

**Hadith Sources:**
- https://sunnah.com/
- https://github.com/AhmedBaset/hadith-json
- https://hadithapi.com/

**Tafsir Resources:**
- https://quran.com/ (has Ibn Kathir)
- https://altafsir.com/
- Physical books (highly recommended!)

---

## 🎓 Learning Path

**Week 1: Foundation**
- Run all download scripts ✅
- Understand data structure
- Read 5 surahs from Surah 2

**Week 2: First Edges**
- Create 5 Tier 1 edges
- Focus on Salah (prayer)
- Document thoroughly

**Week 3: Validation**
- Review with scholar if possible
- Check all references
- Refine and polish

**Week 4: Scale Up**
- Add 15 more edges
- Cover more prayer topics
- Prepare for visualization

---

## 🌟 Remember

**Quality over quantity!**

5 perfectly verified edges > 50 questionable ones

Every edge you create will be used by Muslims worldwide to learn their deen. Make it count.

---

**May Allah accept this work. Ameen.** 🤲
