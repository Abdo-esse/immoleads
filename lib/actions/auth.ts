'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import type { Profile } from '@/types'

/**
 * Sign in with email and password.
 * Returns an error message on failure, or redirects to /dashboard on success.
 */
export async function signIn(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // Fetch the user's role to determine the correct landing page
  let userRole = 'agent'
  if (data?.user?.id) {
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    if (profile?.role) {
      userRole = profile.role
    }
  }

  const rawRedirect = formData.get('redirect')
  const redirectTo = typeof rawRedirect === 'string' ? rawRedirect.trim() : ''

  // Prevent Open Redirect (CWE-601): only allow internal relative paths
  const isSafeRedirect =
    redirectTo.startsWith('/') &&
    !redirectTo.startsWith('//') &&
    !redirectTo.includes('\\') &&
    !redirectTo.includes('://')

  let destination = userRole === 'superadmin' ? '/admin' : '/dashboard'

  if (isSafeRedirect) {
    if (userRole === 'superadmin') {
      if (redirectTo.startsWith('/admin')) {
        destination = redirectTo
      } else if (redirectTo !== '/dashboard') {
        destination = redirectTo
      } else {
        destination = '/admin'
      }
    } else {
      // Non-superadmin users should not be redirected to /admin
      if (redirectTo.startsWith('/admin')) {
        destination = '/dashboard'
      } else {
        destination = redirectTo
      }
    }
  }

  redirect(destination)
}

/**
 * Sign out the current user and redirect to /login.
 */
export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

/**
 * Get the current authenticated user's profile.
 * Returns null if not authenticated.
 */
export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return profile
}

/**
 * Get the current user's session info (user + profile).
 * Uses getSession() (reads cookie locally, no HTTP round-trip) instead of
 * getUser() which makes a network call that can fail due to cookie race
 * conditions between middleware and server components, causing redirect loops.
 *
 * The middleware already validates the auth token on every request,
 * so reading the session from the cookie here is safe.
 */
export async function requireAuth(): Promise<{
  user: { id: string; email: string }
  profile: Profile
}> {
  const supabase = await createClient()

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  let user = session?.user

  // If getSession didn't find a user, fallback to getUser()
  if (!user) {
    const { data: userData } = await supabase.auth.getUser()
    user = userData?.user ?? undefined
  }

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/login')
  }

  return {
    user: { id: user.id, email: user.email! },
    profile,
  }
}

/**
 * Require admin or superadmin role. Redirects to /dashboard if the user is not an admin.
 */
export async function requireAdmin(): Promise<{
  user: { id: string; email: string }
  profile: Profile
}> {
  const result = await requireAuth()

  if (result.profile.role !== 'admin' && result.profile.role !== 'superadmin') {
    redirect('/dashboard')
  }

  return result
}

/**
 * Require superadmin role. Redirects to /dashboard if the user is not a superadmin.
 */
export async function requireSuperAdmin(): Promise<{
  user: { id: string; email: string }
  profile: Profile
}> {
  const result = await requireAuth()

  if (result.profile.role !== 'superadmin') {
    redirect('/dashboard')
  }

  return result
}

