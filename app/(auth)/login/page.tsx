'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { signIn } from '@/lib/actions/auth'
import { Building2, Loader2 } from 'lucide-react'

function LoginForm() {
  const searchParams = useSearchParams()
  const redirectParam = searchParams.get('redirect')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    if (redirectParam) {
      formData.append('redirect', redirectParam)
    }

    try {
      const result = await signIn(formData)
      if (result?.error) {
        setError(result.error)
        setLoading(false)
      }
    } catch (err: any) {
      const isRedirect =
        err?.message?.includes('NEXT_REDIRECT') ||
        err?.digest?.includes('NEXT_REDIRECT') ||
        err?.message === 'NEXT_REDIRECT'

      if (isRedirect) {
        // Next.js redirection in progress: keep loader active until page transitions
        return
      }

      setError(err?.message || 'Erreur lors de la connexion')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Full-screen Loading Overlay on Submit */}
      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm p-4 text-center animate-in fade-in duration-200">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-lg border border-primary/20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
          <p className="mt-4 text-base font-semibold text-foreground">
            Connexion en cours...
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Vérification des accès et redirection vers votre espace...
          </p>
        </div>
      )}

      {/* Logo & Title */}
      <div className="text-center space-y-3">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
          <Building2 className="h-7 w-7 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">ImmoLeads</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sign in to your CRM dashboard
          </p>
        </div>
      </div>

      {/* Login Card */}
      <div className="relative rounded-xl border bg-card p-6 shadow-sm space-y-6 overflow-hidden">
        {/* Animated Progress Bar at top of card when submitting */}
        {loading && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary/20 overflow-hidden z-20">
            <div className="h-full bg-primary animate-pulse w-full" />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium leading-none"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              disabled={loading}
              placeholder="omar@immomaroc.ma"
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium leading-none"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              disabled={loading}
              placeholder="••••••••"
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Connexion en cours...</span>
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>
      </div>

      {/* Demo credentials hint */}
     {/* <div className="rounded-lg border border-dashed p-4 text-center">
        <p className="text-xs text-muted-foreground">
          Demo credentials — create users in your Supabase dashboard
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Admin: <code className="rounded bg-muted px-1">omar@immomaroc.ma</code>
        </p>
      </div>*/}
    </div>
  )
}

function LoginFallback() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
          <Building2 className="h-7 w-7 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">ImmoLeads</h1>
          <p className="text-sm text-muted-foreground mt-1">Chargement de la page de connexion...</p>
        </div>
      </div>
      <div className="rounded-xl border bg-card p-12 flex flex-col items-center justify-center space-y-3 shadow-xs">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground">Initialisation en cours...</p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  )
}
