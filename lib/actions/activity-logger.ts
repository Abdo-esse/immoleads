'use server'

import { createClient } from '@/lib/supabase/server'
import type { Json } from '@/types/database'

export type ActivityAction =
  | 'status_changed'
  | 'assigned'
  | 'note_added'
  | 'whatsapp_sent'
  | 'call_made'
  | 'visit_scheduled'
  | 'visit_completed'
  | 'property_matched'
  | 'lead_created'
  | 'follow_up_set'

interface LogActivityParams {
  leadId: string
  action: ActivityAction
  details?: string
  metadata?: Json
}

/**
 * Centralized activity logger — records every action on a lead.
 * Should be called from all lead mutation server actions.
 */
export async function logActivity({ leadId, action, details, metadata }: LogActivityParams) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  await supabase.from('lead_activities').insert({
    lead_id: leadId,
    user_id: user?.id || null,
    action,
    details: details || null,
    metadata: metadata || null,
  })
}

/**
 * Get activity timeline for a lead (paginated).
 */
export async function getLeadActivities(leadId: string, limit = 30) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('lead_activities')
    .select('*, user:profiles(full_name)')
    .eq('lead_id', leadId)
    .order('created_at', { ascending: false })
    .limit(limit)

  return data || []
}
