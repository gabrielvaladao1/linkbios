// Apply pending migrations to production database
// Usage: node prisma/apply-migrations.mjs

import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DATABASE_URL = process.env.DATABASE_URL || process.argv[2];
if (!DATABASE_URL) {
  console.error('DATABASE_URL required as env var or first argument');
  process.exit(1);
}

const client = new pg.Client({ connectionString: DATABASE_URL });

const migrations = [
  '0004_stripe_events',
  '0005_public_profiles_view',
  '0006_social_links',
  '0007_buttons_and_hero',
  '0008_leads',
  '0009_pixel_tracking',
];

async function main() {
  await client.connect();
  console.log('Connected to database\n');

  for (const migration of migrations) {
    const sqlPath = path.join(__dirname, migration, 'migration.sql');
    if (!fs.existsSync(sqlPath)) {
      console.log(`⚠️  ${migration}: file not found, skipping`);
      continue;
    }
    const sql = fs.readFileSync(sqlPath, 'utf-8');
    console.log(`🔄 Running ${migration}...`);
    try {
      await client.query(sql);
      console.log(`   ✅ ${migration} applied`);
    } catch (err) {
      // Errors like "already exists" are expected for idempotent migrations
      if (err.message.includes('already exists') || err.message.includes('duplicate')) {
        console.log(`   ⚠️  ${migration}: ${err.message} (probably already applied)`);
      } else {
        console.error(`   ❌ ${migration}: ${err.message}`);
      }
    }
  }

  await client.end();
  console.log('\n✅ All migrations processed');
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
