@echo off
echo ==========================================
echo AYA Data Pipeline - Complete Setup
echo ==========================================
echo.

echo Step 1/3: Downloading Tanzil Quran XML...
echo.
node pipeline\quran\download-tanzil.js
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Quran download failed. Please check your internet connection.
    pause
    exit /b 1
)

echo.
echo ==========================================
echo.

echo Step 2/3: Converting Quran to JSON...
echo.
node pipeline\quran\convert-tanzil.js
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Conversion failed. Please check the error above.
    pause
    exit /b 1
)

echo.
echo ==========================================
echo.

echo Step 3/3: Downloading Sahih al-Bukhari...
echo.
node pipeline\hadith\download-bukhari.js
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Hadith download failed. You can try again later.
)

echo.
echo ==========================================
echo.
echo ✅ Pipeline Complete!
echo.
echo 📊 What you now have:
echo    - 114 Quran surahs in JSON format
echo    - Sahih al-Bukhari hadith collection
echo    - SHA-256 checksums for verification
echo.
echo 🎯 Next steps:
echo    1. Review the data in data\quran\ and data\hadith\
echo    2. Read PIPELINE_GUIDE.md for edge curation
echo    3. Create your first edge connection!
echo.
pause
