'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Sparkles,
  Building2,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Loader2,
  CheckCircle2,
  Send,
  Copy,
  AlertCircle,
} from 'lucide-react'
import { convertDemoRequestToAgency } from '@/lib/actions/admin'
import type { DemoRequest } from '@/types'

interface DemoConversionModalProps {
  demo: DemoRequest | null
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function DemoConversionModal({
  demo,
  isOpen,
  onClose,
  onSuccess,
}: DemoConversionModalProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<{
    agencyName: string
    invitedViaEmail?: boolean
    temporaryPassword?: string | null
    adminEmail?: string
  } | null>(null)
  const [copied, setCopied] = useState(false)

  // Fields initialized from the demo request
  const [agencyName, setAgencyName] = useState(
    demo?.agency_name || `Agence ${demo?.full_name || ''}`
  )
  const [city, setCity] = useState(demo?.city || '')
  const [phone, setPhone] = useState(demo?.phone || '')
  const [adminName, setAdminName] = useState(demo?.full_name || '')
  const [adminEmail, setAdminEmail] = useState('')
  const [sendInvite, setSendInvite] = useState(true)

  if (!isOpen || !demo) return null

  const handleClose = () => {
    setResult(null)
    setError('')
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!agencyName.trim()) {
      setError("Le nom de l'agence est requis.")
      return
    }
    if (!adminName.trim()) {
      setError("Le nom de l'administrateur est requis.")
      return
    }
    if (!adminEmail.trim()) {
      setError("L'adresse email est requise pour créer le compte administrateur.")
      return
    }

    setIsSubmitting(true)

    try {
      const res = await convertDemoRequestToAgency(
        demo.id,
        {
          name: agencyName,
          city: city || undefined,
          phone: phone || undefined,
          email: adminEmail,
        },
        {
          fullName: adminName,
          email: adminEmail,
          sendEmailInvite: sendInvite,
        }
      )

      if (!res.success) {
        setError((res as any).error || "Erreur lors de la conversion de la demande en agence.")
        return
      }

      setResult({
        agencyName,
        invitedViaEmail: res.adminResult?.invitedViaEmail,
        temporaryPassword: res.adminResult?.temporaryPassword,
        adminEmail,
      })

      router.refresh()
      if (onSuccess) onSuccess()
    } catch (err: any) {
      setError(err?.message || "Une erreur inattendue est survenue.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCopyPassword = () => {
    if (result?.temporaryPassword) {
      navigator.clipboard.writeText(result.temporaryPassword)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-xl bg-card border shadow-2xl my-8 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4 bg-muted/40">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold">
                {result ? 'Prospect Converti en Agence' : 'Convertir la Demande en Agence'}
              </h3>
              <p className="text-xs text-muted-foreground">
                {result ? 'Agence activée sur ImmoLeads' : `Demande de ${demo.full_name} (${demo.city})`}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {result ? (
          /* Success Screen */
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 shadow-xs">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-lg font-semibold">
                Félicitations ! L'agence « {result.agencyName} » est créée.
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                La demande de démo est passée au statut <span className="font-semibold text-emerald-600">CONVERTIE</span> et rattachée à cette agence.
              </p>
            </div>

            {result.invitedViaEmail ? (
              <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 p-4 text-left">
                <div className="flex items-start gap-3">
                  <Send className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-semibold text-emerald-900 dark:text-emerald-200">
                      Invitation expédiée par email
                    </p>
                    <p className="text-emerald-700 dark:text-emerald-300 mt-0.5">
                      Un lien direct d'accès a été envoyé à <span className="font-semibold">{result.adminEmail}</span>.
                    </p>
                  </div>
                </div>
              </div>
            ) : result.temporaryPassword ? (
              <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 p-4 text-left space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-900 dark:text-amber-200">
                    Mot de passe initial :
                  </span>
                  <button
                    onClick={handleCopyPassword}
                    className="flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline cursor-pointer"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span>{copied ? 'Copié !' : 'Copier'}</span>
                  </button>
                </div>
                <div className="rounded-md bg-background border p-2.5 font-mono text-sm font-semibold">
                  {result.temporaryPassword}
                </div>
                <p className="text-[11px] text-amber-700 dark:text-amber-300">
                  Transmettez ces identifiants au nouveau client (<span className="font-semibold">{result.adminEmail}</span>).
                </p>
              </div>
            ) : null}

            <div className="pt-2">
              <button
                onClick={handleClose}
                className="w-full py-2 px-4 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium transition-colors cursor-pointer shadow-xs"
              >
                Terminer
              </button>
            </div>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-xs font-medium text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="rounded-lg bg-muted/40 border p-3 text-xs">
              <p className="font-semibold text-foreground">Informations récupérées depuis la landing page :</p>
              <div className="mt-1 grid grid-cols-2 gap-1 text-[11px] text-muted-foreground">
                <span>Équipe : <strong className="text-foreground">{demo.team_size || 'N/A'}</strong></span>
                <span>Volume : <strong className="text-foreground">{demo.monthly_leads || 'N/A'} leads/m</strong></span>
                <span className="col-span-2">Problème : <strong className="text-foreground">{demo.main_problem || 'Non spécifié'}</strong></span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Nom de l'agence <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  required
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
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
                  Téléphone / WhatsApp
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

            <div className="pt-2 border-t space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Compte Administrateur du Client
              </h4>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Nom du responsable <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-lg border bg-background text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Email du responsable (pour login) <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    placeholder="contact@agence.ma"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-lg border bg-background text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-muted-foreground pt-1">
                <input
                  type="checkbox"
                  checked={sendInvite}
                  onChange={(e) => setSendInvite(e.target.checked)}
                  className="rounded border text-primary focus:ring-primary"
                />
                <span>Envoyer une invitation par email (recommandé via SMTP)</span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t">
              <button
                type="button"
                onClick={handleClose}
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
                    <span>Création de l'agence...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Convertir & Activer l'Agence</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
