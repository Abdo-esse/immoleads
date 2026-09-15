'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Building2,
  X,
  Mail,
  Phone,
  MapPin,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { updateAgency } from '@/lib/actions/admin'
import type { AgencyWithCounts } from '@/lib/actions/admin'

interface AgencyEditModalProps {
  agency: AgencyWithCounts | null
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function AgencyEditModal({
  agency,
  isOpen,
  onClose,
  onSuccess,
}: AgencyEditModalProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [name, setName] = useState(agency?.name || '')
  const [city, setCity] = useState(agency?.city || '')
  const [phone, setPhone] = useState(agency?.phone || '')
  const [email, setEmail] = useState(agency?.email || '')
  const [whatsappNumber, setWhatsappNumber] = useState(agency?.whatsapp_number || '')

  if (!isOpen || !agency) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError("Le nom de l'agence est obligatoire.")
      return
    }

    setIsSubmitting(true)

    try {
      const res = await updateAgency(agency.id, {
        name,
        city,
        phone,
        email,
        whatsapp_number: whatsappNumber,
      })

      if (!res.success) {
        setError(res.error || "Erreur lors de la mise à jour de l'agence.")
        return
      }

      router.refresh()
      if (onSuccess) onSuccess()
      onClose()
    } catch (err: any) {
      setError(err?.message || "Une erreur inattendue s'est produite.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-xl bg-card border shadow-2xl my-8 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4 bg-muted/40">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold">
                Modifier l'Agence
              </h3>
              <p className="text-xs text-muted-foreground">
                Mettre à jour les coordonnées de l'agence
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-xs font-medium text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              Nom de l'agence <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border bg-background text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Ville
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg border bg-background text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Téléphone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg border bg-background text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              Email officiel
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border bg-background text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              Numéro WhatsApp
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 h-4 w-4 text-primary" />
              <input
                type="tel"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border bg-background text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-60 text-primary-foreground text-sm font-medium shadow-xs transition-colors cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Enregistrement...</span>
                </>
              ) : (
                <span>Sauvegarder</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
