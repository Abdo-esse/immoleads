'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  CalendarCheck,
  Clock,
  MapPin,
  User,
  Phone,
  Plus,
  X,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Filter,
  List,
  Calendar,
} from 'lucide-react'
import { createVisit, updateVisitStatus } from '@/lib/actions/visits'
import { VISIT_STATUSES } from '@/lib/constants'
import { timeAgo } from '@/lib/utils'
import { VisitsCalendar } from '@/components/dashboard/visits-calendar'
import type { VisitWithRelations, LeadWithRelations, Property } from '@/types'

interface Props {
  visits: VisitWithRelations[]
  properties: Property[]
  leads: LeadWithRelations[]
  agents: { id: string; full_name: string; role: string }[]
}

const VISIT_STATUS_STYLES: Record<string, { bg: string; text: string; icon: any }> = {
  SCHEDULED: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-700 dark:text-blue-400',
    icon: Clock,
  },
  COMPLETED: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-700 dark:text-green-400',
    icon: CheckCircle2,
  },
  CANCELLED: {
    bg: 'bg-gray-100 dark:bg-gray-800/50',
    text: 'text-gray-600 dark:text-gray-400',
    icon: XCircle,
  },
  NO_SHOW: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-700 dark:text-red-400',
    icon: AlertTriangle,
  },
}

export function VisitsClient({ visits, properties, leads, agents }: Props) {
  const router = useRouter()
  const [filter, setFilter] = useState('ALL')
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')

  const filtered = filter === 'ALL' ? visits : visits.filter(v => v.status === filter)

  // Group by date
  const today = new Date().toISOString().split('T')[0]
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]

  const groups: { label: string; visits: VisitWithRelations[] }[] = []
  const todayVisits = filtered.filter(v => v.visit_date === today)
  const tomorrowVisits = filtered.filter(v => v.visit_date === tomorrow)
  const laterVisits = filtered.filter(v => v.visit_date > tomorrow)
  const pastVisits = filtered.filter(v => v.visit_date < today)

  if (todayVisits.length > 0) groups.push({ label: "Today", visits: todayVisits })
  if (tomorrowVisits.length > 0) groups.push({ label: "Tomorrow", visits: tomorrowVisits })
  if (laterVisits.length > 0) groups.push({ label: "Upcoming", visits: laterVisits })
  if (pastVisits.length > 0) groups.push({ label: "Past", visits: pastVisits })

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const result = await createVisit({
      lead_id: form.get('lead_id') as string,
      property_id: (form.get('property_id') as string) || null,
      agent_id: (form.get('agent_id') as string) || null,
      visit_date: form.get('visit_date') as string,
      visit_time: form.get('visit_time') as string,
      notes: (form.get('notes') as string) || undefined,
    })

    setLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Visit scheduled')
      setShowForm(false)
      router.refresh()
    }
  }

  async function handleStatusUpdate(visitId: string, status: 'COMPLETED' | 'CANCELLED' | 'NO_SHOW') {
    setUpdatingId(visitId)
    const result = await updateVisitStatus(visitId, status)
    setUpdatingId(null)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(`Visit marked as ${status.toLowerCase().replace('_', ' ')}`)
      router.refresh()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Visits</h1>
          <p className="text-muted-foreground">Manage property visits and appointments.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border bg-muted/50 p-0.5">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                viewMode === 'list' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <List className="h-3.5 w-3.5" />
              Liste
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                viewMode === 'calendar' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Calendar className="h-3.5 w-3.5" />
              Calendrier
            </button>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" /> Schedule Visit
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
        <button
          onClick={() => setFilter('ALL')}
          className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
            filter === 'ALL' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
          }`}
        >
          All ({visits.length})
        </button>
        {VISIT_STATUSES.map(vs => {
          const count = visits.filter(v => v.status === vs.value).length
          const styles = VISIT_STATUS_STYLES[vs.value]
          return (
            <button
              key={vs.value}
              onClick={() => setFilter(vs.value)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === vs.value ? `${styles.bg} ${styles.text}` : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {vs.label} ({count})
            </button>
          )
        })}
      </div>

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <VisitsCalendar visits={filtered} />
      )}

      {/* List View: Visit Groups */}
      {viewMode === 'list' && (groups.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-card py-16 text-center">
          <CalendarCheck className="h-10 w-10 text-muted-foreground/50 mb-3" />
          <p className="text-muted-foreground">No visits found.</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-3 text-sm text-primary hover:underline"
          >
            Schedule one now →
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {groups.map(group => (
            <div key={group.label}>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                {group.label}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {group.visits.map(visit => {
                  const styles = VISIT_STATUS_STYLES[visit.status]
                  const StatusIcon = styles.icon
                  return (
                    <div
                      key={visit.id}
                      className="rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${styles.bg}`}>
                            <StatusIcon className={`h-4 w-4 ${styles.text}`} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{visit.lead?.name || 'Unknown Lead'}</p>
                            <p className="text-xs text-muted-foreground">
                              {visit.lead?.phone || '—'}
                            </p>
                          </div>
                        </div>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${styles.bg} ${styles.text}`}>
                          {VISIT_STATUSES.find(vs => vs.value === visit.status)?.label}
                        </span>
                      </div>

                      {/* Details */}
                      <div className="space-y-1.5 mb-4">
                        {visit.property && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{visit.property.title} — {visit.property.city}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <CalendarCheck className="h-3 w-3" />
                          <span>
                            {new Date(visit.visit_date + 'T00:00:00').toLocaleDateString('en-GB', {
                              weekday: 'short', day: 'numeric', month: 'short',
                            })} at {visit.visit_time?.slice(0, 5) || '—'}
                          </span>
                        </div>
                        {visit.agent && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <User className="h-3 w-3" />
                            <span>{visit.agent.full_name}</span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      {visit.status === 'SCHEDULED' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleStatusUpdate(visit.id, 'COMPLETED')}
                            disabled={updatingId === visit.id}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-green-600 px-3 py-2 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
                          >
                            <CheckCircle2 className="h-3 w-3" /> Done
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(visit.id, 'CANCELLED')}
                            disabled={updatingId === visit.id}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium hover:bg-accent disabled:opacity-50"
                          >
                            <XCircle className="h-3 w-3" /> Cancel
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(visit.id, 'NO_SHOW')}
                            disabled={updatingId === visit.id}
                            className="inline-flex items-center justify-center rounded-lg border px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50"
                            title="No Show"
                          >
                            <AlertTriangle className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* New Visit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowForm(false)}
          />
          <div className="relative w-full max-w-lg rounded-xl border bg-card p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Schedule Visit</h2>
              <button onClick={() => setShowForm(false)} className="rounded-md p-1.5 hover:bg-accent">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              {/* Lead */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Lead *</label>
                <select
                  name="lead_id"
                  required
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                >
                  <option value="">Select lead...</option>
                  {leads.map(l => (
                    <option key={l.id} value={l.id}>{l.name} — {l.phone}</option>
                  ))}
                </select>
              </div>

              {/* Property */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Property</label>
                <select
                  name="property_id"
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                >
                  <option value="">Select property (optional)...</option>
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>{p.title} — {p.city}</option>
                  ))}
                </select>
              </div>

              {/* Agent */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Agent</label>
                <select
                  name="agent_id"
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                >
                  <option value="">Select agent (optional)...</option>
                  {agents.map(a => (
                    <option key={a.id} value={a.id}>{a.full_name}</option>
                  ))}
                </select>
              </div>

              {/* Date + Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Date *</label>
                  <input
                    name="visit_date"
                    type="date"
                    required
                    min={today}
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Time *</label>
                  <input
                    name="visit_time"
                    type="time"
                    required
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Notes</label>
                <textarea
                  name="notes"
                  rows={2}
                  className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none"
                  placeholder="Any special instructions..."
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="inline-flex h-10 items-center rounded-lg border px-4 text-sm font-medium hover:bg-accent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
