import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/types/database'

// Suppress Supabase's noisy getSession() advisory warning in server logs
if (typeof console !== 'undefined' && !(console as any).__supabaseWarnFiltered) {
  ;(console as any).__supabaseWarnFiltered = true
  const originalWarn = console.warn
  console.warn = (...args: any[]) => {
    if (typeof args[0] === 'string' && args[0].includes('supabase.auth.getSession()')) {
      return
    }
    originalWarn.apply(console, args)
  }
}

/**
 * Server-side Supabase client for RSC and Server Actions.
 * Reads/writes auth cookies via Next.js cookies() API.
 * Respects RLS — queries run as the authenticated user.
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // setAll called from a Server Component (read-only context).
            // Safe to ignore — middleware handles session refresh.
          }
        },
      },
    }
  )
}
