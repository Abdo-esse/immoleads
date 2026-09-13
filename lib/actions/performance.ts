'use server'

import { supabaseAdmin } from '@/lib/supabase/admin'
import { requireAuth } from '@/lib/actions/auth'
import type { Agency } from '@/types'

// ═══════════════════════════════════════════
// Performance & Revenue Analytics
// ═══════════════════════════════════════════

export interface RevenueKPIs {
  totalRevenue: number
  agencyCommission: number
  agentCommissions: { agentId: string; agentName: string; commission: number }[]
  dealsWon: number
  avgDealSize: number
  commissionRate: number
  agentShare: number
}

export interface LeaderboardEntry {
  id: string
  name: string
  avatarUrl: string | null
  dealsWon: number
  revenue: number
  totalLeads: number
  qualified: number
  conversionRate: number
  avgResponseMinutes: number | null
  rank: number
}

export interface ResponseTimeData {
  agentId: string
  agentName: string
  avgMinutes: number
  totalResponded: number
  badge: 'excellent' | 'good' | 'slow' | 'critical'
}

export interface MonthlyGoals {
  leadGoal: number
  leadCurrent: number
  wonGoal: number
  wonCurrent: number
  revenueGoal: number
  revenueCurrent: number
}

/**
 * Get monthly revenue, commissions, and deal metrics.
 */
export async function getRevenueKPIs(month?: string): Promise<RevenueKPIs> {
  const { profile } = await requireAuth()
  const agencyId = profile.agency_id

  // Get agency commission settings
  const { data: agency } = await supabaseAdmin
    .from('agencies')
    .select('commission_rate, agent_share')
    .eq('id', agencyId)
    .single()

  const commissionRate = (agency?.commission_rate as number) ?? 2.5
  const agentShare = (agency?.agent_share as number) ?? 40

  // Date range for current or specified month
  const now = month ? new Date(month + '-01') : new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString()

  // Get all WON leads for this month with their property prices
  const { data: wonLeads } = await supabaseAdmin
    .from('leads')
    .select(`
      id, assigned_to, updated_at,
      property:properties(id, price)
    `)
    .eq('agency_id', agencyId)
    .eq('status', 'WON')
    .gte('updated_at', monthStart)
    .lte('updated_at', monthEnd)

  if (!wonLeads || wonLeads.length === 0) {
    return {
      totalRevenue: 0,
      agencyCommission: 0,
      agentCommissions: [],
      dealsWon: 0,
      avgDealSize: 0,
      commissionRate,
      agentShare,
    }
  }

  // Get agent names
  const { data: agents } = await supabaseAdmin
    .from('profiles')
    .select('id, full_name')
    .eq('agency_id', agencyId)

  const agentMap: Record<string, string> = {}
  for (const a of agents || []) agentMap[a.id] = a.full_name

  // Calculate revenues
  let totalRevenue = 0
  const agentRevenues: Record<string, number> = {}

  for (const lead of wonLeads as any[]) {
    const price = lead.property?.price || 0
    totalRevenue += price
    if (lead.assigned_to) {
      agentRevenues[lead.assigned_to] = (agentRevenues[lead.assigned_to] || 0) + price
    }
  }

  const agencyCommission = totalRevenue * (commissionRate / 100)

  const agentCommissions = Object.entries(agentRevenues).map(([agentId, revenue]) => ({
    agentId,
    agentName: agentMap[agentId] || 'Agent',
    commission: revenue * (commissionRate / 100) * (agentShare / 100),
  }))

  return {
    totalRevenue,
    agencyCommission,
    agentCommissions,
    dealsWon: wonLeads.length,
    avgDealSize: totalRevenue / wonLeads.length,
    commissionRate,
    agentShare,
  }
}

/**
 * Get agent leaderboard for a given month.
 */
export async function getLeaderboard(month?: string): Promise<LeaderboardEntry[]> {
  const { profile } = await requireAuth()
  const agencyId = profile.agency_id

  const now = month ? new Date(month + '-01') : new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString()

  // Get all agents
  const { data: agents } = await supabaseAdmin
    .from('profiles')
    .select('id, full_name, avatar_url')
    .eq('agency_id', agencyId)

  if (!agents || agents.length === 0) return []

  // Get all leads for this month
  const { data: leads } = await supabaseAdmin
    .from('leads')
    .select(`
      id, assigned_to, status, created_at, last_contacted_at,
      property:properties(id, price)
    `)
    .eq('agency_id', agencyId)
    .gte('created_at', monthStart)
    .lte('created_at', monthEnd)

  const leadsData = (leads || []) as any[]

  // Build leaderboard
  const entries: LeaderboardEntry[] = agents.map((agent) => {
    const agentLeads = leadsData.filter((l) => l.assigned_to === agent.id)
    const won = agentLeads.filter((l) => l.status === 'WON')
    const qualified = agentLeads.filter((l) =>
      ['QUALIFIED', 'VISIT_SCHEDULED', 'NEGOTIATION', 'WON'].includes(l.status)
    )

    // Revenue from WON deals
    const revenue = won.reduce((sum: number, l: any) => sum + (l.property?.price || 0), 0)

    // Average response time
    const respondedLeads = agentLeads.filter(
      (l) => l.last_contacted_at && l.created_at
    )
    let avgResponseMinutes: number | null = null
    if (respondedLeads.length > 0) {
      const totalMinutes = respondedLeads.reduce((sum: number, l: any) => {
        const created = new Date(l.created_at).getTime()
        const contacted = new Date(l.last_contacted_at).getTime()
        return sum + (contacted - created) / 60_000
      }, 0)
      avgResponseMinutes = Math.round(totalMinutes / respondedLeads.length)
    }

    return {
      id: agent.id,
      name: agent.full_name,
      avatarUrl: agent.avatar_url,
      dealsWon: won.length,
      revenue,
      totalLeads: agentLeads.length,
      qualified: qualified.length,
      conversionRate: agentLeads.length > 0
        ? Math.round((won.length / agentLeads.length) * 100)
        : 0,
      avgResponseMinutes,
      rank: 0, // will be set after sorting
    }
  })

  // Sort by: deals WON desc, then revenue desc, then conversion rate desc
  entries.sort((a, b) => {
    if (b.dealsWon !== a.dealsWon) return b.dealsWon - a.dealsWon
    if (b.revenue !== a.revenue) return b.revenue - a.revenue
    return b.conversionRate - a.conversionRate
  })

  // Assign ranks
  entries.forEach((e, i) => { e.rank = i + 1 })

  return entries
}

/**
 * Get average response time per agent.
 */
export async function getResponseTimes(): Promise<{
  agents: ResponseTimeData[]
  agencyAvg: number
}> {
  const { profile } = await requireAuth()
  const agencyId = profile.agency_id

  // Get leads with response data
  const { data: leads } = await supabaseAdmin
    .from('leads')
    .select('assigned_to, created_at, last_contacted_at')
    .eq('agency_id', agencyId)
    .not('last_contacted_at', 'is', null)
    .not('assigned_to', 'is', null)

  const { data: agents } = await supabaseAdmin
    .from('profiles')
    .select('id, full_name')
    .eq('agency_id', agencyId)

  if (!leads || !agents) return { agents: [], agencyAvg: 0 }

  // Calculate per-agent averages
  const agentTimes: Record<string, { total: number; count: number }> = {}
  for (const agent of agents) {
    agentTimes[agent.id] = { total: 0, count: 0 }
  }

  let globalTotal = 0
  let globalCount = 0

  for (const lead of leads as any[]) {
    if (!lead.assigned_to || !agentTimes[lead.assigned_to]) continue
    const minutes = (new Date(lead.last_contacted_at).getTime() - new Date(lead.created_at).getTime()) / 60_000
    if (minutes < 0 || minutes > 10_080) continue // skip invalid (>7 days)
    agentTimes[lead.assigned_to].total += minutes
    agentTimes[lead.assigned_to].count++
    globalTotal += minutes
    globalCount++
  }

  const agentMap: Record<string, string> = {}
  for (const a of agents) agentMap[a.id] = a.full_name

  const result: ResponseTimeData[] = Object.entries(agentTimes)
    .filter(([, data]) => data.count > 0)
    .map(([agentId, data]) => {
      const avgMinutes = Math.round(data.total / data.count)
      return {
        agentId,
        agentName: agentMap[agentId] || 'Agent',
        avgMinutes,
        totalResponded: data.count,
        badge: avgMinutes <= 15
          ? 'excellent' as const
          : avgMinutes <= 60
            ? 'good' as const
            : avgMinutes <= 120
              ? 'slow' as const
              : 'critical' as const,
      }
    })
    .sort((a, b) => a.avgMinutes - b.avgMinutes)

  return {
    agents: result,
    agencyAvg: globalCount > 0 ? Math.round(globalTotal / globalCount) : 0,
  }
}

/**
 * Get monthly goals with current progress.
 */
export async function getMonthlyGoals(): Promise<MonthlyGoals> {
  const { profile } = await requireAuth()
  const agencyId = profile.agency_id

  // Get agency goals
  const { data: agency } = await supabaseAdmin
    .from('agencies')
    .select('monthly_lead_goal, monthly_won_goal, monthly_revenue_goal')
    .eq('id', agencyId)
    .single()

  const leadGoal = (agency?.monthly_lead_goal as number) ?? 0
  const wonGoal = (agency?.monthly_won_goal as number) ?? 0
  const revenueGoal = (agency?.monthly_revenue_goal as number) ?? 0

  // Current month range
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString()

  // Count qualified leads this month
  const { count: leadCurrent } = await supabaseAdmin
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .eq('agency_id', agencyId)
    .in('status', ['QUALIFIED', 'VISIT_SCHEDULED', 'NEGOTIATION', 'WON'])
    .gte('created_at', monthStart)
    .lte('created_at', monthEnd)

  // Count WON leads this month
  const { count: wonCurrent } = await supabaseAdmin
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .eq('agency_id', agencyId)
    .eq('status', 'WON')
    .gte('updated_at', monthStart)
    .lte('updated_at', monthEnd)

  // Revenue this month
  const { data: wonLeads } = await supabaseAdmin
    .from('leads')
    .select('property:properties(price)')
    .eq('agency_id', agencyId)
    .eq('status', 'WON')
    .gte('updated_at', monthStart)
    .lte('updated_at', monthEnd)

  const revenueCurrent = (wonLeads || []).reduce(
    (sum: number, l: any) => sum + (l.property?.price || 0),
    0
  )

  return {
    leadGoal,
    leadCurrent: leadCurrent ?? 0,
    wonGoal,
    wonCurrent: wonCurrent ?? 0,
    revenueGoal,
    revenueCurrent,
  }
}

/**
 * Update agency performance settings (commission rates + goals).
 */
export async function updatePerformanceSettings(values: {
  commission_rate?: number
  agent_share?: number
  monthly_lead_goal?: number
  monthly_won_goal?: number
  monthly_revenue_goal?: number
}) {
  const { profile } = await requireAuth()

  // Only admins can update performance settings
  if (profile.role !== 'admin') {
    return { error: 'Seuls les administrateurs peuvent modifier ces paramètres.' }
  }

  const { error } = await supabaseAdmin
    .from('agencies')
    .update(values)
    .eq('id', profile.agency_id)

  if (error) return { error: error.message }
  return { success: true }
}
