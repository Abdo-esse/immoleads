'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend,
} from 'recharts'
import { LEAD_STATUS_CONFIG } from '@/lib/constants'
import { RevenueKpisSection } from '@/components/dashboard/revenue-kpis'
import { AgentLeaderboard } from '@/components/dashboard/agent-leaderboard'
import { ResponseTimeChart } from '@/components/dashboard/response-time-chart'
import { MonthlyGoalsSection } from '@/components/dashboard/monthly-goals'
import type { RevenueKPIs, LeaderboardEntry, ResponseTimeData, MonthlyGoals } from '@/lib/actions/performance'
import { Download } from 'lucide-react'

interface Props {
  funnel: { status: string; count: number }[]
  sources: { source: string; leadCount: number; qualifiedCount: number }[]
  trends: { month: string; label: string; count: number }[]
  agents: { id: string; name: string; total: number; qualified: number; won: number; conversionRate: number }[]
  revenue?: RevenueKPIs
  leaderboard?: LeaderboardEntry[]
  responseTimes?: { agents: ResponseTimeData[]; agencyAvg: number }
  goals?: MonthlyGoals
}

const SOURCE_COLORS = [
  '#6366f1', // indigo
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#f59e0b', // amber
  '#10b981', // emerald
  '#64748b', // slate
]

const FUNNEL_COLORS: Record<string, string> = {
  NEW: '#3b82f6',
  CONTACTED: '#eab308',
  QUALIFIED: '#8b5cf6',
  VISIT_SCHEDULED: '#22c55e',
  NEGOTIATION: '#f97316',
  WON: '#10b981',
  LOST: '#ef4444',
}

export function AnalyticsClient({ funnel, sources, trends, agents, revenue, leaderboard, responseTimes, goals }: Props) {
  const totalLeads = funnel.reduce((sum, f) => sum + f.count, 0)

  const handleDownloadPDF = async () => {
    const { generateMonthlyReport } = await import('@/lib/utils/pdf-report')
    const now = new Date()
    const monthLabel = now.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
    generateMonthlyReport({
      agencyName: 'ImmoLeads Agency',
      month: monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1),
      revenue: revenue || { totalRevenue: 0, agencyCommission: 0, agentCommissions: [], dealsWon: 0, avgDealSize: 0, commissionRate: 2.5, agentShare: 40 },
      leaderboard: leaderboard || [],
      goals: goals || { leadGoal: 0, leadCurrent: 0, wonGoal: 0, wonCurrent: 0, revenueGoal: 0, revenueCurrent: 0 },
      funnel,
      sources,
    })
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics & Performance</h1>
          <p className="text-muted-foreground">
            Pilotez votre activité commerciale en temps réel.
          </p>
        </div>
        <button
          onClick={handleDownloadPDF}
          className="inline-flex items-center gap-2 rounded-lg border bg-card px-4 py-2.5 text-sm font-medium shadow-sm hover:bg-muted transition"
        >
          <Download className="h-4 w-4" />
          Télécharger PDF
        </button>
      </div>

      {/* ═══ Phase 8: Revenue KPIs ═══ */}
      {revenue && <RevenueKpisSection data={revenue} />}

      {/* ═══ Phase 8: Monthly Goals ═══ */}
      {goals && <MonthlyGoalsSection goals={goals} />}

      {/* ═══ Phase 8: Agent Leaderboard ═══ */}
      {leaderboard && <AgentLeaderboard entries={leaderboard} />}

      {/* ═══ Phase 8: Response Time ═══ */}
      {responseTimes && (
        <ResponseTimeChart agents={responseTimes.agents} agencyAvg={responseTimes.agencyAvg} />
      )}

      {/* ═══ Existing: Summary Cards ═══ */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label="Total Leads"
          value={totalLeads}
          color="text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30"
        />
        <SummaryCard
          label="Won"
          value={funnel.find(f => f.status === 'WON')?.count ?? 0}
          color="text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30"
        />
        <SummaryCard
          label="Conversion Rate"
          value={`${totalLeads > 0 ? Math.round(((funnel.find(f => f.status === 'WON')?.count ?? 0) / totalLeads) * 100) : 0}%`}
          color="text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30"
        />
        <SummaryCard
          label="Active Agents"
          value={agents.length}
          color="text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Conversion Funnel */}
        <div className="rounded-xl border bg-card p-6">
          <h2 className="text-lg font-semibold mb-1">Conversion Funnel</h2>
          <p className="text-xs text-muted-foreground mb-4">Lead count by pipeline stage</p>
          {funnel.length === 0 ? (
            <EmptyChart />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={funnel} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis
                  type="category"
                  dataKey="status"
                  tick={{ fontSize: 11 }}
                  width={100}
                  stroke="hsl(var(--muted-foreground))"
                  tickFormatter={(val: string) =>
                    LEAD_STATUS_CONFIG[val as keyof typeof LEAD_STATUS_CONFIG]?.label ?? val
                  }
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 8,
                    fontSize: 13,
                  }}
                  labelFormatter={(val: any) =>
                    LEAD_STATUS_CONFIG[String(val) as keyof typeof LEAD_STATUS_CONFIG]?.label ?? String(val)
                  }
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {funnel.map((entry) => (
                    <Cell key={entry.status} fill={FUNNEL_COLORS[entry.status] || '#94a3b8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Lead Sources */}
        <div className="rounded-xl border bg-card p-6">
          <h2 className="text-lg font-semibold mb-1">Lead Sources</h2>
          <p className="text-xs text-muted-foreground mb-4">Where your leads come from</p>
          {sources.length === 0 ? (
            <EmptyChart />
          ) : (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="60%" height={300}>
                <PieChart>
                  <Pie
                    data={sources}
                    dataKey="leadCount"
                    nameKey="source"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {sources.map((_, i) => (
                      <Cell key={i} fill={SOURCE_COLORS[i % SOURCE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 8,
                      fontSize: 13,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2.5">
                {sources.map((s, i) => (
                  <div key={s.source} className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full shrink-0"
                      style={{ backgroundColor: SOURCE_COLORS[i % SOURCE_COLORS.length] }}
                    />
                    <span className="text-sm capitalize flex-1">{s.source}</span>
                    <span className="text-sm font-semibold">{s.leadCount}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Monthly Trends */}
        <div className="rounded-xl border bg-card p-6">
          <h2 className="text-lg font-semibold mb-1">Monthly Trends</h2>
          <p className="text-xs text-muted-foreground mb-4">Leads created over the last 6 months</p>
          {trends.length === 0 ? (
            <EmptyChart />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trends} margin={{ left: 0, right: 0 }}>
                <defs>
                  <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 8,
                    fontSize: 13,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fill="url(#trendGradient)"
                  name="Leads"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Agent Performance */}
        <div className="rounded-xl border bg-card p-6">
          <h2 className="text-lg font-semibold mb-1">Agent Performance</h2>
          <p className="text-xs text-muted-foreground mb-4">Leads per agent with conversion rates</p>
          {agents.length === 0 ? (
            <EmptyChart message="No agent data yet" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={agents} margin={{ left: 0, right: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  stroke="hsl(var(--muted-foreground))"
                  tickFormatter={(val: string) => val.split(' ')[0]}
                />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 8,
                    fontSize: 13,
                  }}
                  formatter={(value: any, name: any) => {
                    return [value, name === 'total' ? 'Total Leads' : name === 'qualified' ? 'Qualified' : 'Won']
                  }}
                />
                <Legend
                  formatter={(value) => {
                    if (value === 'total') return 'Total'
                    if (value === 'qualified') return 'Qualified'
                    return 'Won'
                  }}
                />
                <Bar dataKey="total" fill="#94a3b8" radius={[4, 4, 0, 0]} name="total" />
                <Bar dataKey="qualified" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="qualified" />
                <Bar dataKey="won" fill="#10b981" radius={[4, 4, 0, 0]} name="won" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}

function SummaryCard({ label, value, color }: { label: string; value: number | string; color: string }) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  )
}

function EmptyChart({ message = 'No data available' }: { message?: string }) {
  return (
    <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
      {message}
    </div>
  )
}
