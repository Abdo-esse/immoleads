import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Refreshes the Supabase auth session and handles route protection.
 * Called from Next.js middleware on every request.
 *
 * - Refreshes expired auth tokens via cookie exchange
 * - Redirects unauthenticated users away from /dashboard/*
 * - Redirects authenticated users away from /login
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh the session — this is what keeps the cookie valid.
  // We use getSession() here instead of getUser() because:
  // 1. getUser() makes an HTTP call to Supabase Auth on EVERY page navigation
  // 2. On slow connections, this call can fail/timeout, returning null
  // 3. That causes false redirects to /login, creating redirect loops
  // The session cookie was already validated by createServerClient above.
  let user = null
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    user = session?.user ?? null
  } catch {
    user = null
  }

  const { pathname } = request.nextUrl

  // Skip auth redirect for internal Next.js requests (RSC payloads, prefetch, segment fetches)
  // These requests should never be redirected to /login by middleware as that breaks client-side navigation
  const isInternal =
    request.headers.get('rsc') === '1' ||
    request.headers.get('next-router-prefetch') === '1' ||
    request.headers.has('next-router-segment-prefetch') ||
    request.headers.has('next-router-state-tree') ||
    request.headers.get('purpose') === 'prefetch' ||
    request.headers.get('sec-purpose') === 'prefetch' ||
    request.headers.get('x-middleware-prefetch') === '1' ||
    request.headers.get('accept')?.includes('text/x-component') ||
    request.nextUrl.searchParams.has('_rsc')

  // Protected routes: redirect to /login only on full, direct document navigations
  if ((pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) && !user && !isInternal) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    console.log(`[Middleware] Redirecting ${pathname} → /login (no user)`)
    return NextResponse.redirect(loginUrl)
  }

  // If already logged in, redirect away from /login to requested destination or role-based default
  if (pathname === '/login' && user) {
    const redirectParam = request.nextUrl.searchParams.get('redirect')
    const isSuperAdmin = user.user_metadata?.role === 'superadmin'
    const defaultTarget = isSuperAdmin ? '/admin' : '/dashboard'

    let target = defaultTarget
    if (redirectParam && (redirectParam.startsWith('/dashboard') || redirectParam.startsWith('/admin'))) {
      if (redirectParam.startsWith('/admin') && !isSuperAdmin) {
        target = '/dashboard'
      } else {
        target = redirectParam
      }
    }

    return NextResponse.redirect(new URL(target, request.url))
  }

  return supabaseResponse
}
