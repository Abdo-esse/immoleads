'use client'

import { useState } from 'react'
import {
  MessageSquare,
  Phone,
  ArrowRightLeft,
  UserPlus,
  CalendarCheck,
  CalendarDays,
  Home,
  PenLine,
  Sparkles,
  Bell,
  Filter,
} from 'lucide-react'
import { timeAgo } from '@/lib/utils'
import type { ActivityAction } from '@/lib/actions/activity-logger'

interface Activity {
  id: string
  action: string
  details: string | null
  metadata: Record<string, unknown> | null
  created_at: string
  user: { full_name: string } | null
}

interface Props {
  activities: Activity[]
}

const ACTION_CONFIG: Record<string, {
  icon: typeof MessageSquare
  label: string
  color: string
  bgColor: string
}> = {
  status_changed: {
    icon: ArrowRightLeft,
    label: 'Statut modifié',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
  },
  assigned: {
    icon: UserPlus,
    label: 'Assigné',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
  },
  note_added: {
    icon: PenLine,
    label: 'Note ajoutée',
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
  },
  whatsapp_sent: {
    icon: MessageSquare,
    label: 'WhatsApp envoyé',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
  },
  call_made: {
    icon: Phone,
    label: 'Appel effectué',
    color: 'text-cyan-600 dark:text-cyan-400',
    bgColor: 'bg-cyan-100 dark:bg-cyan-900/30',
  },
  visit_scheduled: {
    icon: CalendarDays,
    label: 'Visite programmée',
    color: 'text-indigo-600 dark:text-indigo-400',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
  },
  visit_completed: {
    icon: CalendarCheck,
    label: 'Visite effectuée',
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
  },
  property_matched: {
    icon: Home,
    label: 'Bien proposé',
    color: 'text-rose-600 dark:text-rose-400',
    bgColor: 'bg-rose-100 dark:bg-rose-900/30',
  },
  lead_created: {
    icon: Sparkles,
    label: 'Lead créé',
    color: 'text-violet-600 dark:text-violet-400',
    bgColor: 'bg-violet-100 dark:bg-violet-900/30',
  },
  follow_up_set: {
    icon: Bell,
    label: 'Relance programmée',
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
  },
}

const DEFAULT_CONFIG = {
  icon: Sparkles,
  label: 'Action',
  color: 'text-gray-600 dark:text-gray-400',
  bgColor: 'bg-gray-100 dark:bg-gray-900/30',
}

const ALL_FILTER = 'all'

export function ActivityTimeline({ activities }: Props) {
  const [filterAction, setFilterAction] = useState(ALL_FILTER)

  const actionTypes = [...new Set(activities.map((a) => a.action))]
  const filtered = filterAction === ALL_FILTER
    ? activities
    : activities.filter((a) => a.action === filterAction)

  return (
    <div className="space-y-4">
      {/* Filter chips */}
      {actionTypes.length > 1 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scroll-smooth-touch no-select">
          <Filter className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <button
            onClick={() => setFilterAction(ALL_FILTER)}
            className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
              filterAction === ALL_FILTER ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Tout ({activities.length})
          </button>
          {actionTypes.map((action) => {
            const config = ACTION_CONFIG[action] || DEFAULT_CONFIG
            const count = activities.filter((a) => a.action === action).length
            return (
              <button
                key={action}
                onClick={() => setFilterAction(action)}
                className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
                  filterAction === action ? `${config.bgColor} ${config.color}` : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {config.label} ({count})
              </button>
            )
          })}
        </div>
      )}

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

        <div className="space-y-0">
          {filtered.map((activity, idx) => {
            const config = ACTION_CONFIG[activity.action] || DEFAULT_CONFIG
            const Icon = config.icon

            return (
              <div key={activity.id} className="relative flex gap-3 pb-6 last:pb-0">
                {/* Dot */}
                <div className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${config.bgColor} ring-4 ring-background`}>
                  <Icon className={`h-3.5 w-3.5 ${config.color}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium">{config.label}</p>
                      {activity.details && (
                        <p className="text-sm text-muted-foreground mt-0.5 whitespace-pre-wrap">
                          {activity.details}
                        </p>
                      )}
                    </div>
                    <span className="shrink-0 text-[11px] text-muted-foreground">
                      {timeAgo(activity.created_at)}
                    </span>
                  </div>
                  {activity.user && (
                    <p className="text-[11px] text-muted-foreground mt-1">
                      par {activity.user.full_name}
                    </p>
                  )}
                </div>
              </div>
            )
          })}

          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Aucune activité enregistrée
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
