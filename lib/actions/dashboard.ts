'use server'

import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { requireAuth } from '@/lib/actions/auth'
import type { DashboardKPIs, SourceBreakdown, LeadWithRelations } from '@/types'

/**
 * Fetch real-time KPIs for the dashboard.
 */
export async function getDashboardKPIs(): Promise<DashboardKPIs> {
  const { profile } = await requireAuth()
  return _fetchKPIs(profile.agency_id)
}

async function _fetchKPIs(agencyId: string | null): Promise<DashboardKPIs> {
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()

  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  const weekAgoISO = weekAgo.toISOString()

  let leadsQuery = supabaseAdmin
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', todayStart)
  if (agencyId) leadsQuery = leadsQuery.eq('agency_id', agencyId)
  const { count: newLeadsToday } = await leadsQuery

  let followUpsQuery = supabaseAdmin
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .lte('next_follow_up_at', new Date().toISOString())
    .not('status', 'in', '("WON","LOST")')
  if (agencyId) followUpsQuery = followUpsQuery.eq('agency_id', agencyId)
  const { count: followUpsDue } = await followUpsQuery

  let qualifiedQuery = supabaseAdmin
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'QUALIFIED')
    .gte('updated_at', weekAgoISO)
  if (agencyId) qualifiedQuery = qualifiedQuery.eq('agency_id', agencyId)
  const { count: qualifiedThisWeek } = await qualifiedQuery

  // Visits scheduled
  let visitsScheduled = 0
  const todayDate = new Date().toISOString().split('T')[0]
  let visitsQuery = supabaseAdmin
    .from('visits')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'SCHEDULED')
    .gte('visit_date', todayDate)
  if (agencyId) visitsQuery = visitsQuery.eq('agency_id', agencyId)
  const { count: vCount, error: visitsError } = await visitsQuery
  if (!visitsError) visitsScheduled = vCount ?? 0

  return {
    newLeadsToday: newLeadsToday ?? 0,
    followUpsDue: followUpsDue ?? 0,
    qualifiedThisWeek: qualifiedThisWeek ?? 0,
    visitsScheduled,
  }
}

/**
 * Consolidated dashboard data fetch.
 */
export async function getDashboardData(): Promise<{
  kpis: DashboardKPIs
  recentLeads: LeadWithRelations[]
  followUps: LeadWithRelations[]
}> {
  let agencyId: string | null = null
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('agency_id')
        .eq('id', user.id)
        .single()
      agencyId = profile?.agency_id ?? null
    }
  } catch (err) {
    console.warn('Could not resolve user in getDashboardData:', err)
  }

  if (!agencyId) {
    const { data: defaultAgency } = await supabaseAdmin.from('agencies').select('id').limit(1).single()
    agencyId = defaultAgency?.id ?? null
  }

  const kpis = await _fetchKPIs(agencyId)

  let recentQuery = supabaseAdmin
    .from('leads')
    .select(`
      *,
      property:properties(id, title, slug, city, price),
      assigned_agent:profiles!leads_assigned_to_fkey(id, full_name, avatar_url)
    `)
    .order('created_at', { ascending: false })
    .limit(5)
  if (agencyId) recentQuery = recentQuery.eq('agency_id', agencyId)
  const { data: recentData } = await recentQuery

  let followUpQuery = supabaseAdmin
    .from('leads')
    .select(`
      *,
      property:properties(id, title, slug, city, price),
      assigned_agent:profiles!leads_assigned_to_fkey(id, full_name, avatar_url)
    `)
    .lte('next_follow_up_at', new Date().toISOString())
    .not('status', 'in', '("WON","LOST")')
    .order('next_follow_up_at', { ascending: true })
    .limit(10)
  if (agencyId) followUpQuery = followUpQuery.eq('agency_id', agencyId)
  const { data: followUpData } = await followUpQuery

  return {
    kpis,
    recentLeads: (recentData as unknown as LeadWithRelations[]) ?? [],
    followUps: (followUpData as unknown as LeadWithRelations[]) ?? [],
  }
}

/**
 * Get recent leads for the dashboard.
 */
export async function getRecentLeads(limit = 5): Promise<LeadWithRelations[]> {
  const { profile } = await requireAuth()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('leads')
    .select(`
      *,
      property:properties(id, title, slug, city, price),
      assigned_agent:profiles!leads_assigned_to_fkey(id, full_name, avatar_url)
    `)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) return []
  return (data as unknown as LeadWithRelations[]) ?? []
}

/**
 * Get leads due for follow-up today or overdue.
 */
export async function getFollowUpsDue(): Promise<LeadWithRelations[]> {
  const { profile } = await requireAuth()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('leads')
    .select(`
      *,
      property:properties(id, title, slug, city, price),
      assigned_agent:profiles!leads_assigned_to_fkey(id, full_name, avatar_url)
    `)
    .lte('next_follow_up_at', new Date().toISOString())
    .not('status', 'in', '("WON","LOST")')
    .order('next_follow_up_at', { ascending: true })
    .limit(10)

  if (error) return []
  return (data as unknown as LeadWithRelations[]) ?? []
}


/**
 * Consolidated analytics data fetch.
 * Runs auth check ONCE, then runs all 4 data queries in parallel.
 */
export async function getAnalyticsData() {
  await requireAuth()

  const [funnel, sources, trends, agents] = await Promise.all([
    _getConversionFunnel(),
    _getSourceBreakdown(),
    _getMonthlyTrends(),
    _getAgentPerformance(),
  ])

  return { funnel, sources, trends, agents }
}

async function _getSourceBreakdown(): Promise<SourceBreakdown[]> {
  const { data: leads } = await supabaseAdmin
    .from('leads')
    .select('source, status')

  if (!leads) return []

  const breakdown: Record<string, { leadCount: number; qualifiedCount: number }> = {}

  for (const lead of leads as any[]) {
    const src = lead.source || 'other'
    if (!breakdown[src]) breakdown[src] = { leadCount: 0, qualifiedCount: 0 }
    breakdown[src].leadCount++
    if (['QUALIFIED', 'VISIT_SCHEDULED', 'NEGOTIATION', 'WON'].includes(lead.status)) {
      breakdown[src].qualifiedCount++
    }
  }

  return Object.entries(breakdown).map(([source, counts]) => ({
    source,
    ...counts,
  }))
}

export async function getSourceBreakdown(): Promise<SourceBreakdown[]> {
  await requireAuth()
  return _getSourceBreakdown()
}

async function _getConversionFunnel() {
  const { data: leads } = await supabaseAdmin
    .from('leads')
    .select('status')

  if (!leads) return []

  const statusOrder = ['NEW', 'CONTACTED', 'QUALIFIED', 'VISIT_SCHEDULED', 'NEGOTIATION', 'WON', 'LOST']
  const counts: Record<string, number> = {}

  for (const s of statusOrder) counts[s] = 0
  for (const lead of leads as any[]) {
    const st = lead.status || 'NEW'
    counts[st] = (counts[st] || 0) + 1
  }

  return statusOrder.map((status) => ({
    status,
    count: counts[status] || 0,
  }))
}

export async function getConversionFunnel() {
  await requireAuth()
  return _getConversionFunnel()
}

async function _getMonthlyTrends() {
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
  sixMonthsAgo.setDate(1)
  sixMonthsAgo.setHours(0, 0, 0, 0)

  const { data: leads } = await supabaseAdmin
    .from('leads')
    .select('created_at')
    .gte('created_at', sixMonthsAgo.toISOString())

  if (!leads) return []

  const months: Record<string, number> = {}

  // Pre-populate the last 6 months
  for (let i = 5; i >= 0; i--) {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    months[key] = 0
  }

  for (const lead of leads as any[]) {
    const d = new Date(lead.created_at)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    if (key in months) months[key]++
  }

  return Object.entries(months).map(([month, count]) => ({
    month,
    label: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
    count,
  }))
}

export async function getMonthlyTrends() {
  await requireAuth()
  return _getMonthlyTrends()
}

async function _getAgentPerformance() {
  const { data: leads } = await supabaseAdmin
    .from('leads')
    .select('assigned_to, status')

  const { data: agents } = await supabaseAdmin
    .from('profiles')
    .select('id, full_name')

  if (!leads || !agents) return []

  const agentMap: Record<string, { name: string; total: number; qualified: number; won: number }> = {}

  for (const agent of agents as any[]) {
    agentMap[agent.id] = { name: agent.full_name, total: 0, qualified: 0, won: 0 }
  }

  for (const lead of leads as any[]) {
    if (!lead.assigned_to || !agentMap[lead.assigned_to]) continue
    agentMap[lead.assigned_to].total++
    if (['QUALIFIED', 'VISIT_SCHEDULED', 'NEGOTIATION', 'WON'].includes(lead.status)) {
      agentMap[lead.assigned_to].qualified++
    }
    if (lead.status === 'WON') {
      agentMap[lead.assigned_to].won++
    }
  }

  return Object.entries(agentMap)
    .filter(([, data]) => data.total > 0)
    .map(([id, data]) => ({
      id,
      name: data.name,
      total: data.total,
      qualified: data.qualified,
      won: data.won,
      conversionRate: data.total > 0 ? Math.round((data.qualified / data.total) * 100) : 0,
    }))
}

export async function getAgentPerformance() {
  await requireAuth()
  return _getAgentPerformance()
}

