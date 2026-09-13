'use client'

import { TrendingUp, DollarSign, Percent, Award } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import type { RevenueKPIs } from '@/lib/actions/performance'

interface Props {
  data: RevenueKPIs
}

export function RevenueKpisSection({ data }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-emerald-600" />
          Performance Commerciale
        </h2>
        <p className="text-xs text-muted-foreground">Mois en cours — Chiffre d'affaires et commissions</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Chiffre d'Affaires"
          value={formatPrice(data.totalRevenue)}
          suffix="MAD"
          icon={TrendingUp}
          gradient="from-emerald-500/20 to-teal-500/20"
          iconColor="text-emerald-600 dark:text-emerald-400"
        />
        <KpiCard
          label="Commission Agence"
          value={formatPrice(data.agencyCommission)}
          suffix={`${data.commissionRate}%`}
          icon={DollarSign}
          gradient="from-blue-500/20 to-indigo-500/20"
          iconColor="text-blue-600 dark:text-blue-400"
        />
        <KpiCard
          label="Deals Conclus"
          value={String(data.dealsWon)}
          suffix="WON"
          icon={Award}
          gradient="from-violet-500/20 to-purple-500/20"
          iconColor="text-violet-600 dark:text-violet-400"
        />
        <KpiCard
          label="Ticket Moyen"
          value={formatPrice(data.avgDealSize)}
          suffix="MAD"
          icon={Percent}
          gradient="from-amber-500/20 to-orange-500/20"
          iconColor="text-amber-600 dark:text-amber-400"
        />
      </div>

      {/* Agent Commissions Breakdown */}
      {data.agentCommissions.length > 0 && (
        <div className="rounded-xl border bg-card p-5">
          <h3 className="text-sm font-semibold mb-3">
            Répartition Commissions Agents
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              (Part agent : {data.agentShare}%)
            </span>
          </h3>
          <div className="space-y-2.5">
            {data.agentCommissions
              .sort((a, b) => b.commission - a.commission)
              .map((ac) => (
                <div key={ac.agentId} className="flex items-center justify-between rounded-lg bg-muted/40 px-4 py-2.5">
                  <span className="text-sm font-medium">{ac.agentName}</span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    {formatPrice(ac.commission)} MAD
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

function KpiCard({
  label,
  value,
  suffix,
  icon: Icon,
  gradient,
  iconColor,
}: {
  label: string
  value: string
  suffix: string
  icon: any
  gradient: string
  iconColor: string
}) {
  return (
    <div className={`relative overflow-hidden rounded-xl border bg-card p-5 shadow-sm`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-50`} />
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-background/80 ${iconColor}`}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-[10px] text-muted-foreground mt-1">{suffix}</p>
      </div>
    </div>
  )
}
