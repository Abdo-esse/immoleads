'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  User,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Building2,
} from 'lucide-react'
import type { VisitWithRelations } from '@/types'

type CalendarView = 'month' | 'week' | 'day'

interface Props {
  visits: VisitWithRelations[]
}

const DAYS_FR = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const MONTHS_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
]

const STATUS_COLORS: Record<string, string> = {
  SCHEDULED: 'bg-blue-500',
  COMPLETED: 'bg-emerald-500',
  CANCELLED: 'bg-gray-400',
  NO_SHOW: 'bg-red-500',
}

const STATUS_DOT: Record<string, string> = {
  SCHEDULED: 'bg-blue-400',
  COMPLETED: 'bg-emerald-400',
  CANCELLED: 'bg-gray-400',
  NO_SHOW: 'bg-red-400',
}

export function VisitsCalendar({ visits }: Props) {
  const [view, setView] = useState<CalendarView>('week')
  const [currentDate, setCurrentDate] = useState(new Date())

  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      setView('day')
    }
  }, [])

  // Navigate
  const navigate = (dir: -1 | 1) => {
    const d = new Date(currentDate)
    if (view === 'month') {
      d.setMonth(d.getMonth() + dir)
    } else if (view === 'week') {
      d.setDate(d.getDate() + dir * 7)
    } else {
      d.setDate(d.getDate() + dir)
    }
    setCurrentDate(d)
  }

  const goToday = () => setCurrentDate(new Date())

  // Build visit map (date → visits)
  const visitMap = useMemo(() => {
    const map: Record<string, VisitWithRelations[]> = {}
    for (const v of visits) {
      if (!map[v.visit_date]) map[v.visit_date] = []
      map[v.visit_date].push(v)
    }
    // Sort each day's visits by time
    for (const key of Object.keys(map)) {
      map[key].sort((a, b) => (a.visit_time || '').localeCompare(b.visit_time || ''))
    }
    return map
  }, [visits])

  // Month view: get days for the grid
  const monthDays = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    // Start from Monday
    let startOffset = firstDay.getDay() - 1
    if (startOffset < 0) startOffset = 6

    const days: { date: Date; dateStr: string; inMonth: boolean }[] = []

    // Previous month padding
    for (let i = startOffset - 1; i >= 0; i--) {
      const d = new Date(year, month, -i)
      days.push({ date: d, dateStr: d.toISOString().split('T')[0], inMonth: false })
    }

    // Current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const d = new Date(year, month, i)
      days.push({ date: d, dateStr: d.toISOString().split('T')[0], inMonth: true })
    }

    // Next month padding to fill grid
    const remaining = 42 - days.length
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i)
      days.push({ date: d, dateStr: d.toISOString().split('T')[0], inMonth: false })
    }

    return days
  }, [currentDate])

  // Week view: get 7 days starting from Monday
  const weekDays = useMemo(() => {
    const d = new Date(currentDate)
    const dayOfWeek = d.getDay()
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
    const monday = new Date(d)
    monday.setDate(d.getDate() + diff)

    const days: { date: Date; dateStr: string }[] = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(monday)
      day.setDate(monday.getDate() + i)
      days.push({ date: day, dateStr: day.toISOString().split('T')[0] })
    }
    return days
  }, [currentDate])

  // Header label
  const headerLabel = view === 'day'
    ? `${DAYS_FR[(currentDate.getDay() + 6) % 7]} ${currentDate.getDate()} ${MONTHS_FR[currentDate.getMonth()]} ${currentDate.getFullYear()}`
    : view === 'month'
    ? `${MONTHS_FR[currentDate.getMonth()]} ${currentDate.getFullYear()}`
    : (() => {
        const start = weekDays[0]
        const end = weekDays[6]
        if (start.date.getMonth() === end.date.getMonth()) {
          return `${start.date.getDate()} - ${end.date.getDate()} ${MONTHS_FR[start.date.getMonth()]} ${start.date.getFullYear()}`
        }
        return `${start.date.getDate()} ${MONTHS_FR[start.date.getMonth()].slice(0, 3)} - ${end.date.getDate()} ${MONTHS_FR[end.date.getMonth()].slice(0, 3)} ${end.date.getFullYear()}`
      })()

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border hover:bg-muted transition"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => navigate(1)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border hover:bg-muted transition"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={goToday}
            className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-muted transition"
          >
            Aujourd&apos;hui
          </button>
          <h2 className="text-base sm:text-lg font-semibold ml-2">{headerLabel}</h2>
        </div>

        <div className="flex items-center rounded-lg border bg-muted/50 p-0.5">
          <button
            type="button"
            onClick={() => setView('day')}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
              view === 'day' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Jour
          </button>
          <button
            type="button"
            onClick={() => setView('week')}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
              view === 'week' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Semaine
          </button>
          <button
            type="button"
            onClick={() => setView('month')}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
              view === 'month' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Mois
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-blue-500" /> Programmée</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Effectuée</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-gray-400" /> Annulée</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-red-500" /> No-show</span>
      </div>

      {/* Month View */}
      {view === 'month' && (
        <div className="rounded-xl border overflow-hidden">
          {/* Day headers */}
          <div className="grid grid-cols-7 border-b bg-muted/50">
            {DAYS_FR.map((d) => (
              <div key={d} className="px-2 py-2 text-center text-xs font-semibold text-muted-foreground">
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7">
            {monthDays.map(({ date, dateStr, inMonth }) => {
              const dayVisits = visitMap[dateStr] || []
              const isToday = dateStr === todayStr

              return (
                <div
                  key={dateStr}
                  className={`min-h-[80px] border-b border-r p-1.5 transition ${
                    !inMonth ? 'bg-muted/30' : ''
                  } ${isToday ? 'bg-primary/5' : ''}`}
                >
                  <div className={`text-xs font-medium mb-1 ${
                    isToday ? 'flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground' : ''
                  } ${!inMonth ? 'text-muted-foreground/50' : ''}`}>
                    {date.getDate()}
                  </div>
                  <div className="space-y-0.5">
                    {dayVisits.slice(0, 3).map((v) => (
                      <Link
                        key={v.id}
                        href={`/dashboard/leads/${(v as any).lead?.id || ''}`}
                        className={`block rounded px-1 py-0.5 text-[10px] text-white truncate ${STATUS_COLORS[v.status] || 'bg-gray-400'} hover:opacity-80 transition`}
                      >
                        {v.visit_time?.slice(0, 5)} {(v as any).lead?.name}
                      </Link>
                    ))}
                    {dayVisits.length > 3 && (
                      <p className="text-[10px] text-muted-foreground px-1">
                        +{dayVisits.length - 3} de plus
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Week View */}
      {view === 'week' && (
        <div className="rounded-xl border overflow-hidden">
          {/* Day headers */}
          <div className="grid grid-cols-7 border-b bg-muted/50">
            {weekDays.map(({ date, dateStr }, i) => {
              const isToday = dateStr === todayStr
              return (
                <div key={dateStr} className={`px-2 py-3 text-center border-r last:border-r-0 ${isToday ? 'bg-primary/5' : ''}`}>
                  <p className="text-[10px] font-medium text-muted-foreground uppercase">{DAYS_FR[i]}</p>
                  <p className={`text-lg font-bold mt-0.5 ${
                    isToday ? 'flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground mx-auto' : ''
                  }`}>
                    {date.getDate()}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Visit cards for each day */}
          <div className="grid grid-cols-7 min-h-[300px]">
            {weekDays.map(({ dateStr }) => {
              const dayVisits = visitMap[dateStr] || []
              const isToday = dateStr === todayStr

              return (
                <div
                  key={dateStr}
                  className={`border-r last:border-r-0 p-1.5 space-y-1.5 ${isToday ? 'bg-primary/5' : ''}`}
                >
                  {dayVisits.length === 0 && (
                    <p className="text-[10px] text-muted-foreground/40 text-center pt-4">—</p>
                  )}
                  {dayVisits.map((v) => (
                    <Link
                      key={v.id}
                      href={`/dashboard/leads/${(v as any).lead?.id || ''}`}
                      className="block rounded-lg border p-2 hover:shadow-sm transition bg-card"
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={`h-2 w-2 rounded-full shrink-0 ${STATUS_DOT[v.status] || 'bg-gray-400'}`} />
                        <span className="text-[11px] font-semibold truncate">{v.visit_time?.slice(0, 5)}</span>
                      </div>
                      <p className="text-[10px] font-medium truncate">{(v as any).lead?.name || 'Lead'}</p>
                      {(v as any).property?.title && (
                        <p className="text-[9px] text-muted-foreground truncate mt-0.5 flex items-center">
                          <Building2 className="h-2.5 w-2.5 inline shrink-0 mr-0.5" /> {(v as any).property.title}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Day View (Mobile-Optimized Agenda) */}
      {view === 'day' && (
        <div className="rounded-xl border bg-card p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b mb-4">
            <div>
              <p className="text-base font-bold">
                {DAYS_FR[(currentDate.getDay() + 6) % 7]} {currentDate.getDate()} {MONTHS_FR[currentDate.getMonth()]}
              </p>
              <p className="text-xs text-muted-foreground">
                {(visitMap[currentDate.toISOString().split('T')[0]] || []).length} visite(s) programmée(s)
              </p>
            </div>
            {currentDate.toISOString().split('T')[0] === todayStr && (
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                Aujourd&apos;hui
              </span>
            )}
          </div>

          {!(visitMap[currentDate.toISOString().split('T')[0]] || []).length ? (
            <div className="py-12 text-center text-muted-foreground">
              <p className="text-sm font-medium">Aucune visite pour cette journée</p>
              <p className="text-xs mt-1">Utilisez les flèches pour changer de date ou planifiez une visite depuis la fiche d&apos;un lead.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {(visitMap[currentDate.toISOString().split('T')[0]] || []).map((visit) => {
                const statusColor = STATUS_COLORS[visit.status] || 'bg-gray-500'
                return (
                  <div
                    key={visit.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border p-4 hover:border-primary/50 transition bg-muted/20"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 font-mono text-sm font-bold text-primary">
                          <Clock className="h-3.5 w-3.5" />
                          {visit.visit_time?.slice(0, 5) || 'Heure non spécifiée'}
                        </span>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold text-white ${statusColor}`}>
                          {visit.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <Link href={`/dashboard/leads/${visit.lead_id}`} className="hover:underline">
                          {visit.lead?.name || 'Prospect'}
                        </Link>
                        {visit.lead?.phone && (
                          <a href={`tel:${visit.lead.phone}`} className="text-xs text-muted-foreground hover:text-foreground">
                            ({visit.lead.phone})
                          </a>
                        )}
                      </div>

                      {visit.property && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          <span>{visit.property.title} — {visit.property.city}</span>
                        </p>
                      )}

                      {visit.notes && (
                        <p className="text-xs text-muted-foreground italic mt-1 bg-background/80 p-2 rounded-lg border">
                          &ldquo;{visit.notes}&rdquo;
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <Link
                        href={`/dashboard/leads/${visit.lead_id}`}
                        className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition"
                      >
                        Voir fiche
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
