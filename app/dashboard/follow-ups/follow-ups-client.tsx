'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  PhoneCall,
  AlertCircle,
  Clock,
  Calendar,
  CheckCircle2,
  Building2,
  User,
  ArrowRight,
  MessageSquare,
  Phone,
  RotateCw,
} from 'lucide-react'
import { updateLeadStatus, quickRescheduleFollowUp } from '@/lib/actions/leads'
import { LEAD_STATUS_CONFIG } from '@/lib/constants'
import { formatPhone, timeAgo, formatPrice } from '@/lib/utils'
import { formatWhatsAppPhone } from '@/lib/utils/whatsapp'
import type { LeadWithRelations } from '@/types'

interface Props {
  data: {
    overdue: LeadWithRelations[]
    today: LeadWithRelations[]
    upcoming: LeadWithRelations[]
  }
}

type TabType = 'overdue' | 'today' | 'upcoming'

export function FollowUpsClient({ data }: Props) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>(
    data.overdue.length > 0 ? 'overdue' : data.today.length > 0 ? 'today' : 'upcoming'
  )
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const currentList = data[activeTab]

  const handleQuickReschedule = async (leadId: string, days: number, label: string) => {
    setLoadingId(leadId)
    try {
      const res = await quickRescheduleFollowUp(leadId, days)
      if (res?.error) {
        toast.error(res.error)
      } else {
        toast.success(`Relance reportée de ${label}`)
        router.refresh()
      }
    } catch (err: any) {
      toast.error('Erreur lors du report : ' + err.message)
    } finally {
      setLoadingId(null)
    }
  }

  const handleMarkContacted = async (leadId: string) => {
    setLoadingId(leadId)
    try {
      const res = await updateLeadStatus(leadId, 'CONTACTED')
      if (res?.error) {
        toast.error(res.error)
      } else {
        toast.success('Lead marqué comme contacté !')
        router.refresh()
      }
    } catch (err: any) {
      toast.error('Erreur : ' + err.message)
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Relances clients (Follow-ups)</h1>
          <p className="text-muted-foreground text-sm">
            Traitez vos prospects à relancer pour maximiser vos taux de conversion.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {data.overdue.length > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 dark:bg-red-950/40 dark:text-red-400">
              <AlertCircle className="h-3.5 w-3.5" />
              {data.overdue.length} en retard
            </span>
          )}
          {data.today.length > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-950/40 dark:text-orange-400">
              <Clock className="h-3.5 w-3.5" />
              {data.today.length} aujourd’hui
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-muted">
        <button
          onClick={() => setActiveTab('overdue')}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-medium transition-colors ${
            activeTab === 'overdue'
              ? 'border-red-500 text-red-600 dark:text-red-400'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <AlertCircle className="h-4 w-4" />
          En retard
          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
            data.overdue.length > 0 ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400' : 'bg-muted text-muted-foreground'
          }`}>
            {data.overdue.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('today')}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-medium transition-colors ${
            activeTab === 'today'
              ? 'border-orange-500 text-orange-600 dark:text-orange-400'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Clock className="h-4 w-4" />
          Aujourd’hui
          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
            data.today.length > 0 ? 'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-400' : 'bg-muted text-muted-foreground'
          }`}>
            {data.today.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('upcoming')}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-medium transition-colors ${
            activeTab === 'upcoming'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Calendar className="h-4 w-4" />
          À venir
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
            {data.upcoming.length}
          </span>
        </button>
      </div>

      {/* List content */}
      {currentList.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-950/40 dark:text-green-400 mb-3">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold">Toutes les relances sont à jour !</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            {activeTab === 'overdue'
              ? 'Aucun prospect en retard de relance. Excellent travail !'
              : activeTab === 'today'
              ? 'Aucune relance programmée pour aujourd’hui.'
              : 'Aucune relance future programmée.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {currentList.map((lead) => {
            const statusCfg = LEAD_STATUS_CONFIG[lead.status] || {
              label: lead.status,
              bgClass: 'bg-muted',
              textClass: 'text-muted-foreground',
            }
            const waPhone = formatWhatsAppPhone(lead.phone)
            const isBusy = loadingId === lead.id

            return (
              <div
                key={lead.id}
                className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md"
              >
                {/* Lead Details */}
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <Link
                      href={`/dashboard/leads/${lead.id}`}
                      className="text-base font-bold hover:text-primary transition-colors"
                    >
                      {lead.name}
                    </Link>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${statusCfg.bgClass} ${statusCfg.textClass}`}
                    >
                      {statusCfg.label}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <PhoneCall className="h-3 w-3" />
                      {formatPhone(lead.phone)}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    {lead.property && (
                      <span className="flex items-center gap-1">
                        <Building2 className="h-3.5 w-3.5" />
                        {lead.property.title} ({lead.property.city}) — {formatPrice(lead.property.price)}
                      </span>
                    )}
                    {lead.assigned_agent && (
                      <span className="flex items-center gap-1">
                        <User className="h-3.5 w-3.5" />
                        {lead.assigned_agent.full_name}
                      </span>
                    )}
                    <span className="flex items-center gap-1 font-medium text-foreground">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      Prévue {timeAgo(lead.next_follow_up_at!)} (
                      {new Date(lead.next_follow_up_at!).toLocaleDateString('fr-MA', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      )
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0">
                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/${waPhone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-green-600 px-3 text-xs font-semibold text-white transition hover:bg-green-700"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    WhatsApp
                  </a>

                  {/* Phone */}
                  <a
                    href={`tel:${lead.phone}`}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition hover:bg-accent"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    Appeler
                  </a>

                  {/* Mark contacted */}
                  {lead.status === 'NEW' && (
                    <button
                      disabled={isBusy}
                      onClick={() => handleMarkContacted(lead.id)}
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-3 text-xs font-semibold text-primary transition hover:bg-primary/20 disabled:opacity-50"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Contacté
                    </button>
                  )}

                  {/* Quick Reschedule */}
                  <div className="flex items-center rounded-lg border bg-muted/30 p-0.5">
                    <button
                      disabled={isBusy}
                      onClick={() => handleQuickReschedule(lead.id, 1, '1 jour')}
                      className="rounded px-2 py-1.5 text-[11px] font-medium text-muted-foreground transition hover:bg-background hover:text-foreground disabled:opacity-50"
                      title="Reporter à demain"
                    >
                      +1j
                    </button>
                    <button
                      disabled={isBusy}
                      onClick={() => handleQuickReschedule(lead.id, 3, '3 jours')}
                      className="rounded px-2 py-1.5 text-[11px] font-medium text-muted-foreground transition hover:bg-background hover:text-foreground disabled:opacity-50"
                      title="Reporter à dans 3 jours"
                    >
                      +3j
                    </button>
                    <button
                      disabled={isBusy}
                      onClick={() => handleQuickReschedule(lead.id, 7, '1 semaine')}
                      className="rounded px-2 py-1.5 text-[11px] font-medium text-muted-foreground transition hover:bg-background hover:text-foreground disabled:opacity-50"
                      title="Reporter à dans 1 semaine"
                    >
                      +1sem
                    </button>
                  </div>

                  {/* View Details */}
                  <Link
                    href={`/dashboard/leads/${lead.id}`}
                    prefetch={false}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border hover:bg-accent"
                    title="Voir la fiche complète"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
