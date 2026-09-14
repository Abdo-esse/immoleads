'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2, AlertCircle } from 'lucide-react'

function AuthCallbackHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function handleAuthCallback() {
      const supabase = createClient()
      const code = searchParams.get('code')
      const next = searchParams.get('next') || '/auth/set-password'

      try {
        // 1. PKCE flow (?code=...)
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
          if (exchangeError) throw exchangeError
          router.replace(next)
          return
        }

        // 2. Implicit / Magic link flow (#access_token=...&refresh_token=...)
        const hash = window.location.hash
        if (hash && hash.includes('access_token')) {
          const hashParams = new URLSearchParams(hash.substring(1))
          const accessToken = hashParams.get('access_token')
          const refreshToken = hashParams.get('refresh_token')

          if (accessToken && refreshToken) {
            const { error: setSessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            })
            if (setSessionError) throw setSessionError
            router.replace(next)
            return
          }
        }

        // 3. Check if session already established in browser
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          router.replace(next)
          return
        }

        // No code or hash found
        setError('Lien d\'invitation invalide ou expiré.')
      } catch (err: any) {
        console.error('[AuthCallback Error]', err)
        setError(err.message || 'Erreur lors de la validation de l\'invitation.')
      }
    }

    handleAuthCallback()
  }, [router, searchParams])

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md space-y-4 rounded-2xl border bg-card p-6 text-center shadow-xl">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div className="rounded-xl bg-red-50 dark:bg-red-950/40 p-4 text-red-600 dark:text-red-400 text-sm font-medium border border-red-200 dark:border-red-800">
            {error}
          </div>
          <a
            href="/login"
            className="inline-block w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition"
          >
            Retour à la page de connexion
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground">
          Validation de l&apos;invitation en cours...
        </p>
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <AuthCallbackHandler />
    </Suspense>
  )
}
