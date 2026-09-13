'use client'

import { Building2, RefreshCw } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 shadow-lg shadow-red-500/25">
          <Building2 className="h-8 w-8 text-white" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Erreur inattendue
          </h1>
          <p className="text-sm text-muted-foreground">
            Quelque chose s&apos;est mal passé. Réessayez ou contactez le support si le problème persiste.
          </p>
          {error.digest && (
            <p className="text-xs text-muted-foreground font-mono">
              Code: {error.digest}
            </p>
          )}
        </div>

        <button
          onClick={reset}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
        >
          <RefreshCw className="h-4 w-4" />
          Réessayer
        </button>
      </div>
    </div>
  )
}
