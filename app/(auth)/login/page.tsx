'use client'

import { Suspense, useState } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { signIn } from '@/lib/actions/auth'
import { Building2, Loader2, BarChart3, Users, TrendingUp, Shield } from 'lucide-react'

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
        return
      }

      setError(err?.message || 'Erreur lors de la connexion')
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
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

      {/* ─── LEFT PANEL: Brand / Hero ─── */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a1f4e 0%, #2d3a8c 50%, #1e2a6e 100%)' }}>
        {/* Gradient background overlay for depth */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #1a1f4e 0%, #2d3a8c 50%, #1e2a6e 100%)' }} />

        {/* Decorative geometric shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 -right-32 w-[500px] h-[500px] bg-indigo-400/10 rounded-full blur-3xl" />
          <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-blue-400/8 rounded-full blur-2xl" />

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }} />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo/favicon.png"
              alt="ATLORYX"
              width={44}
              height={44}
              className="rounded-xl"
            />
            <div>
              <span className="text-white font-bold text-xl tracking-tight">ATLORYX</span>
              <span className="block text-indigo-300 text-xs font-medium tracking-wider uppercase">ImmoLeads</span>
            </div>
          </div>

          {/* Hero text */}
          <div className="space-y-8 max-w-lg">
            <div className="space-y-4">
              <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
                Du clic<br />
                <span style={{
                  background: 'linear-gradient(90deg, #a5b4fc, #93c5fd)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  à la visite.
                </span>
              </h1>
              <p className="text-indigo-200/80 text-lg leading-relaxed">
                Qualifiez vos leads immobiliers, automatisez votre prospection et 
                transformez chaque contact en opportunité.
              </p>
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/20">
                  <BarChart3 className="h-5 w-5 text-indigo-300" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Analytics</p>
                  <p className="text-indigo-300/70 text-xs">Tableau de bord en temps réel</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/20">
                  <Users className="h-5 w-5 text-blue-300" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">CRM</p>
                  <p className="text-indigo-300/70 text-xs">Gestion multi-agences</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20">
                  <TrendingUp className="h-5 w-5 text-emerald-300" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Conversion</p>
                  <p className="text-indigo-300/70 text-xs">Qualification automatique</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/20">
                  <Shield className="h-5 w-5 text-amber-300" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Sécurité</p>
                  <p className="text-indigo-300/70 text-xs">Données chiffrées</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom testimonial / stat */}
          <div className="flex items-center mt-2 gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 max-w-md">
            <div className="flex -space-x-2">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-400 to-blue-500 border-2 border-[#1e2a6e] flex items-center justify-center text-white text-xs font-bold">🔒</div>
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 border-2 border-[#1e2a6e] flex items-center justify-center text-white text-xs font-bold">⚡</div>
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-[#1e2a6e] flex items-center justify-center text-white text-xs font-bold">🇲🇦</div>
            </div>
            <div>
              <p className="text-white text-sm font-medium">Solution sécurisée & hébergée au cloud</p>
              <p className="text-indigo-300/60 text-xs">Conçue pour les agences immobilières au Maroc</p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── RIGHT PANEL: Login Form ─── */}
      <div className="flex w-full lg:w-1/2 xl:w-[45%] items-center justify-center px-5 py-8 sm:p-10 bg-background">
        <div className="w-full max-w-[420px] space-y-5 sm:space-y-8">
          {/* Mobile logo (shown only on small screens) */}
          <div className="flex lg:hidden items-center justify-center gap-3 mb-4">
            <Image
              src="/images/logo/favicon.png"
              alt="ATLORYX"
              width={40}
              height={40}
              className="rounded-xl"
            />
            <div>
              <span className="font-bold text-lg tracking-tight">ATLORYX</span>
              <span className="block text-muted-foreground text-xs font-medium tracking-wider uppercase">ImmoLeads</span>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1.5 text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Bienvenue
            </h2>
            <p className="text-sm text-muted-foreground">
              Connectez-vous à votre espace ImmoLeads
            </p>
          </div>

          {/* Login Card */}
          <div className="relative rounded-xl border bg-card p-5 sm:p-6 shadow-sm space-y-5 sm:space-y-6 overflow-hidden">
            {/* Animated Progress Bar at top of card when submitting */}
            {loading && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-primary/20 overflow-hidden z-20">
                <div className="h-full bg-primary animate-pulse w-full" />
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 shrink-0 mt-0.5">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium leading-none"
                >
                  Adresse email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  disabled={loading}
                  placeholder="omar@immomaroc.ma"
                  className="flex h-11 w-full rounded-lg border border-input bg-background px-3.5 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium leading-none"
                  >
                    Mot de passe
                  </label>
                  {/* Optional: forgot password link */}
                  {/* <a href="#" className="text-xs text-primary hover:underline">Mot de passe oublié ?</a> */}
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  disabled={loading}
                  placeholder="••••••••"
                  className="flex h-11 w-full rounded-lg border border-input bg-background px-3.5 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-60 cursor-pointer active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Connexion en cours...</span>
                  </>
                ) : (
                  'Se connecter'
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} ATLORYX ImmoLeads — Tous droits réservés
          </p>
        </div>
      </div>
    </div>
  )
}

function LoginFallback() {
  return (
    <div className="flex min-h-screen">
      {/* Left panel skeleton */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a1f4e 0%, #2d3a8c 50%, #1e2a6e 100%)' }}>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #1a1f4e 0%, #2d3a8c 50%, #1e2a6e 100%)' }} />
        <div className="relative z-10 flex flex-col items-center justify-center w-full">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-300" />
        </div>
      </div>

      {/* Right panel skeleton */}
      <div className="flex w-full lg:w-1/2 xl:w-[45%] items-center justify-center p-6 sm:p-10 bg-background">
        <div className="w-full max-w-[420px] space-y-8">
          <div className="space-y-2">
            <div className="h-8 w-32 bg-muted animate-pulse rounded-lg" />
            <div className="h-4 w-56 bg-muted animate-pulse rounded-lg" />
          </div>
          <div className="rounded-xl border bg-card p-12 flex flex-col items-center justify-center space-y-3 shadow-sm">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-xs text-muted-foreground">Initialisation en cours...</p>
          </div>
        </div>
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
