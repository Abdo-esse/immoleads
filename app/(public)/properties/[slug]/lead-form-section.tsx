'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Loader2, CheckCircle2, Send } from 'lucide-react'
import { submitPublicLead } from '@/lib/actions/leads'

interface Props {
  propertyId: string
  agencyId: string
  propertyTitle: string
}

export function LeadFormSection({ propertyId, agencyId, propertyTitle }: Props) {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [generalError, setGeneralError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    setGeneralError(null)

    const form = new FormData(e.currentTarget)

    const result = await submitPublicLead({
      name: form.get('name') as string,
      phone: form.get('phone') as string,
      email: (form.get('email') as string) || undefined,
      budget_min: Number(form.get('budget_min')) || null,
      budget_max: Number(form.get('budget_max')) || null,
      timeline: (form.get('timeline') as string || null) as 'immediate' | '1-3months' | '3-6months' | '6months+' | null,
      property_id: propertyId,
      agency_id: agencyId,
      source: 'website',
    })

    setLoading(false)

    if (result.error) {
      console.error('[lead-form-section error details]: ' + JSON.stringify(result.error))
      setGeneralError(JSON.stringify(result.error))
      if (typeof result.error === 'object') {
        setErrors(result.error as Record<string, string[]>)
      }
      toast.error("Erreur lors de l'envoi du formulaire")
    } else {
      setSubmitted(true)
      toast.success('Votre demande a été envoyée avec succès !')
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border bg-card p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
          <CheckCircle2 className="h-8 w-8 text-emerald-600" />
        </div>
        <h3 className="mt-4 text-xl font-bold">Merci pour votre intérêt !</h3>
        <p className="mt-2 text-muted-foreground">
          Un agent vous contactera dans les 24 heures pour organiser une visite de
          <span className="font-medium text-foreground"> {propertyTitle}</span>.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border bg-card p-6 sm:p-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Intéressé par ce bien ?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Remplissez ce formulaire rapide et un agent vous contactera sous 24h.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Nom complet *</label>
            <input
              name="name"
              required
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Votre nom"
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name[0]}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Téléphone *</label>
            <input
              name="phone"
              type="tel"
              required
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="06 XX XX XX XX"
            />
            {errors.phone && <p className="text-xs text-destructive">{errors.phone[0]}</p>}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Email (optionnel)</label>
          <input
            name="email"
            type="email"
            className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="votre@email.com"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Budget min (MAD)</label>
            <input
              name="budget_min"
              type="number"
              min={0}
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="500 000"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Budget max (MAD)</label>
            <input
              name="budget_max"
              type="number"
              min={0}
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="1 200 000"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Quand ?</label>
            <select
              name="timeline"
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
            >
              <option value="">Sélectionner...</option>
              <option value="immediate">Immédiatement</option>
              <option value="1-3months">1-3 mois</option>
              <option value="3-6months">3-6 mois</option>
              <option value="6months+">6 mois+</option>
            </select>
          </div>
        </div>


        <button
          type="submit"
          disabled={loading}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Envoi en cours...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Envoyer ma demande
            </>
          )}
        </button>
      </form>
    </div>
  )
}
