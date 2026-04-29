import { createClient } from '@supabase/supabase-js'

// Admin client — usa service_role. SOMENTE importar em Server Actions
// ('use server') ou Route Handlers (api/*). NUNCA em componentes 'use client'.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
