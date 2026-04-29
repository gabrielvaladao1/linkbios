// @ts-nocheck
import path from 'node:path'
import { config } from 'dotenv'
import { defineConfig } from 'prisma/config'

// Load .env.local (Next.js convention)
config({ path: path.join(__dirname, '.env.local') })

export default defineConfig({
  schema: path.join(__dirname, 'prisma', 'schema.prisma'),
  datasource: {
    // Use DIRECT_URL for schema operations (db push, migrate)
    // DATABASE_URL uses the connection pooler which doesn't support schema changes
    url: process.env.DIRECT_URL,
  },
  migrate: {
    async url() {
      return process.env.DIRECT_URL
    },
  },
})
