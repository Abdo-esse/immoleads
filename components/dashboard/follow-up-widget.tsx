'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Bell, Phone, MessageSquare, AlertTriangle, Flame, Clock, ChevronRight, Sparkles } from 'lucide-react'
import { getFollowUpReminders, type FollowUpReminder } from '@/lib/actions/follow-up-reminders'
import { buildWhatsAppUrl } from '@/lib/utils/whatsapp'

const URGENCY_STYLES = {
  critical: {
    bg: 'bg-red-50 dark:bg-red-950/30',
    border: 'border-red-200 dark:border-red-800',
    badge: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400',
    icon: Flame,
    label: 'Critique',
  },
  high: {
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    border: 'border-amber-200 dark:border-amber-800',
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400',
    icon: AlertTriangle,
    label: 'Urgent',
  },
  medium: {
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    border: 'border-blue-200 dark:border-blue-800',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400',
    icon: Clock,
    label: 'À suivre',
  },
}

export function FollowUpWidget() {
  const [reminders, setReminders] = useState<FollowUpReminder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const data = await getFollowUpReminders()
        if (mounted) setReminders(data)
      } catch {}
      if (mounted) setLoading(false)
    }
    load()
    // Refresh every 2 minutes
    const interval = setInterval(load, 120_000)
    return () => { mounted = false; clearInterval(interval) }
  }, [])

  if (loading) {
    return (
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Bell className="h-5 w-5 text-amber-500" />
          <h3 className="font-semibold text-sm">Relances du jour</h3>
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-amber-500" />
          <h3 className="font-semibold text-sm">Relances du jour</h3>
          {reminders.length > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {reminders.length}
            </span>
          )}
        </div>
        <Link
          href="/dashboard/follow-ups"
          className="text-xs text-primary hover:underline flex items-center gap-1"
        >
          Voir tout <ChevronRight className="h-3 w-3" />
        </Link>
      </div>

      {reminders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 text-sm text-muted-foreground">
          <Sparkles className="h-7 w-7 text-emerald-500 mb-2" />
          <p>Aucune relance en attente !</p>
          <p className="text-[10px]">Tous vos leads sont à jour</p>
        </div>
      ) : (
        <div className="space-y-2">
          {reminders.slice(0, 5).map((reminder) => {
            const style = URGENCY_STYLES[reminder.urgency]
            const UrgencyIcon = style.icon

            return (
              <div
                key={reminder.id}
                className={`rounded-lg border ${style.border} ${style.bg} p-3 transition-all hover:shadow-sm`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${style.badge}`}>
                        <UrgencyIcon className="h-3 w-3" />
                        {style.label}
                      </span>
                      <Link
                        href={`/dashboard/leads/${reminder.leadId}`}
                        className="text-sm font-semibold hover:text-primary transition-colors truncate"
                      >
                        {reminder.name}
                      </Link>
                    </div>
                    <p className="text-[11px] text-muted-foreground">{reminder.reason}</p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-1 shrink-0">
                    <a
                      href={`tel:${reminder.phone}`}
                      className="flex h-7 w-7 items-center justify-center rounded-md bg-background hover:bg-muted transition"
                      title="Appeler"
                    >
                      <Phone className="h-3.5 w-3.5" />
                    </a>
                    <a
                      href={buildWhatsAppUrl(reminder.phone, `Bonjour ${reminder.name}, je vous contacte concernant votre demande immobilière. Quand seriez-vous disponible pour échanger ?`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-7 w-7 items-center justify-center rounded-md bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-700 dark:text-green-400 transition"
                      title="WhatsApp"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
