# 🎯 YOUR MISSION: Get AYA Data Ready

## ⚡ Quick Option: Run Everything at Once

**Double-click this file:**
```
C:\Users\asifi\OneDrive\Desktop\AYA\run-pipeline.bat
```

It will:
1. ✅ Download Tanzil Quran
2. ✅ Convert to JSON with checksums
3. ✅ Download Sahih al-Bukhari

**Total time: ~5 minutes**

---

## 🎮 Manual Option: Step by Step

### Step 1: Download Quran (2 min)

**Open PowerShell in your AYA folder:**
```powershell
cd C:\Users\asifi\OneDrive\Desktop\AYA
node pipeline/quran/download-tanzil.js
```

**You should see:**
```
📥 Downloading Tanzil Quran XML...
✅ Tanzil Quran downloaded successfully!
📁 Saved to: C:\Users\asifi\...\tanzil-quran-uthmani.xml
📊 File size: 2.XX MB
```

---

### Step 2: Convert to JSON (1 min)

```powershell
node pipeline/quran/convert-tanzil.js
```

**You should see:**
```
🔄 Converting Tanzil XML to JSON...
📖 Reading XML file...
🔍 Parsing surahs and verses...

✅ Surah 1: 7 verses (surah_001.json)
✅ Surah 2: 286 verses (surah_002.json)
... (all 114 surahs)

✅ Conversion complete!
📁 Output: C:\Users\asifi\...\data\quran
📊 Total surahs: 114
```

---

### Step 3: Download Hadith (2 min)

```powershell
node pipeline/hadith/download-bukhari.js
```

**You should see:**
```
📥 Downloading Sahih al-Bukhari JSON...
✅ Sahih al-Bukhari downloaded successfully!
📊 File size: XX.XX MB
📚 Contains: ~7,563 hadiths
```

---

## ✅ Verify Everything Worked

**Run this to check:**
```powershell
dir data\quran\*.json | measure
dir data\hadith\*.json | measure
```

**You should see:**
- 114 files in data\quran (one per surah)
- 1 file in data\hadith (bukhari-raw.json)

---

## 🎯 What's Next?

### Today: Explore the Data

**1. Open a surah file:**
```powershell
notepad data\quran\surah_002.json
```

Look at the structure. You'll see verses with Arabic text!

**2. Check the checksums:**
```powershell
notepad tests\checksums\quran.json
```

Each surah has a SHA-256 hash to ensure data integrity.

**3. Peek at Bukhari:**
```powershell
# Warning: Big file!
# Open in VS Code instead:
code data\hadith\bukhari-raw.json
```

---

### Tomorrow: Create Your First Edge

**Read this guide:**
```
C:\Users\asifi\OneDrive\Desktop\AYA\PIPELINE_GUIDE.md
```

Then follow the edge curation checklist!

**Your first edge should be:**
- Surah 2, Verse 43 (command to pray)
- Connected to a Bukhari hadith about prayer
- Verified in Ibn Kathir's tafsir
- Documented thoroughly

---

### This Week: Build the UI

Once you have 5 edges:
1. Build API routes to serve the data
2. Create Quran reader pages
3. Show edges on verse detail pages
4. Add the graph visualization

---

## 📋 Data Quality Checklist

After running the pipeline:

- [ ] 114 JSON files in data/quran
- [ ] Each file opens without errors
- [ ] Arabic text displays correctly
- [ ] Checksums file exists in tests/checksums
- [ ] Bukhari file in data/hadith
- [ ] No error messages during download

---

## 🆘 If Something Fails

### Download Fails
**Internet issue? Manual download:**

**Quran:**
1. Go to: https://tanzil.net/download/
2. Download "Uthmani (with sajdah signs)"
3. Save as: `data\quran\tanzil-quran-uthmani.xml`

**Hadith:**
1. Go to: https://github.com/AhmedBaset/hadith-json
2. Download the repo
3. Find: `db/by_book/the_9_books/bukhari.json`
4. Copy to: `data\hadith\bukhari-raw.json`

### Conversion Fails
- Check if XML file downloaded completely
- Try running download script again
- Check file isn't corrupted (should be ~2-3 MB)

### Node.js Errors
```powershell
# Make sure you're in the right directory
cd C:\Users\asifi\OneDrive\Desktop\AYA

# Check Node.js works
node --version
```

---

## 🎓 Understanding the Data

### Quran JSON Structure
```json
{
  "surah_number": 2,
  "revelation_order": 87,
  "juz_list": [1, 2, 3],
  "verses": [
    {
      "index": 1,
      "text_uthmani": "الٓمٓ",
      "text_simple": "الم",
      "structural_tags": {
        "pillar_tags": [],
        "topic_tags": []
      },
      "cross_refs": []
    }
  ]
}
```

### What Each Field Means
- `surah_number`: Standard numbering (1-114)
- `text_uthmani`: Display text with proper diacritics
- `text_simple`: Simplified for search
- `structural_tags`: Will add pillar tags later
- `cross_refs`: Will link to edges later

---

## 🌟 Pro Tips

**Backup Your Data:**
```powershell
# After successful conversion, backup!
xcopy /E /I data data-backup
```

**Check Integrity:**
```powershell
# The checksums prove data hasn't been tampered with
node -e "console.log(require('./tests/checksums/quran.json'))"
```

**Explore with VS Code:**
```powershell
# Much better for viewing JSON
code data\quran\surah_002.json
```

---

## 📊 What You're Building

```
Your Data Flow:
├─ Tanzil XML (source of truth)
│  └─ Converted to 114 JSON files
│     └─ Each with checksum
│        └─ Served by Next.js API
│           └─ Displayed in React UI
│
├─ Bukhari JSON (authenticated hadiths)
│  └─ Filtered by book/chapter
│     └─ Linked to Quran verses (your edges!)
│        └─ Shown with trust badges
│           └─ Visualized in graph
```

---

## 🚀 Ready to Run?

**Choose one:**

### Option 1: All at Once (Easy)
```
Double-click: run-pipeline.bat
Wait 5 minutes
Done! ✅
```

### Option 2: Step by Step (Learn More)
```powershell
node pipeline/quran/download-tanzil.js
node pipeline/quran/convert-tanzil.js
node pipeline/hadith/download-bukhari.js
```

---

**Either way, you'll have:**
- ✅ 114 verified Quran surahs
- ✅ 7,563 authentic hadiths
- ✅ Checksums for integrity
- ✅ Ready to build connections

---

**After you run the pipeline, come back and tell me:**
1. Did everything download successfully?
2. How many surah files do you have?
3. Ready to create your first edge?

**LET'S GO! 🚀**

---

**May Allah make this easy and beneficial. Ameen.** 🤲
