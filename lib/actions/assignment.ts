'use server'

import { supabaseAdmin } from '@/lib/supabase/admin'
import { createNotification } from '@/lib/actions/notifications'

// ═══════════════════════════════════════════
// Smart Round-Robin Lead Assignment
// ═══════════════════════════════════════════

/**
 * Get the next agent for round-robin assignment within an agency.
 * 
 * Strategy:
 * 1. Fetch all active agents for the agency.
 * 2. Count each agent's currently assigned leads (status not WON/LOST).
 * 3. Pick the agent with the fewest active leads (most fair distribution).
 * 
 * Optional: If `city` is provided, prefer agents who have been assigned
 * leads in that city before (geographic specialization).
 */
export async function getNextRoundRobinAgent(
  agencyId: string,
  city?: string | null
): Promise<string | null> {
  // 1. Fetch all agents in the agency
  const { data: agents, error: agentsError } = await supabaseAdmin
    .from('profiles')
    .select('id, full_name')
    .eq('agency_id', agencyId)
    .order('created_at', { ascending: true })

  if (agentsError || !agents || agents.length === 0) {
    console.warn('[RoundRobin] No agents found for agency:', agencyId)
    return null
  }

  // 2. Count active leads per agent
  const agentIds = agents.map((a) => a.id)

  const { data: leadCounts, error: countError } = await supabaseAdmin
    .from('leads')
    .select('assigned_to')
    .eq('agency_id', agencyId)
    .not('status', 'in', '("WON","LOST")')
    .not('assigned_to', 'is', null)

  if (countError) {
    console.warn('[RoundRobin] Error counting leads:', countError.message)
    // Fall back to first agent
    return agents[0].id
  }

  // Build count map
  const countMap: Record<string, number> = {}
  for (const agent of agents) {
    countMap[agent.id] = 0
  }
  for (const lead of leadCounts || []) {
    if (lead.assigned_to && countMap[lead.assigned_to] !== undefined) {
      countMap[lead.assigned_to]++
    }
  }

  // 3. Geographic preference (optional)
  let preferredAgentId: string | null = null
  if (city) {
    const { data: cityLeads } = await supabaseAdmin
      .from('leads')
      .select('assigned_to')
      .eq('agency_id', agencyId)
      .eq('city', city)
      .not('assigned_to', 'is', null)
      .limit(20)

    if (cityLeads && cityLeads.length > 0) {
      // Count which agent handles most leads in this city
      const cityCountMap: Record<string, number> = {}
      for (const cl of cityLeads) {
        if (cl.assigned_to) {
          cityCountMap[cl.assigned_to] = (cityCountMap[cl.assigned_to] || 0) + 1
        }
      }
      const sorted = Object.entries(cityCountMap).sort(([, a], [, b]) => b - a)
      if (sorted.length > 0) {
        preferredAgentId = sorted[0][0]
      }
    }
  }

  // 4. Pick the agent with fewest active leads
  // Give a slight bias (-0.5) to geographically preferred agent
  const ranked = agents
    .map((agent) => ({
      id: agent.id,
      name: agent.full_name,
      count: countMap[agent.id] || 0,
      bias: agent.id === preferredAgentId ? -0.5 : 0,
    }))
    .sort((a, b) => (a.count + a.bias) - (b.count + b.bias))

  return ranked[0]?.id || agents[0].id
}

/**
 * Auto-assign a lead to the next agent via round-robin.
 * Also creates a notification for the assigned agent.
 */
export async function autoAssignLead(
  leadId: string,
  agencyId: string,
  leadName: string,
  leadPhone: string,
  city?: string | null
): Promise<{ agentId: string | null; error?: string }> {
  const agentId = await getNextRoundRobinAgent(agencyId, city)

  if (!agentId) {
    return { agentId: null, error: 'Aucun agent disponible pour l\'attribution automatique.' }
  }

  // Update lead
  const { error: updateError } = await supabaseAdmin
    .from('leads')
    .update({ assigned_to: agentId })
    .eq('id', leadId)

  if (updateError) {
    return { agentId: null, error: updateError.message }
  }

  // Log activity
  const { data: agent } = await supabaseAdmin
    .from('profiles')
    .select('full_name')
    .eq('id', agentId)
    .single()

  await supabaseAdmin.from('lead_activities').insert({
    lead_id: leadId,
    action: 'agent_assigned',
    details: `Attribution automatique (Round-Robin) → ${agent?.full_name || 'Agent'}`,
  })

  // Notify the assigned agent
  await createNotification({
    agencyId,
    userId: agentId,
    title: 'Nouveau lead attribué (Round-Robin)',
    message: `${leadName} (${leadPhone})${city ? ` — ${city}` : ''} vous a été automatiquement assigné.`,
    type: 'lead_assigned',
    link: `/dashboard/leads/${leadId}`,
  })

  return { agentId }
}
