import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database'

/**
 * Browser-side Supabase client.
 * Uses cookie-based sessions managed by @supabase/ssr.
 * Safe to use in Client Components.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
