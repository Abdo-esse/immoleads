'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { requireAuth } from '@/lib/actions/auth'
import { createNotification } from '@/lib/actions/notifications'
import type { VisitWithRelations } from '@/types'

/**
 * Get all visits with lead, property, and agent relations.
 */
export async function getVisits(filter?: string): Promise<VisitWithRelations[]> {
  const { profile } = await requireAuth()

  let query = supabaseAdmin
    .from('visits')
    .select(`
      *,
      lead:leads!visits_lead_id_fkey(id, name, phone),
      property:properties!visits_property_id_fkey(id, title, slug, city),
      agent:profiles!visits_agent_id_fkey(id, full_name)
    `)
    .eq('agency_id', profile.agency_id)
    .order('visit_date', { ascending: true })
    .order('visit_time', { ascending: true })

  if (filter && filter !== 'ALL') {
    query = query.eq('status', filter)
  }

  const { data, error } = await query

  if (error) return []
  return (data as unknown as VisitWithRelations[]) ?? []
}

/**
 * Create a new visit.
 */
export async function createVisit(values: {
  lead_id: string
  property_id: string | null
  agent_id: string | null
  visit_date: string
  visit_time: string
  notes?: string
}) {
  const { profile } = await requireAuth()

  // 1. Resolve agent_id: fallback to current user if not specified
  const agentId = values.agent_id || profile.id

  // 2. Resolve property_id: if not selected, try fetching from lead's property_id
  let propertyId = values.property_id
  if (!propertyId) {
    const { data: lead } = await supabaseAdmin
      .from('leads')
      .select('property_id')
      .eq('id', values.lead_id)
      .single()
    propertyId = lead?.property_id ?? null
  }

  if (!propertyId) {
    return { error: 'Veuillez sélectionner un bien immobilier pour cette visite.' }
  }

  const { data, error } = await supabaseAdmin
    .from('visits')
    .insert({
      lead_id: values.lead_id,
      property_id: propertyId,
      agent_id: agentId,
      agency_id: profile.agency_id,
      visit_date: values.visit_date,
      visit_time: values.visit_time,
      notes: values.notes || null,
      status: 'SCHEDULED',
    })
    .select()
    .single()

  if (error) return { error: error.message }

  // Log activity on the lead
  await supabaseAdmin.from('lead_activities').insert({
    lead_id: values.lead_id,
    user_id: profile.id,
    action: 'visit_scheduled',
    details: `Visite prévue le ${new Date(values.visit_date).toLocaleDateString('fr-FR')} à ${values.visit_time}`,
  })

  // Create notification for assigned agent or agency
  try {
    await createNotification({
      agencyId: profile.agency_id,
      userId: values.agent_id || undefined,
      title: 'Visite programmée',
      message: `Visite prévue le ${new Date(values.visit_date).toLocaleDateString('fr-FR')} à ${values.visit_time}`,
      type: 'visit_scheduled',
      link: '/dashboard/visits',
    })
  } catch (err) {
    console.error('Failed to notify on visit creation:', err)
  }

  // Update lead status to VISIT_SCHEDULED if it's before that stage
  const { data: lead } = await supabaseAdmin
    .from('leads')
    .select('status')
    .eq('id', values.lead_id)
    .single()

  if (lead && ['NEW', 'CONTACTED', 'QUALIFIED'].includes((lead as any).status)) {
    await supabaseAdmin
      .from('leads')
      .update({ status: 'VISIT_SCHEDULED' })
      .eq('id', values.lead_id)
  }

  revalidatePath('/dashboard/visits')
  revalidatePath('/dashboard/leads')
  revalidatePath(`/dashboard/leads/${values.lead_id}`)
  return { data, success: true }
}

/**
 * Update a visit's status.
 */
export async function updateVisitStatus(visitId: string, status: 'COMPLETED' | 'CANCELLED' | 'NO_SHOW') {
  const { profile } = await requireAuth()

  const { data: visit, error: fetchError } = await supabaseAdmin
    .from('visits')
    .select('lead_id')
    .eq('id', visitId)
    .eq('agency_id', profile.agency_id)
    .single()

  if (fetchError || !visit) return { error: 'Visit not found' }

  const { error } = await supabaseAdmin
    .from('visits')
    .update({ status })
    .eq('id', visitId)
    .eq('agency_id', profile.agency_id)

  if (error) return { error: error.message }

  // Log activity
  const actionLabel = status === 'COMPLETED' ? 'Visite effectuée' : status === 'CANCELLED' ? 'Visite annulée' : 'No show'
  await supabaseAdmin.from('lead_activities').insert({
    lead_id: (visit as any).lead_id,
    user_id: profile.id,
    action: status === 'COMPLETED' ? 'visit_completed' : 'status_changed',
    details: actionLabel,
  })

  revalidatePath('/dashboard/visits')
  revalidatePath('/dashboard/leads')
  return { success: true }
}
