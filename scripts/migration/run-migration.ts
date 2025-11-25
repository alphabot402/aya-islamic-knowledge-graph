/**
 * Main Migration Runner
 * Orchestrates the complete migration process
 */

import { checkConnection } from './supabase-client'
import { migrateQuranData } from './migrate-quran'
import { migrateHadithData } from './migrate-hadith'
import { migrateEdgesData } from './migrate-edges'

async function runFullMigration(clearExisting: boolean = false): Promise<void> {
  console.log('╔══════════════════════════════════════════════════════════╗')
  console.log('║                                                          ║')
  console.log('║         AYA Database Migration to Supabase              ║')
  console.log('║                                                          ║')
  console.log('╚══════════════════════════════════════════════════════════╝')

  const startTime = Date.now()

  try {
    // Step 0: Check connection
    console.log('\n🔌 Step 0: Checking database connection...')
    const connected = await checkConnection()
    if (!connected) {
      throw new Error('Failed to connect to database')
    }

    if (clearExisting) {
      console.log('\n⚠️  WARNING: Clear mode enabled - existing data will be deleted!')
      console.log('   Press Ctrl+C to cancel, or wait 5 seconds to continue...')
      await new Promise(resolve => setTimeout(resolve, 5000))
    }

    // Step 1: Migrate Quran
    await migrateQuranData(clearExisting)

    // Step 2: Migrate Hadith
    await migrateHadithData(clearExisting)

    // Step 3: Migrate Edges
    await migrateEdgesData(clearExisting)

    // Summary
    const duration = ((Date.now() - startTime) / 1000).toFixed(2)

    console.log('\n╔══════════════════════════════════════════════════════════╗')
    console.log('║                                                          ║')
    console.log('║              ✅ Migration Completed Successfully!         ║')
    console.log('║                                                          ║')
    console.log('╚══════════════════════════════════════════════════════════╝')
    console.log(`\n⏱️  Total time: ${duration}s`)
    console.log('\n📊 Next steps:')
    console.log('   1. Verify data in Supabase dashboard')
    console.log('   2. Run validation script: npm run validate-migration')
    console.log('   3. Update API routes to use database')
    console.log('   4. Test application with new data source\n')

  } catch (error) {
    console.error('\n╔══════════════════════════════════════════════════════════╗')
    console.error('║                                                          ║')
    console.error('║                 ❌ Migration Failed                       ║')
    console.error('║                                                          ║')
    console.error('╚══════════════════════════════════════════════════════════╝\n')
    throw error
  }
}

// CLI interface
const args = process.argv.slice(2)
const clearExisting = args.includes('--clear') || args.includes('-c')
const help = args.includes('--help') || args.includes('-h')

if (help) {
  console.log(`
AYA Database Migration Tool

Usage:
  npm run migrate              Run migration (preserves existing data)
  npm run migrate -- --clear   Run migration (clears existing data first)
  npm run migrate -- --help    Show this help message

Examples:
  npm run migrate              # First time migration
  npm run migrate -- --clear   # Re-run migration (development)

Environment:
  Requires .env.local with:
  - NEXT_PUBLIC_SUPABASE_URL
  - SUPABASE_SERVICE_ROLE_KEY
  `)
  process.exit(0)
}

// Run migration
runFullMigration(clearExisting)
  .then(() => {
    process.exit(0)
  })
  .catch(error => {
    console.error('Error:', error.message)
    process.exit(1)
  })
