'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Users,
  PhoneCall,
  UserCheck,
  CalendarCheck,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Flame,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { getDashboardData } from '@/lib/actions/dashboard'
import { LEAD_STATUS_CONFIG } from '@/lib/constants'
import { formatPrice, timeAgo } from '@/lib/utils'
import { playNotificationSound } from '@/lib/utils/audio'
import type { DashboardKPIs, LeadWithRelations } from '@/types'
import { FollowUpWidget } from '@/components/dashboard/follow-up-widget'

interface RealtimeDashboardProps {
  initialKpis: DashboardKPIs
  initialRecentLeads: LeadWithRelations[]
  initialFollowUps: LeadWithRelations[]
}

export function RealtimeDashboard({
  initialKpis,
  initialRecentLeads,
  initialFollowUps,
}: RealtimeDashboardProps) {
  const [kpis, setKpis] = useState<DashboardKPIs>(initialKpis)
  const [recentLeads, setRecentLeads] = useState<LeadWithRelations[]>(initialRecentLeads)
  const [followUps, setFollowUps] = useState<LeadWithRelations[]>(initialFollowUps)
  const [newLeadPulse, setNewLeadPulse] = useState(false)

  // Background refresh function
  const refreshData = async () => {
    try {
      const data = await getDashboardData()
      setKpis(data.kpis)
      setRecentLeads(data.recentLeads)
      setFollowUps(data.followUps)
    } catch (err) {
      // Gracefully handle network hiccups
    }
  }

  // Supabase Realtime WebSocket listener
  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel('realtime_dashboard_metrics')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'leads',
        },
        async (payload) => {
          const newLead = payload.new as any
          if (newLead) {
            // Trigger visual pulse & chime
            setNewLeadPulse(true)
            setTimeout(() => setNewLeadPulse(false), 3000)
            const isSoundEnabled =
              typeof window !== 'undefined'
                ? localStorage.getItem('immoleads_sound_enabled') !== 'false'
                : true
            if (isSoundEnabled) playNotificationSound()

            // Update KPI count immediately
            setKpis((prev) => ({
              ...prev,
              newLeadsToday: prev.newLeadsToday + 1,
            }))

            // Prepend new lead
            setRecentLeads((prev) => {
              const formattedLead: LeadWithRelations = {
                ...newLead,
                property: null,
                assigned_agent: null,
              }
              return [formattedLead, ...prev.filter((l) => l.id !== newLead.id).slice(0, 4)]
            })

            // Fetch enriched data in background
            await refreshData()
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'leads',
        },
        async () => {
          await refreshData()
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'visits',
        },
        async () => {
          setKpis((prev) => ({
            ...prev,
            visitsScheduled: prev.visitsScheduled + 1,
          }))
          await refreshData()
        }
      )
      .subscribe()

    // 20s background sync
    const interval = setInterval(refreshData, 20000)

    return () => {
      supabase.removeChannel(channel)
      clearInterval(interval)
    }
  }, [])

  const kpiCards = [
    {
      title: 'New Leads',
      value: kpis.newLeadsToday.toString(),
      description: 'Today',
      icon: Users,
      color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30',
      pulse: newLeadPulse,
    },
    {
      title: 'Follow-ups Due',
      value: kpis.followUpsDue.toString(),
      description: kpis.followUpsDue > 0 ? 'Action needed' : 'All clear',
      icon: PhoneCall,
      color: 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30',
      alert: kpis.followUpsDue > 0,
    },
    {
      title: 'Qualified Leads',
      value: kpis.qualifiedThisWeek.toString(),
      description: 'This week',
      icon: UserCheck,
      color: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30',
    },
    {
      title: 'Visits Scheduled',
      value: kpis.visitsScheduled.toString(),
      description: 'Upcoming',
      icon: CalendarCheck,
      color: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header with Live Indicator */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Real-Time
            </span>
          </div>
          <p className="text-muted-foreground mt-0.5">
            Mise à jour en direct des indicateurs clés et des récents prospects.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
        {kpiCards.map((kpi) => (
          <div
            key={kpi.title}
            className={`relative overflow-hidden rounded-xl border bg-card p-3 sm:p-5 shadow-sm transition-all duration-300 hover:shadow-md ${kpi.pulse
                ? 'ring-2 ring-blue-500 shadow-lg shadow-blue-500/15 scale-[1.02]'
                : ''
              }`}
          >
            <div className="flex items-center justify-between gap-1">
              <span className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                {kpi.title}
              </span>
              <div className={`rounded-lg p-1.5 sm:p-2.5 shrink-0 ${kpi.color}`}>
                <kpi.icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
            </div>
            <div className="mt-2 sm:mt-3">
              <div className="text-xl sm:text-3xl font-bold sm:font-extrabold tracking-tight transition-all duration-300">
                {kpi.value}
              </div>
              <p
                className={`mt-0.5 sm:mt-1 text-[11px] sm:text-xs truncate ${kpi.alert
                    ? 'font-medium text-destructive animate-pulse'
                    : 'text-muted-foreground'
                  }`}
              >
                {kpi.description}
              </p>
            </div>
            {kpi.pulse && (
              <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 flex items-center gap-0.5 sm:gap-1 text-[9px] sm:text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-1.5 sm:px-2 py-0.5 rounded-full">
                <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                Nouveau
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Follow-up Reminders Widget */}
      <FollowUpWidget />

      {/* Two-Column: Recent Leads + Follow-ups */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2 w-full min-w-0">
        {/* Recent Leads */}
        <div className="rounded-xl border bg-card shadow-sm w-full min-w-0 overflow-hidden">
          <div className="flex items-center justify-between border-b p-3.5 sm:p-5 gap-2 min-w-0">
            <div className="min-w-0 flex-1">
              <h2 className="text-sm sm:text-base font-semibold leading-none tracking-tight truncate">Recent Leads</h2>
              <p className="mt-1 text-[11px] sm:text-xs text-muted-foreground truncate">
                Dernières demandes reçues en direct
              </p>
            </div>
            <Link
              href="/dashboard/leads"
              prefetch={false}
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline shrink-0"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="divide-y">
            {recentLeads.length === 0 ? (
              <div className="p-6 sm:p-8 text-center text-sm text-muted-foreground">
                Aucun prospect pour le moment.
              </div>
            ) : (
              recentLeads.map((lead, idx) => {
                const statusConfig =
                  LEAD_STATUS_CONFIG[lead.status as keyof typeof LEAD_STATUS_CONFIG]
                return (
                  <Link
                    key={lead.id}
                    href={`/dashboard/leads/${lead.id}`}
                    prefetch={false}
                    className="flex items-center justify-between p-3 sm:p-4 transition-colors hover:bg-muted/50 group min-w-0 gap-2"
                  >
                    <div className="min-w-0 flex-1 overflow-hidden">
                      <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                        <span className="truncate text-sm sm:text-base font-medium group-hover:text-primary transition-colors">
                          {lead.name}
                        </span>
                        {idx === 0 && newLeadPulse && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] sm:text-[10px] font-bold bg-emerald-500 text-white animate-bounce shrink-0">
                            <Flame className="h-2.5 w-2.5" /> LIVE
                          </span>
                        )}
                        <span
                          className={`inline-flex items-center rounded-full px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-medium shrink-0 ${statusConfig?.color || 'bg-gray-100 text-gray-800'
                            }`}
                        >
                          {statusConfig?.label || lead.status}
                        </span>
                      </div>
                      <div className="mt-0.5 sm:mt-1 flex items-center gap-1.5 sm:gap-3 text-[11px] sm:text-xs text-muted-foreground min-w-0 truncate">
                        <span className="shrink-0">{lead.phone}</span>
                        {lead.city && (
                          <>
                            <span>&bull;</span>
                            <span className="truncate">{lead.city}</span>
                          </>
                        )}
                        {(lead.budget_max || lead.budget_min) && (
                          <>
                            <span>&bull;</span>
                            <span className="font-medium text-foreground shrink-0">
                              {formatPrice(lead.budget_max || lead.budget_min || 0)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="ml-2 sm:ml-4 flex items-center gap-1.5 text-right shrink-0">
                      <span className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">
                        {timeAgo(lead.created_at)}
                      </span>
                      <ExternalLink className="hidden sm:block h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
                    </div>
                  </Link>
                )
              })
            )}
          </div>
        </div>

        {/* Follow-ups Due */}
        <div className="rounded-xl border bg-card shadow-sm w-full min-w-0 overflow-hidden">
          <div className="flex items-center justify-between border-b p-3.5 sm:p-5 gap-2 min-w-0">
            <div className="min-w-0 flex-1">
              <h2 className="text-sm sm:text-base font-semibold leading-none tracking-tight truncate">Follow-ups Due</h2>
              <p className="mt-1 text-[11px] sm:text-xs text-muted-foreground truncate">
                Prospects nécessitant une relance
              </p>
            </div>
            <Link
              href="/dashboard/follow-ups"
              prefetch={false}
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline shrink-0"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="divide-y">
            {followUps.length === 0 ? (
              <div className="p-6 sm:p-8 text-center text-sm text-muted-foreground">
                Toutes les relances sont à jour !
              </div>
            ) : (
              followUps.map((lead) => (
                <Link
                  key={lead.id}
                  href={`/dashboard/leads/${lead.id}`}
                  prefetch={false}
                  className="flex items-center justify-between p-3 sm:p-4 transition-colors hover:bg-muted/50 group min-w-0 gap-2"
                >
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                      <span className="truncate text-sm sm:text-base font-medium group-hover:text-primary transition-colors">
                        {lead.name}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-orange-100 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-medium text-orange-800 dark:bg-orange-900/40 dark:text-orange-300 shrink-0">
                        À relancer
                      </span>
                    </div>
                    <div className="mt-0.5 sm:mt-1 flex items-center gap-1.5 sm:gap-3 text-[11px] sm:text-xs text-muted-foreground min-w-0 truncate">
                      <span className="shrink-0">{lead.phone}</span>
                      {lead.property && (
                        <>
                          <span>&bull;</span>
                          <span className="truncate">{lead.property.title}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <span className="ml-2 sm:ml-4 text-[10px] sm:text-xs font-medium text-orange-600 dark:text-orange-400 whitespace-nowrap shrink-0">
                    {lead.next_follow_up_at
                      ? new Date(lead.next_follow_up_at).toLocaleDateString('fr-MA', {
                        day: 'numeric',
                        month: 'short',
                      })
                      : 'Non planifié'}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
