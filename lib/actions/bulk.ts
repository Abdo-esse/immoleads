'use server'

import { createClient } from '@/lib/supabase/server'
import { logActivity } from './activity-logger'
import type { LeadStatus } from '@/types'

/**
 * Bulk assign leads to an agent.
 */
export async function bulkAssignLeads(leadIds: string[], agentId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non authentifié', count: 0 }

  const { error } = await supabase
    .from('leads')
    .update({ assigned_to: agentId })
    .in('id', leadIds)

  if (error) return { error: error.message, count: 0 }

  // Log activity for each lead
  for (const leadId of leadIds) {
    await logActivity({
      leadId,
      action: 'assigned',
      details: `Assigné en masse`,
    })
  }

  return { count: leadIds.length }
}

/**
 * Bulk update lead status.
 */
export async function bulkUpdateStatus(leadIds: string[], status: LeadStatus | string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non authentifié', count: 0 }

  const { error } = await supabase
    .from('leads')
    .update({ status: status as LeadStatus })
    .in('id', leadIds)

  if (error) return { error: error.message, count: 0 }

  for (const leadId of leadIds) {
    await logActivity({
      leadId,
      action: 'status_changed',
      details: `Statut changé en masse → ${status}`,
    })
  }

  return { count: leadIds.length }
}

/**
 * Bulk delete leads.
 */
export async function bulkDeleteLeads(leadIds: string[]) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non authentifié', count: 0 }

  const { error } = await supabase
    .from('leads')
    .delete()
    .in('id', leadIds)

  if (error) return { error: error.message, count: 0 }

  return { count: leadIds.length }
}
