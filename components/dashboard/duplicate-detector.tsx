'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, Merge, X, Loader2, Phone, Mail, MapPin, Calendar, Check } from 'lucide-react'
import { toast } from 'sonner'
import { findDuplicates, mergeLeads, type DuplicateGroup } from '@/lib/actions/deduplication'
import { timeAgo } from '@/lib/utils'

interface Props {
  onClose: () => void
}

const MATCH_LABELS: Record<string, { label: string; color: string }> = {
  phone: { label: 'Téléphone identique', color: 'text-red-600 bg-red-100 dark:bg-red-900/30' },
  email: { label: 'Email identique', color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30' },
  name_city: { label: 'Nom + Ville', color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30' },
}

export function DuplicateDetector({ onClose }: Props) {
  const router = useRouter()
  const [groups, setGroups] = useState<DuplicateGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [merging, setMerging] = useState<string | null>(null)

  useEffect(() => {
    loadDuplicates()
  }, [])

  async function loadDuplicates() {
    setLoading(true)
    const result = await findDuplicates()
    setGroups(result)
    setLoading(false)
  }

  async function handleMerge(keepId: string, deleteId: string) {
    setMerging(deleteId)
    const result = await mergeLeads(keepId, deleteId)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Leads fusionnés avec succès')
      await loadDuplicates()
      router.refresh()
    }
    setMerging(null)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl border bg-card shadow-2xl mx-4 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Doublons Détectés</h2>
              <p className="text-xs text-muted-foreground">
                {groups.length} groupe{groups.length > 1 ? 's' : ''} de doublons potentiels
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(85vh-120px)] p-6 space-y-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : groups.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg font-medium text-emerald-600 flex items-center justify-center gap-1.5">
                <Check className="h-5 w-5" /> Aucun doublon détecté
              </p>
              <p className="text-sm text-muted-foreground mt-1">Votre base est propre !</p>
            </div>
          ) : (
            groups.map((group, gi) => {
              const matchInfo = MATCH_LABELS[group.matchType] || MATCH_LABELS.phone
              return (
                <div key={gi} className="rounded-xl border p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${matchInfo.color}`}>
                      {matchInfo.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Confiance {group.confidence === 'high' ? 'haute' : 'moyenne'}
                    </span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {group.leads.map((lead, li) => (
                      <div
                        key={lead.id}
                        className={`rounded-lg border p-3 space-y-2 ${
                          li === 0 ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20' : ''
                        }`}
                      >
                        {li === 0 && (
                          <span className="text-[10px] font-bold uppercase text-emerald-600 tracking-wider flex items-center gap-1">
                            <Check className="h-3 w-3" /> Original
                          </span>
                        )}
                        <p className="text-sm font-semibold">{lead.name}</p>
                        <div className="space-y-1">
                          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Phone className="h-3 w-3" /> {lead.phone}
                          </p>
                          {lead.email && (
                            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Mail className="h-3 w-3" /> {lead.email}
                            </p>
                          )}
                          {lead.city && (
                            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3" /> {lead.city}
                            </p>
                          )}
                          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" /> {timeAgo(lead.created_at)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium">
                            {lead.status}
                          </span>
                          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium">
                            {lead.source}
                          </span>
                        </div>

                        {li > 0 && (
                          <button
                            onClick={() => handleMerge(group.leads[0].id, lead.id)}
                            disabled={merging === lead.id}
                            className="w-full mt-2 inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-200 dark:border-red-800 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 transition"
                          >
                            {merging === lead.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Merge className="h-3 w-3" />
                            )}
                            Fusionner → Original
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
