import { createClient } from '@supabase/supabase-js'

/**
 * Admin Supabase client using the service-role key.
 * ⚠️  BYPASSES RLS — use only in server-side code (API routes, Server Actions).
 * ⚠️  NEVER import this in Client Components or expose the key.
 *
 * Used for:
 * - Public lead form submissions (POST /api/leads)
 * - Admin operations that need cross-tenant access
 * - Seed scripts
 *
 * Note: Untyped to avoid `never` resolution issues with Supabase client generics.
 * All data is validated at runtime via Zod.
 */
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)
