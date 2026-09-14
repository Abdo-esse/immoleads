'use client'

import { Clock, Zap, AlertTriangle, CheckCircle2, AlertCircle } from 'lucide-react'
import type { ResponseTimeData } from '@/lib/actions/performance'

interface Props {
  agents: ResponseTimeData[]
  agencyAvg: number
}

const BADGE_CONFIG = {
  excellent: {
    label: '< 15min',
    icon: Zap,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-100 dark:bg-emerald-950/30',
    barColor: 'bg-emerald-500',
  },
  good: {
    label: '< 1h',
    icon: CheckCircle2,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-950/30',
    barColor: 'bg-blue-500',
  },
  slow: {
    label: '< 2h',
    icon: AlertTriangle,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-100 dark:bg-amber-950/30',
    barColor: 'bg-amber-500',
  },
  critical: {
    label: '> 2h',
    icon: AlertCircle,
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-100 dark:bg-red-950/30',
    barColor: 'bg-red-500',
  },
}

function formatMinutes(mins: number): string {
  if (mins < 60) return `${mins}min`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m > 0 ? `${h}h ${m}min` : `${h}h`
}

export function ResponseTimeChart({ agents, agencyAvg }: Props) {
  if (agents.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-500" />
          Temps de Réponse
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Aucune donnée de réponse disponible. Les métriques apparaîtront lorsque les agents commenceront à contacter les leads.
        </p>
      </div>
    )
  }

  const maxMinutes = Math.max(...agents.map((a) => a.avgMinutes), 1)

  return (
    <div className="rounded-xl border bg-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" />
            Temps de Réponse Moyen
          </h2>
          <p className="text-xs text-muted-foreground">
            Délai moyen entre réception et premier contact
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Moyenne agence</p>
          <p className="text-lg font-bold">{formatMinutes(agencyAvg)}</p>
        </div>
      </div>

      {/* Agent Bars */}
      <div className="space-y-3">
        {agents.map((agent) => {
          const config = BADGE_CONFIG[agent.badge]
          const Icon = config.icon
          const barWidth = Math.max(5, (agent.avgMinutes / maxMinutes) * 100)

          return (
            <div key={agent.agentId} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{agent.agentName}</span>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${config.bg} ${config.color}`}>
                    <Icon className="h-3 w-3" /> {config.label}
                  </span>
                  <span className="text-sm font-bold w-16 text-right">{formatMinutes(agent.avgMinutes)}</span>
                </div>
              </div>
              <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full ${config.barColor} transition-all duration-700`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground">
                {agent.totalResponded} lead{agent.totalResponded > 1 ? 's' : ''} contacté{agent.totalResponded > 1 ? 's' : ''}
              </p>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 pt-2 border-t">
        {Object.entries(BADGE_CONFIG).map(([key, config]) => {
          const Icon = config.icon
          return (
            <span key={key} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <span className={`h-2 w-2 rounded-full ${config.barColor}`} />
              <Icon className="h-3 w-3" /> {config.label}
            </span>
          )
        })}
      </div>
    </div>
  )
}
