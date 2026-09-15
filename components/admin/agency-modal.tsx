'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Building2,
  X,
  Mail,
  Phone,
  MapPin,
  User,
  KeyRound,
  Send,
  Loader2,
  CheckCircle2,
  Copy,
  AlertCircle,
} from 'lucide-react'
import { createAgencyWithAdmin } from '@/lib/actions/admin'

interface AgencyModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function AgencyModal({ isOpen, onClose, onSuccess }: AgencyModalProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [creationResult, setCreationResult] = useState<{
    success: boolean
    agencyName: string
    invitedViaEmail?: boolean
    temporaryPassword?: string | null
    adminEmail?: string
  } | null>(null)
  const [copied, setCopied] = useState(false)

  // Agency fields
  const [agencyName, setAgencyName] = useState('')
  const [city, setCity] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [whatsappNumber, setWhatsappNumber] = useState('')

  // Admin fields
  const [createAdmin, setCreateAdmin] = useState(true)
  const [adminName, setAdminName] = useState('')
  const [adminEmail, setAdminEmail] = useState('')
  const [sendInvite, setSendInvite] = useState(true)
  const [customPassword, setCustomPassword] = useState('')

  if (!isOpen) return null

  const resetForm = () => {
    setAgencyName('')
    setCity('')
    setPhone('')
    setEmail('')
    setWhatsappNumber('')
    setAdminName('')
    setAdminEmail('')
    setCustomPassword('')
    setCreationResult(null)
    setError('')
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!agencyName.trim()) {
      setError("Le nom de l'agence est obligatoire.")
      return
    }

    if (createAdmin) {
      if (!adminName.trim()) {
        setError("Le nom de l'administrateur est obligatoire.")
        return
      }
      if (!adminEmail.trim()) {
        setError("L'email de l'administrateur est obligatoire.")
        return
      }
    }

    setIsSubmitting(true)

    try {
      const res = await createAgencyWithAdmin(
        {
          name: agencyName,
          city: city || undefined,
          phone: phone || undefined,
          email: email || undefined,
          whatsapp_number: whatsappNumber || undefined,
        },
        createAdmin
          ? {
              fullName: adminName,
              email: adminEmail,
              sendEmailInvite: sendInvite,
              password: !sendInvite && customPassword ? customPassword : undefined,
            }
          : undefined
      )

      if (!res.success) {
        setError((res as any).error || "Erreur lors de la création de l'agence.")
        return
      }

      setCreationResult({
        success: true,
        agencyName: res.agency?.name || agencyName,
        invitedViaEmail: res.adminResult?.invitedViaEmail,
        temporaryPassword: res.adminResult?.temporaryPassword ?? undefined,
        adminEmail: adminEmail,
      })

      router.refresh()
      if (onSuccess) onSuccess()
    } catch (err: any) {
      setError(err?.message || "Une erreur inattendue s'est produite.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCopyPassword = () => {
    if (creationResult?.temporaryPassword) {
      navigator.clipboard.writeText(creationResult.temporaryPassword)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-xl bg-card border shadow-2xl my-8 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b px-6 py-4 bg-muted/40">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold">
                {creationResult ? 'Agence créée avec succès' : 'Ajouter une Nouvelle Agence'}
              </h3>
              <p className="text-xs text-muted-foreground">
                {creationResult ? 'Informations d’accès transmises' : 'Créer un tenant immobilier et son administrateur'}
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

        {creationResult ? (
          /* Success Screen */
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 shadow-xs">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-lg font-semibold">
                L'agence « {creationResult.agencyName} » est prête !
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                L’environnement CRM pour cette agence a été configuré avec succès.
              </p>
            </div>

            {creationResult.invitedViaEmail ? (
              <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 p-4 text-left">
                <div className="flex items-start gap-3">
                  <Send className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-semibold text-emerald-900 dark:text-emerald-200">
                      Invitation par email envoyée
                    </p>
                    <p className="text-emerald-700 dark:text-emerald-300 mt-0.5">
                      Un lien direct d'activation a été expédié à{' '}
                      <span className="font-semibold">{creationResult.adminEmail}</span>. L'administrateur pourra définir son mot de passe en cliquant dessus.
                    </p>
                  </div>
                </div>
              </div>
            ) : creationResult.temporaryPassword ? (
              <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 p-4 text-left space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-900 dark:text-amber-200">
                    Mot de passe initial généré :
                  </span>
                  <button
                    onClick={handleCopyPassword}
                    className="flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline cursor-pointer"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span>{copied ? 'Copié !' : 'Copier'}</span>
                  </button>
                </div>
                <div className="rounded-md bg-background border p-2.5 font-mono text-sm font-semibold flex items-center justify-between">
                  <span>{creationResult.temporaryPassword}</span>
                </div>
                <p className="text-[11px] text-amber-700 dark:text-amber-300">
                  Communiquez ces identifiants à l'administrateur (<span className="font-semibold">{creationResult.adminEmail}</span>).
                </p>
              </div>
            ) : null}

            <div className="pt-2">
              <button
                onClick={handleClose}
                className="w-full py-2 px-4 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium transition-colors cursor-pointer shadow-xs"
              >
                Fermer
              </button>
            </div>
          </div>
        ) : (
          /* Creation Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-xs font-medium text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Section 1: Agence */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                1. Coordonnées de l'Agence
              </h4>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Nom de l'agence <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: Atlas Prestige Immobilier"
                    value={agencyName}
                    onChange={(e) => setAgencyName(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-lg border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Ville principale
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Ex: Marrakech, Casablanca..."
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 rounded-lg border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Téléphone agence
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                      type="tel"
                      placeholder="Ex: 0524000000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 rounded-lg border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Numéro WhatsApp officiel (pour les leads)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-primary" />
                  <input
                    type="tel"
                    placeholder="Ex: 212600000000"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-lg border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Administrateur */}
            <div className="pt-2 border-t space-y-3.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  2. Administrateur Principal
                </h4>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={createAdmin}
                    onChange={(e) => setCreateAdmin(e.target.checked)}
                    className="rounded border text-primary focus:ring-primary"
                  />
                  <span>Créer un administrateur</span>
                </label>
              </div>

              {createAdmin && (
                <div className="space-y-3 rounded-lg bg-muted/30 p-3.5 border">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      Nom complet <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        required={createAdmin}
                        placeholder="Ex: Mehdi Bennani"
                        value={adminName}
                        onChange={(e) => setAdminName(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 rounded-lg border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      Email de connexion <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <input
                        type="email"
                        required={createAdmin}
                        placeholder="Ex: direction@atlasprestige.ma"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 rounded-lg border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
                      />
                    </div>
                  </div>

                  <div className="pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-muted-foreground">
                      <input
                        type="checkbox"
                        checked={sendInvite}
                        onChange={(e) => setSendInvite(e.target.checked)}
                        className="rounded border text-primary focus:ring-primary"
                      />
                      <span>Envoyer une invitation par email (recommandé via SMTP)</span>
                    </label>

                    {!sendInvite && (
                      <div className="mt-2.5">
                        <label className="block text-xs font-medium text-foreground mb-1">
                          Mot de passe initial (optionnel, généré automatiquement si vide)
                        </label>
                        <div className="relative">
                          <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <input
                            type="text"
                            placeholder="Laisser vide pour générer un mot de passe sécurisé"
                            value={customPassword}
                            onChange={(e) => setCustomPassword(e.target.value)}
                            className="w-full pl-9 pr-3 py-1.5 rounded-lg border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
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
                    <span>Création en cours...</span>
                  </>
                ) : (
                  <>
                    <Building2 className="h-4 w-4" />
                    <span>Créer l'Agence</span>
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
