'use client'

import { Trophy, Medal, TrendingUp, Clock, Users } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import type { LeaderboardEntry } from '@/lib/actions/performance'

interface Props {
  entries: LeaderboardEntry[]
}

const MEDAL_STYLES = [
  { rank: '#1', color: 'text-yellow-500', bg: 'bg-gradient-to-br from-yellow-400/20 to-amber-500/20', border: 'border-yellow-400/50', ring: 'ring-yellow-400/30' },
  { rank: '#2', color: 'text-slate-400', bg: 'bg-gradient-to-br from-gray-300/20 to-slate-400/20', border: 'border-gray-400/50', ring: 'ring-gray-400/30' },
  { rank: '#3', color: 'text-amber-600', bg: 'bg-gradient-to-br from-orange-400/20 to-amber-600/20', border: 'border-orange-400/50', ring: 'ring-orange-400/30' },
]

export function AgentLeaderboard({ entries }: Props) {
  if (entries.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Classement Mensuel
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Aucune donnée de performance pour ce mois. Les agents apparaîtront ici dès qu'ils auront des leads assignés.
        </p>
      </div>
    )
  }

  const podium = entries.slice(0, 3)
  const rest = entries.slice(3)

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <Trophy className="h-5 w-5 text-yellow-500" />
        Classement Mensuel des Agents
      </h2>

      {/* Podium */}
      <div className="grid gap-3 sm:grid-cols-3">
        {podium.map((entry, i) => {
          const style = MEDAL_STYLES[i]
          return (
            <div
              key={entry.id}
              className={`relative overflow-hidden rounded-xl border ${style.border} ${style.bg} p-5 shadow-sm transition-all hover:shadow-md`}
            >
              {/* Medal / Rank */}
              <div className={`absolute top-3 right-3 flex items-center gap-1 font-bold text-xs ${style.color}`}>
                {i === 0 ? <Trophy className="h-4 w-4 text-yellow-500" /> : <Medal className={`h-4 w-4 ${style.color}`} />}
                <span>{style.rank}</span>
              </div>

              {/* Avatar */}
              <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-background/80 text-lg font-bold ring-2 ${style.ring}`}>
                {entry.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>

              <h3 className="mt-3 font-semibold text-sm">{entry.name}</h3>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-muted-foreground">Deals</p>
                  <p className="font-bold text-lg">{entry.dealsWon}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">CA</p>
                  <p className="font-bold text-sm">{formatPrice(entry.revenue)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Conversion</p>
                  <p className="font-semibold">{entry.conversionRate}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Réactivité</p>
                  <p className="font-semibold">
                    {entry.avgResponseMinutes != null
                      ? entry.avgResponseMinutes < 60
                        ? `${entry.avgResponseMinutes}min`
                        : `${Math.round(entry.avgResponseMinutes / 60)}h`
                      : '—'}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Full Ranking Table */}
      {rest.length > 0 && (
        <div className="overflow-hidden rounded-xl border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium">#</th>
                <th className="px-4 py-3 text-left font-medium">Agent</th>
                <th className="px-4 py-3 text-center font-medium">Deals</th>
                <th className="px-4 py-3 text-right font-medium hidden sm:table-cell">CA</th>
                <th className="px-4 py-3 text-center font-medium hidden md:table-cell">Conv.</th>
                <th className="px-4 py-3 text-center font-medium hidden lg:table-cell">Réactivité</th>
              </tr>
            </thead>
            <tbody>
              {rest.map((entry) => (
                <tr key={entry.id} className="border-b hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-muted-foreground">{entry.rank}</td>
                  <td className="px-4 py-3 font-medium">{entry.name}</td>
                  <td className="px-4 py-3 text-center font-semibold">{entry.dealsWon}</td>
                  <td className="px-4 py-3 text-right hidden sm:table-cell">{formatPrice(entry.revenue)}</td>
                  <td className="px-4 py-3 text-center hidden md:table-cell">{entry.conversionRate}%</td>
                  <td className="px-4 py-3 text-center hidden lg:table-cell">
                    {entry.avgResponseMinutes != null
                      ? entry.avgResponseMinutes < 60
                        ? `${entry.avgResponseMinutes}min`
                        : `${Math.round(entry.avgResponseMinutes / 60)}h`
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
