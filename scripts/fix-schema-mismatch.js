/**
 * Schema Mismatch Fix Script
 *
 * PROBLEM: All 101 edges use `verse.verse` but the codebase expects `verse.ayah`
 * CAUSE: Converter script used wrong field name when transforming miner output
 * IMPACT: Graph completely broken - 100+ validation errors preventing load
 *
 * This script fixes all edges by renaming the field.
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 SCHEMA MISMATCH FIX SCRIPT');
console.log('=' .repeat(60));
console.log('');
console.log('📋 Problem: All edges use verse.verse instead of verse.ayah');
console.log('🎯 Solution: Rename field in all 101 edges');
console.log('');

// Load the broken production file
const edgesPath = path.join(__dirname, '../data/connections/verse-hadith-edges.json');

console.log(`📂 Loading: ${edgesPath}`);

if (!fs.existsSync(edgesPath)) {
  console.error('❌ ERROR: verse-hadith-edges.json not found!');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(edgesPath, 'utf8'));

console.log(`✅ Loaded ${data.edges.length} edges`);
console.log('');

// Create backup before modifying
const backupPath = edgesPath.replace('.json', '.backup-before-schema-fix.json');
fs.writeFileSync(backupPath, JSON.stringify(data, null, 2), 'utf8');
console.log(`💾 Backup created: ${backupPath}`);
console.log('');

// Fix all edges
let fixedCount = 0;
let alreadyCorrect = 0;

data.edges.forEach((edge, idx) => {
  if (edge.verse.verse !== undefined && edge.verse.ayah === undefined) {
    // Copy value to correct field
    edge.verse.ayah = edge.verse.verse;
    // Remove wrong field
    delete edge.verse.verse;
    fixedCount++;
  } else if (edge.verse.ayah !== undefined) {
    alreadyCorrect++;
  }
});

console.log('🔧 Fixing edges...');
console.log(`   ✅ Fixed: ${fixedCount} edges`);
console.log(`   ℹ️  Already correct: ${alreadyCorrect} edges`);
console.log('');

// Write back the fixed data
fs.writeFileSync(edgesPath, JSON.stringify(data, null, 2), 'utf8');

console.log('=' .repeat(60));
console.log('✅ SCHEMA FIX COMPLETE');
console.log('=' .repeat(60));
console.log('');
console.log('📊 Summary:');
console.log(`   Total edges: ${data.edges.length}`);
console.log(`   Fixed: ${fixedCount}`);
console.log(`   File updated: ${edgesPath}`);
console.log('');
console.log('🧪 Next Steps:');
console.log('   1. Refresh the graph page to verify it loads');
console.log('   2. Check browser console for validation errors');
console.log('   3. If working, update converter script to prevent recurrence');
console.log('');
