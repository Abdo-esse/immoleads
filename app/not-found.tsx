'use client'

import Link from 'next/link'
import { Building2, Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/25">
          <Building2 className="h-8 w-8 text-white" />
        </div>

        <div className="space-y-2">
          <h1 className="text-7xl font-extrabold tracking-tighter bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
            404
          </h1>
          <p className="text-lg font-medium text-foreground">Page introuvable</p>
          <p className="text-sm text-muted-foreground">
            La page que vous cherchez n&apos;existe pas ou a été déplacée.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
          >
            <Home className="h-4 w-4" />
            Dashboard
          </Link>
          <button
            onClick={() => typeof window !== 'undefined' && window.history.back()}
            className="inline-flex items-center justify-center gap-2 rounded-lg border px-6 py-2.5 text-sm font-medium hover:bg-muted transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </button>
        </div>
      </div>
    </div>
  )
}
