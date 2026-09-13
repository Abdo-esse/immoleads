'use client'

import { Target, Users, Trophy, DollarSign } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import type { MonthlyGoals } from '@/lib/actions/performance'

interface Props {
  goals: MonthlyGoals
}

export function MonthlyGoalsSection({ goals }: Props) {
  const hasAnyGoal = goals.leadGoal > 0 || goals.wonGoal > 0 || goals.revenueGoal > 0

  if (!hasAnyGoal) {
    return (
      <div className="rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Target className="h-5 w-5 text-indigo-500" />
          Objectifs Mensuels
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Aucun objectif configuré. Rendez-vous dans{' '}
          <a href="/dashboard/settings" className="text-primary underline hover:no-underline">
            Paramètres
          </a>{' '}
          pour définir vos objectifs mensuels.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border bg-card p-6 space-y-5">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <Target className="h-5 w-5 text-indigo-500" />
        Objectifs Mensuels
        <span className="text-xs font-normal text-muted-foreground ml-1">
          {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
        </span>
      </h2>

      <div className="grid gap-4 sm:grid-cols-3">
        {goals.leadGoal > 0 && (
          <GoalCard
            icon={Users}
            label="Leads Qualifiés"
            current={goals.leadCurrent}
            goal={goals.leadGoal}
            formatValue={(v) => String(v)}
            color="indigo"
          />
        )}
        {goals.wonGoal > 0 && (
          <GoalCard
            icon={Trophy}
            label="Ventes"
            current={goals.wonCurrent}
            goal={goals.wonGoal}
            formatValue={(v) => String(v)}
            color="emerald"
          />
        )}
        {goals.revenueGoal > 0 && (
          <GoalCard
            icon={DollarSign}
            label="Chiffre d'Affaires"
            current={goals.revenueCurrent}
            goal={goals.revenueGoal}
            formatValue={(v) => `${formatPrice(v)} MAD`}
            color="amber"
          />
        )}
      </div>
    </div>
  )
}

function GoalCard({
  icon: Icon,
  label,
  current,
  goal,
  formatValue,
  color,
}: {
  icon: any
  label: string
  current: number
  goal: number
  formatValue: (v: number) => string
  color: 'indigo' | 'emerald' | 'amber'
}) {
  const percentage = goal > 0 ? Math.min(100, Math.round((current / goal) * 100)) : 0
  const isComplete = percentage >= 100

  const colorMap = {
    indigo: {
      bg: 'bg-indigo-100 dark:bg-indigo-950/30',
      icon: 'text-indigo-600 dark:text-indigo-400',
      bar: 'bg-indigo-500',
      complete: 'bg-indigo-600',
    },
    emerald: {
      bg: 'bg-emerald-100 dark:bg-emerald-950/30',
      icon: 'text-emerald-600 dark:text-emerald-400',
      bar: 'bg-emerald-500',
      complete: 'bg-emerald-600',
    },
    amber: {
      bg: 'bg-amber-100 dark:bg-amber-950/30',
      icon: 'text-amber-600 dark:text-amber-400',
      bar: 'bg-amber-500',
      complete: 'bg-amber-600',
    },
  }

  const c = colorMap[color]

  return (
    <div className={`rounded-xl border p-5 ${isComplete ? 'border-emerald-300 dark:border-emerald-800' : ''}`}>
      <div className="flex items-center gap-2.5 mb-3">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${c.bg}`}>
          <Icon className={`h-4 w-4 ${c.icon}`} />
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <p className="text-2xl font-bold">{formatValue(current)}</p>
          <p className="text-xs text-muted-foreground">/ {formatValue(goal)}</p>
        </div>

        <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${isComplete ? c.complete : c.bar}`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[10px]">
          <span className="text-muted-foreground">
            {isComplete ? '🎉 Objectif atteint !' : `${percentage}% complété`}
          </span>
          {!isComplete && (
            <span className="text-muted-foreground">
              Reste : {formatValue(Math.max(0, goal - current))}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
