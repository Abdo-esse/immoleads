'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Users,
  X,
  Mail,
  Phone,
  User,
  Building2,
  KeyRound,
  Send,
  Loader2,
  CheckCircle2,
  Copy,
  AlertCircle,
  Shield,
} from 'lucide-react'
import { createUserForAgency } from '@/lib/actions/admin'
import type { AgencyWithCounts } from '@/lib/actions/admin'

interface UserModalProps {
  agencies: AgencyWithCounts[]
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  defaultAgencyId?: string
}

export function UserModal({
  agencies,
  isOpen,
  onClose,
  onSuccess,
  defaultAgencyId,
}: UserModalProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [creationResult, setCreationResult] = useState<{
    userName: string
    userEmail: string
    invitedViaEmail?: boolean
    temporaryPassword?: string | null
  } | null>(null)
  const [copied, setCopied] = useState(false)

  const [agencyId, setAgencyId] = useState(defaultAgencyId || agencies[0]?.id || '')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState<'admin' | 'agent'>('agent')
  const [sendInvite, setSendInvite] = useState(true)
  const [customPassword, setCustomPassword] = useState('')

  if (!isOpen) return null

  const resetForm = () => {
    setFullName('')
    setEmail('')
    setPhone('')
    setRole('agent')
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

    if (!agencyId) {
      setError("Veuillez sélectionner une agence.")
      return
    }
    if (!fullName.trim()) {
      setError("Le nom complet est obligatoire.")
      return
    }
    if (!email.trim()) {
      setError("L'adresse email est obligatoire.")
      return
    }

    setIsSubmitting(true)

    try {
      const res = await createUserForAgency(agencyId, {
        fullName,
        email,
        phone: phone || undefined,
        role,
        sendEmailInvite: sendInvite,
        password: !sendInvite && customPassword ? customPassword : undefined,
      })

      if (!res.success) {
        setError(res.error || "Erreur lors de la création de l'utilisateur.")
        return
      }

      setCreationResult({
        userName: fullName,
        userEmail: email,
        invitedViaEmail: res.invitedViaEmail,
        temporaryPassword: res.temporaryPassword,
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
    if (creationResult?.temporaryPassword) {
      navigator.clipboard.writeText(creationResult.temporaryPassword)
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
              <Users className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold">
                {creationResult ? 'Utilisateur créé' : 'Ajouter un Collaborateur'}
              </h3>
              <p className="text-xs text-muted-foreground">
                {creationResult ? 'Accès configuré avec succès' : 'Affecter un agent ou un administrateur à une agence'}
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
                Compte créé pour {creationResult.userName} !
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                L’utilisateur a été rattaché à son agence avec succès.
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
                      Un lien direct a été transmis à <span className="font-semibold">{creationResult.userEmail}</span> pour lui permettre d'activer son compte et choisir son mot de passe.
                    </p>
                  </div>
                </div>
              </div>
            ) : creationResult.temporaryPassword ? (
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
                  {creationResult.temporaryPassword}
                </div>
                <p className="text-[11px] text-amber-700 dark:text-amber-300">
                  Transmettez ces identifiants au collaborateur (<span className="font-semibold">{creationResult.userEmail}</span>).
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

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Agence de rattachement <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <select
                  required
                  value={agencyId}
                  onChange={(e) => setAgencyId(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg border bg-background text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
                >
                  <option value="" disabled>Sélectionner une agence</option>
                  {agencies.map((ag) => (
                    <option key={ag.id} value={ag.id}>
                      {ag.name} {ag.city ? `(${ag.city})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Nom complet <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  required
                  placeholder="Ex: Youssef El Idrissi"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg border bg-background text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Email professionnel <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    placeholder="youssef@agence.ma"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-lg border bg-background text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Téléphone (optionnel)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="tel"
                    placeholder="0600000000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-lg border bg-background text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Rôle dans l'agence
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('agent')}
                  className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                    role === 'agent'
                      ? 'border-primary bg-primary/10 text-foreground font-semibold'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    <span className="text-sm">Agent Commercial</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Gère les leads et visites assignés
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                    role === 'admin'
                      ? 'border-primary bg-primary/10 text-foreground font-semibold'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <span className="text-sm">Admin Agence</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Gestion totale de l'agence
                  </p>
                </button>
              </div>
            </div>

            <div className="pt-2 border-t">
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
                    Mot de passe initial (généré automatiquement si vide)
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Laisser vide pour générer automatiquement"
                      value={customPassword}
                      onChange={(e) => setCustomPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 rounded-lg border bg-background text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
                    />
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
                    <span>Création...</span>
                  </>
                ) : (
                  <>
                    <Users className="h-4 w-4" />
                    <span>Créer le Compte</span>
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
