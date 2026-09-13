'use client'

import { useEffect, useState } from 'react'

// ═══════════════════════════════════════════
// SLA Badge — Dynamic lead urgency indicator
// ═══════════════════════════════════════════

interface Props {
  createdAt: string
  status: string
  lastContactedAt: string | null
  /** compact mode for table cells */
  compact?: boolean
}

type Urgency = 'burning' | 'warm' | 'sla_breached' | 'contacted' | null

interface UrgencyConfig {
  label: string
  emoji: string
  bgClass: string
  textClass: string
  pulseClass: string
}

const URGENCY_CONFIG: Record<NonNullable<Urgency>, UrgencyConfig> = {
  burning: {
    label: 'Brûlant',
    emoji: '🔥',
    bgClass: 'bg-red-100 dark:bg-red-950/40',
    textClass: 'text-red-700 dark:text-red-400',
    pulseClass: 'animate-pulse',
  },
  warm: {
    label: 'En attente',
    emoji: '⏳',
    bgClass: 'bg-amber-100 dark:bg-amber-950/40',
    textClass: 'text-amber-700 dark:text-amber-400',
    pulseClass: '',
  },
  sla_breached: {
    label: 'SLA dépassé',
    emoji: '⚠️',
    bgClass: 'bg-orange-100 dark:bg-orange-950/40',
    textClass: 'text-orange-700 dark:text-orange-400',
    pulseClass: '',
  },
  contacted: {
    label: 'Contacté',
    emoji: '✅',
    bgClass: 'bg-green-100 dark:bg-green-950/40',
    textClass: 'text-green-700 dark:text-green-400',
    pulseClass: '',
  },
}

/** SLA thresholds in minutes */
const SLA = {
  BURNING: 30,       // < 30 min → hot lead
  WARM: 120,         // < 2h → warm
  BREACHED: 120,     // > 2h without contact → SLA breached
} as const

function computeUrgency(createdAt: string, status: string, lastContactedAt: string | null): Urgency {
  // If lead has been contacted, status is past NEW → show "contacted"
  const hasBeenContacted = lastContactedAt != null || (status !== 'NEW')

  if (hasBeenContacted && status !== 'NEW') {
    return 'contacted'
  }

  const createdTime = new Date(createdAt).getTime()
  const now = Date.now()
  const minutesSinceCreation = (now - createdTime) / 60_000

  if (minutesSinceCreation < SLA.BURNING) {
    return 'burning'
  }
  if (minutesSinceCreation < SLA.WARM) {
    return 'warm'
  }
  // > 2h with no contact
  return 'sla_breached'
}

export function LeadSlaBadge({ createdAt, status, lastContactedAt, compact = false }: Props) {
  const [urgency, setUrgency] = useState<Urgency>(null)
  const [elapsedText, setElapsedText] = useState('')

  useEffect(() => {
    function update() {
      const u = computeUrgency(createdAt, status, lastContactedAt)
      setUrgency(u)

      // Compute elapsed time text
      const createdTime = new Date(createdAt).getTime()
      const diff = Date.now() - createdTime
      const minutes = Math.floor(diff / 60_000)
      if (minutes < 60) {
        setElapsedText(`${minutes}min`)
      } else {
        const hours = Math.floor(minutes / 60)
        const remainingMins = minutes % 60
        setElapsedText(`${hours}h${remainingMins > 0 ? `${remainingMins}m` : ''}`)
      }
    }

    update()
    const interval = setInterval(update, 30_000) // update every 30s
    return () => clearInterval(interval)
  }, [createdAt, status, lastContactedAt])

  if (!urgency) return null

  const config = URGENCY_CONFIG[urgency]

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${config.bgClass} ${config.textClass} ${config.pulseClass}`}
        title={`${config.label} — Créé il y a ${elapsedText}`}
      >
        {config.emoji}
        {urgency === 'burning' || urgency === 'sla_breached' ? elapsedText : config.label}
      </span>
    )
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium ${config.bgClass} ${config.textClass} ${config.pulseClass}`}
    >
      <span>{config.emoji}</span>
      <span>{config.label}</span>
      <span className="text-[10px] opacity-70">({elapsedText})</span>
    </div>
  )
}

/**
 * Utility: get the SLA urgency for a lead (server-side).
 * Useful for sorting or filtering.
 */
export function getLeadSlaUrgency(
  createdAt: string,
  status: string,
  lastContactedAt: string | null
): Urgency {
  return computeUrgency(createdAt, status, lastContactedAt)
}
