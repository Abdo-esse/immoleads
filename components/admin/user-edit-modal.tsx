'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Users,
  X,
  Phone,
  User,
  Building2,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { updateUserProfile } from '@/lib/actions/admin'
import type { GlobalUserWithAgency, AgencyWithCounts } from '@/lib/actions/admin'

interface UserEditModalProps {
  user: GlobalUserWithAgency | null
  agencies: AgencyWithCounts[]
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function UserEditModal({
  user,
  agencies,
  isOpen,
  onClose,
  onSuccess,
}: UserEditModalProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [fullName, setFullName] = useState(user?.full_name || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [role, setRole] = useState<'superadmin' | 'admin' | 'agent'>(user?.role || 'agent')
  const [agencyId, setAgencyId] = useState(user?.agency_id || '')

  if (!isOpen || !user) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!fullName.trim()) {
      setError("Le nom complet est obligatoire.")
      return
    }

    setIsSubmitting(true)

    try {
      const res = await updateUserProfile(user.id, {
        fullName,
        phone: phone || null,
        role,
        agencyId: agencyId || null,
      })

      if (!res.success) {
        setError(res.error || "Erreur lors de la mise à jour.")
        return
      }

      router.refresh()
      if (onSuccess) onSuccess()
      onClose()
    } catch (err: any) {
      setError(err?.message || "Une erreur inattendue est survenue.")
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
              <Users className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold">
                Modifier l'Utilisateur
              </h3>
              <p className="text-xs text-muted-foreground">
                {user.email}
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
              Nom complet <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
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

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              Agence de rattachement
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <select
                value={agencyId || ''}
                onChange={(e) => setAgencyId(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border bg-background text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
              >
                <option value="">Indépendant / SuperAdmin (Aucune)</option>
                {agencies.map((ag) => (
                  <option key={ag.id} value={ag.id}>
                    {ag.name} {ag.city ? `(${ag.city})` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Rôle
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRole('agent')}
                className={`p-2.5 rounded-lg border text-center text-xs font-medium transition-all cursor-pointer ${
                  role === 'agent'
                    ? 'border-primary bg-primary/10 text-foreground font-semibold'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                Agent
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`p-2.5 rounded-lg border text-center text-xs font-medium transition-all cursor-pointer ${
                  role === 'admin'
                    ? 'border-primary bg-primary/10 text-foreground font-semibold'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                Admin Agence
              </button>
              <button
                type="button"
                onClick={() => setRole('superadmin')}
                className={`p-2.5 rounded-lg border text-center text-xs font-medium transition-all cursor-pointer ${
                  role === 'superadmin'
                    ? 'border-primary bg-primary text-primary-foreground font-semibold'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                SuperAdmin
              </button>
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
