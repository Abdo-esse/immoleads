'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Building2,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Share2,
  ExternalLink,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Target,
  CheckCircle2,
  AlertTriangle,
  Circle,
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { getMatchLabel, type MatchResult } from '@/lib/utils/matching'
import type { Lead } from '@/types'

interface Props {
  matches: MatchResult[]
  lead: Pick<Lead, 'name' | 'phone' | 'city' | 'budget_min' | 'budget_max'>
}

const MATCH_ICONS = {
  excellent: Target,
  good: CheckCircle2,
  medium: AlertTriangle,
  low: Circle,
}

export function LeadPropertyMatches({ matches, lead }: Props) {
  const [expanded, setExpanded] = useState(true)
  const [showScoreDetails, setShowScoreDetails] = useState<string | null>(null)

  if (matches.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-6">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-950/40">
            <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
          <h2 className="text-lg font-semibold">Biens correspondants</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Aucun bien ne correspond aux critères de ce prospect pour le moment.
          Ajoutez des biens actifs dans votre catalogue pour activer le moteur de rapprochement.
        </p>
      </div>
    )
  }

  const handleWhatsAppShare = (selectedMatches: MatchResult[]) => {
    const propertyLines = selectedMatches
      .map((m, i) => {
        const p = m.property
        return `${i + 1}. *${p.title}*\n   Ville: ${p.city}${p.district ? ` - ${p.district}` : ''}\n   Prix: ${formatPrice(p.price)} MAD\n   Type: ${p.type}${p.bedrooms ? ` · ${p.bedrooms} ch.` : ''}${p.area ? ` · ${p.area}m²` : ''}\n   Match: ${m.score}%`
      })
      .join('\n\n')

    const message = `Bonjour ${lead.name},\n\nSuite à votre recherche, voici les biens qui correspondent à vos critères :\n\n${propertyLines}\n\nN'hésitez pas à me contacter pour organiser une visite !`

    const waUrl = `https://wa.me/${lead.phone.replace(/[^0-9+]/g, '')}?text=${encodeURIComponent(message)}`
    window.open(waUrl, '_blank')
  }

  return (
    <div className="rounded-xl border bg-card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/20 to-indigo-500/20">
            <Sparkles className="h-4 w-4 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">
              Biens correspondants
              <span className="ml-2 inline-flex items-center justify-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                {matches.length}
              </span>
            </h2>
            <p className="text-xs text-muted-foreground">
              Basé sur la ville, le budget et le type de bien recherché
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleWhatsAppShare(matches.slice(0, 3))}
            className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-green-700"
            title="Partager les 3 meilleurs résultats via WhatsApp"
          >
            <Share2 className="h-3.5 w-3.5" />
            WhatsApp Top 3
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border hover:bg-accent"
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Property Cards */}
      {expanded && (
        <div className="grid gap-3 sm:grid-cols-2">
          {matches.map((match) => {
            const p = match.property
            const matchInfo = getMatchLabel(match.score)
            const MatchIcon = MATCH_ICONS[matchInfo.key]
            const isDetailOpen = showScoreDetails === p.id

            return (
              <div
                key={p.id}
                className="group relative rounded-xl border bg-background p-4 transition-all hover:shadow-md hover:border-primary/30"
              >
                {/* Score Badge */}
                <div className="absolute -top-2 -right-2 z-10">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold shadow-sm ${matchInfo.colorClass}`}
                  >
                    <MatchIcon className="h-3 w-3" /> {match.score}%
                  </span>
                </div>

                {/* Property Image or Placeholder */}
                <div className="relative mb-3 h-32 w-full overflow-hidden rounded-lg bg-muted">
                  {p.images && p.images.length > 0 ? (
                    <img
                      src={p.images[0]}
                      alt={p.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Building2 className="h-8 w-8 text-muted-foreground/40" />
                    </div>
                  )}
                  <span className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                    {p.type}
                  </span>
                </div>

                {/* Property Info */}
                <h3 className="font-semibold text-sm line-clamp-1">{p.title}</h3>
                <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {p.city}{p.district ? ` - ${p.district}` : ''}
                </div>
                <p className="mt-1.5 text-sm font-bold text-primary">
                  {formatPrice(p.price)} MAD
                </p>

                {/* Property Specs */}
                <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                  {p.bedrooms != null && (
                    <span className="flex items-center gap-1">
                      <Bed className="h-3 w-3" /> {p.bedrooms}
                    </span>
                  )}
                  {p.bathrooms != null && (
                    <span className="flex items-center gap-1">
                      <Bath className="h-3 w-3" /> {p.bathrooms}
                    </span>
                  )}
                  {p.area != null && (
                    <span className="flex items-center gap-1">
                      <Maximize2 className="h-3 w-3" /> {p.area}m²
                    </span>
                  )}
                </div>

                {/* Score Breakdown Toggle */}
                <button
                  onClick={() => setShowScoreDetails(isDetailOpen ? null : p.id)}
                  className="mt-2 text-[10px] text-muted-foreground hover:text-foreground transition"
                >
                  {isDetailOpen ? 'Masquer le détail ▲' : 'Détail du score ▼'}
                </button>

                {isDetailOpen && (
                  <div className="mt-2 space-y-1.5 rounded-lg bg-muted/50 p-2.5">
                    <ScoreBar label="Ville" value={match.breakdown.city} />
                    <ScoreBar label="Budget" value={match.breakdown.budget} />
                    <ScoreBar label="Type" value={match.breakdown.propertyType} />
                  </div>
                )}

                {/* Actions */}
                <div className="mt-3 flex items-center gap-2">
                  <Link
                    href={`/properties/${p.slug}`}
                    target="_blank"
                    className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium hover:bg-accent transition"
                  >
                    <ExternalLink className="h-3 w-3" /> Voir
                  </Link>
                  <button
                    onClick={() => handleWhatsAppShare([match])}
                    className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-green-600/10 px-2.5 py-1.5 text-xs font-medium text-green-700 dark:text-green-400 hover:bg-green-600/20 transition"
                  >
                    <Share2 className="h-3 w-3" /> WhatsApp
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

/** Mini progress bar for score breakdown */
function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-12 text-[10px] font-medium text-muted-foreground">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="w-8 text-right text-[10px] font-semibold">{value}%</span>
    </div>
  )
}
