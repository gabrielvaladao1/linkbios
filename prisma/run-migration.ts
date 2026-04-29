// Run migration and create storage bucket
// Usage: npx tsx prisma/run-migration.ts

import { config } from 'dotenv'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'

config({ path: path.join(__dirname, '..', '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

async function main() {
  console.log('🔧 Running migration: Add social_links column...')

  // 1. Add social_links column
  const { error: migError } = await supabase.rpc('exec_sql', {
    query: `
      ALTER TABLE public.users
      ADD COLUMN IF NOT EXISTS social_links JSONB NOT NULL DEFAULT '[]'::jsonb;
    `,
  }).single()

  // If rpc doesn't work, try direct SQL
  if (migError) {
    console.log('   RPC not available, using direct query...')
    const { error } = await supabase.from('users').select('social_links').limit(1)
    if (error && error.message.includes('social_links')) {
      console.log('   ⚠️  Column does not exist yet. Please run the following SQL in Supabase SQL Editor:')
      console.log(`
        ALTER TABLE public.users
        ADD COLUMN IF NOT EXISTS social_links JSONB NOT NULL DEFAULT '[]'::jsonb;
      `)
    } else {
      console.log('   ✅ Column social_links already exists!')
    }
  } else {
    console.log('   ✅ Column social_links added!')
  }

  // 2. Create avatars bucket
  console.log('\n🪣 Creating avatars storage bucket...')
  const { data: buckets } = await supabase.storage.listBuckets()
  const exists = buckets?.some(b => b.name === 'avatars')

  if (exists) {
    console.log('   ✅ Bucket "avatars" already exists!')
  } else {
    const { error: bucketError } = await supabase.storage.createBucket('avatars', {
      public: true,
      fileSizeLimit: 2 * 1024 * 1024, // 2MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    })

    if (bucketError) {
      console.log('   ❌ Error creating bucket:', bucketError.message)
    } else {
      console.log('   ✅ Bucket "avatars" created (public, 2MB limit)!')
    }
  }

  console.log('\n✅ Done!')
}

main().catch(console.error)
