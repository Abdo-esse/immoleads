'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Loader2, CheckCircle2, Calendar, Phone, Mail, User, Building2, MapPin, Send } from 'lucide-react'
import { submitPublicLead } from '@/lib/actions/leads'
import type { Property } from '@/types'

interface Props {
  properties: Pick<Property, 'id' | 'title' | 'city' | 'price'>[]
  agencyId: string
  agencyName?: string
}

export function RequestVisitForm({ properties, agencyId, agencyName }: Props) {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    const form = new FormData(e.currentTarget)
    const propertyId = (form.get('property_id') as string) || undefined

    const result = await submitPublicLead({
      name: (form.get('name') as string)?.trim(),
      phone: (form.get('phone') as string)?.trim(),
      email: (form.get('email') as string)?.trim() || undefined,
      city: (form.get('city') as string)?.trim() || undefined,
      timeline: ((form.get('timeline') as string) || 'immediate') as
        | 'immediate'
        | '1-3months'
        | '3-6months'
        | '6months+',
      property_id: propertyId,
      agency_id: agencyId,
      source: 'website',
      hp_company_field: (form.get('hp_company_field') as string) || undefined,
    })

    setLoading(false)

    if (result.error) {
      if (typeof result.error === 'object') {
        setErrors(result.error as Record<string, string[]>)
      }
      toast.error('Veuillez vérifier les informations saisies.')
    } else {
      setSubmitted(true)
      toast.success('Votre demande de visite a été enregistrée avec succès !')
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border bg-card p-8 sm:p-12 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h2 className="mt-6 text-2xl font-bold tracking-tight">Demande bien reçue !</h2>
        <p className="mt-3 text-muted-foreground max-w-md mx-auto">
          Un conseiller de notre agence {agencyName ? `(${agencyName})` : ''} prendra contact avec vous par téléphone ou WhatsApp dans les plus brefs délais pour convenir de l&apos;heure et de la date exacte de la visite.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/properties"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
          >
            Explorer d&apos;autres biens
          </Link>
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-xl border bg-background px-6 text-sm font-medium hover:bg-accent transition-colors"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Anti-bot Honeypot field (hidden from humans) */}
      <div style={{ display: 'none' }} aria-hidden="true">
        <input
          name="hp_company_field"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Property selection */}
      <div>
        <label htmlFor="property_id" className="block text-sm font-semibold text-foreground mb-1.5">
          Bien concerné (optionnel)
        </label>
        <div className="relative">
          <Building2 className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
          <select
            id="property_id"
            name="property_id"
            className="flex h-11 w-full rounded-xl border border-input bg-background pl-10 pr-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">-- Visite générale / Découverte de projets --</option>
            {properties.map((prop) => (
              <option key={prop.id} value={prop.id}>
                {prop.title} {prop.city ? `(${prop.city})` : ''} -{' '}
                {new Intl.NumberFormat('fr-MA').format(prop.price)} MAD
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Name and Phone */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-1.5">
            Nom complet <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Ex. Yassine El Amrani"
              className="flex h-11 w-full rounded-xl border border-input bg-background pl-10 pr-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name[0]}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-foreground mb-1.5">
            Numéro de téléphone <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              placeholder="06 12 34 56 78 ou +212..."
              className="flex h-11 w-full rounded-xl border border-input bg-background pl-10 pr-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone[0]}</p>}
        </div>
      </div>

      {/* Email and City */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-1.5">
            Adresse email (optionnel)
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
            <input
              id="email"
              name="email"
              type="email"
              placeholder="votre.email@exemple.com"
              className="flex h-11 w-full rounded-xl border border-input bg-background pl-10 pr-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email[0]}</p>}
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-semibold text-foreground mb-1.5">
            Ville souhaitée
          </label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
            <input
              id="city"
              name="city"
              type="text"
              placeholder="Casablanca, Marrakech, Rabat..."
              className="flex h-11 w-full rounded-xl border border-input bg-background pl-10 pr-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div>
        <label htmlFor="timeline" className="block text-sm font-semibold text-foreground mb-1.5">
          Quand souhaitez-vous réaliser la visite / concrétiser votre projet ?
        </label>
        <div className="relative">
          <Calendar className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
          <select
            id="timeline"
            name="timeline"
            className="flex h-11 w-full rounded-xl border border-input bg-background pl-10 pr-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="immediate">Dès que possible (cette semaine)</option>
            <option value="1-3months">Dans les 1 à 3 mois</option>
            <option value="3-6months">Dans les 3 à 6 mois</option>
            <option value="6months+">Simple découverte / Plus de 6 mois</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Transmission en cours...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Confirmer ma demande de visite
          </>
        )}
      </button>

      <p className="text-center text-xs text-muted-foreground">
        En soumettant ce formulaire, vous acceptez d&apos;être contacté(e) par nos conseillers immobiliers au sujet de votre projet.
      </p>
    </form>
  )
}
