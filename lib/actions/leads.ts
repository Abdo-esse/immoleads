'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { leadSchema, type LeadFormValues } from '@/lib/validators/lead'
import { requireAuth } from '@/lib/actions/auth'
import { createNotification } from '@/lib/actions/notifications'
import { autoAssignLead } from '@/lib/actions/assignment'
import { checkRateLimit, getClientIp } from '@/lib/utils/rate-limit'
import type { LeadWithRelations, Lead } from '@/types'

/**
 * Submit a lead from the public form.
 * Uses admin client (service-role) to bypass RLS.
 */
export async function submitPublicLead(values: LeadFormValues) {
  // 1. In-memory Rate Limiting by IP (max 5 requests per minute)
  const clientIp = await getClientIp()
  const rateLimit = checkRateLimit(`public_lead_${clientIp}`, 5, 60 * 1000)

  if (!rateLimit.allowed) {
    return {
      error: {
        _form: [
          `Trop de demandes. Veuillez patienter ${rateLimit.retryAfterSeconds} secondes avant de réessayer.`,
        ],
      },
    }
  }

  // 2. Anti-bot Honeypot check (hidden field in frontend)
  if (values.hp_company_field && values.hp_company_field.trim().length > 0) {
    console.warn(`[Honeypot Triggered] Spambot detected from IP: ${clientIp}`)
    // Return fake success so spambots don't adjust their strategy
    return { success: true }
  }

  const parsed = leadSchema.safeParse(values)

  if (!parsed.success) {
    console.error('[submitPublicLead validation failed]:', parsed.error.flatten().fieldErrors)
    return { error: parsed.error.flatten().fieldErrors }
  }

  const supabase = supabaseAdmin

  // Auto-assign to the property's agent if property_id is set
  let assignedTo: string | null = null
  if (parsed.data.property_id) {
    const { data: property } = await supabase
      .from('properties')
      .select('assigned_agent_id')
      .eq('id', parsed.data.property_id)
      .single()

    assignedTo = property?.assigned_agent_id ?? null
  }

  // Omit honeypot field from DB payload
  const { hp_company_field, ...dbPayload } = parsed.data

  const { data, error } = await supabase
    .from('leads')
    .insert({
      ...dbPayload,
      assigned_to: assignedTo,
      status: 'NEW',
    })
    .select()
    .single()

  if (error) {
    console.error('[submitPublicLead DB insert failed]:', error)
    return { error: { _form: [error.message] } }
  }

  // Log activity
  await supabase.from('lead_activities').insert({
    lead_id: data.id,
    action: 'lead_created',
    details: `Lead créé via ${parsed.data.source || 'website'}`,
  })

  // Trigger in-app notification for agency / assigned agent
  await createNotification({
    agencyId: data.agency_id,
    userId: assignedTo,
    title: 'Nouveau lead reçu',
    message: `${data.name} (${data.phone}) vient de soumettre une demande.`,
    type: 'lead_created',
    link: `/dashboard/leads/${data.id}`,
  })

  // Auto-assign via round-robin if no agent was assigned
  if (!assignedTo) {
    try {
      const { agentId } = await autoAssignLead(
        data.id,
        data.agency_id,
        data.name,
        data.phone,
        parsed.data.city || null
      )
      if (agentId) {
        assignedTo = agentId
      }
    } catch (err) {
      console.warn('[submitPublicLead] Round-robin auto-assign failed:', err)
    }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/leads')
  revalidatePath('/dashboard/leads/pipeline')
  revalidatePath('/dashboard/analytics')
  return { data, success: true }
}

/**
 * Get all leads for the current user's agency (dashboard).
 */
export async function getLeads(): Promise<LeadWithRelations[]> {
  const { profile } = await requireAuth()

  let query = supabaseAdmin
    .from('leads')
    .select(`
      *,
      property:properties(id, title, slug),
      assigned_agent:profiles!leads_assigned_to_fkey(id, full_name, avatar_url)
    `)
    .eq('agency_id', profile.agency_id)
    .order('created_at', { ascending: false })

  // Agents see only their assigned leads, admins see all
  if (profile.role !== 'admin') {
    query = query.eq('assigned_to', profile.id)
  }

  const { data, error } = await query

  if (error) return []
  return (data as unknown as LeadWithRelations[]) ?? []
}

/**
 * Get a single lead with all relations.
 */
export async function getLeadById(id: string): Promise<LeadWithRelations | null> {
  const { profile } = await requireAuth()

  let query = supabaseAdmin
    .from('leads')
    .select(`
      *,
      property:properties(id, title, slug, city, price, type, images),
      assigned_agent:profiles!leads_assigned_to_fkey(id, full_name, avatar_url, phone, email)
    `)
    .eq('id', id)
    .eq('agency_id', profile.agency_id)

  // Anti-IDOR: Agents can only view leads assigned to them; admins see all
  if (profile.role !== 'admin') {
    query = query.eq('assigned_to', profile.id)
  }

  const { data, error } = await query.single()

  if (error) return null
  return data as unknown as LeadWithRelations
}

/**
 * Update a lead's status (Kanban drag or manual change).
 */
export async function updateLeadStatus(id: string, status: string, lost_reason?: string) {
  const { profile } = await requireAuth()

  const updateData: {
    status: string
    lost_reason?: string
    last_contacted_at?: string
  } = { status }
  if (status === 'LOST' && lost_reason) {
    updateData.lost_reason = lost_reason
  }
  if (status === 'CONTACTED' || status === 'QUALIFIED') {
    updateData.last_contacted_at = new Date().toISOString()
  }

  let updateQuery = supabaseAdmin
    .from('leads')
    .update(updateData)
    .eq('id', id)
    .eq('agency_id', profile.agency_id)

  // Anti-IDOR: Agents can only update leads assigned to them
  if (profile.role !== 'admin') {
    updateQuery = updateQuery.eq('assigned_to', profile.id)
  }

  const { error } = await updateQuery

  if (error) return { error: error.message }

  // Log activity
  const adminClient = supabaseAdmin
  await adminClient.from('lead_activities').insert({
    lead_id: id,
    user_id: profile.id,
    action: 'status_changed',
    details: `Status → ${status}${lost_reason ? ` (${lost_reason})` : ''}`,
  })

  revalidatePath('/dashboard/leads')
  revalidatePath('/dashboard/leads/pipeline')
  return { success: true }
}

/**
 * Assign a lead to an agent.
 */
export async function assignLead(leadId: string, agentId: string) {
  const { profile } = await requireAuth()

  // Anti-IDOR: Only admins can assign / reassign leads
  if (profile.role !== 'admin') {
    return { error: 'Seuls les administrateurs peuvent réassigner des leads.' }
  }

  const { error } = await supabaseAdmin
    .from('leads')
    .update({ assigned_to: agentId })
    .eq('id', leadId)
    .eq('agency_id', profile.agency_id)

  if (error) return { error: error.message }

  // Log activity
  const adminClient = supabaseAdmin
  const { data: agent } = await adminClient
    .from('profiles')
    .select('full_name')
    .eq('id', agentId)
    .single()

  await adminClient.from('lead_activities').insert({
    lead_id: leadId,
    user_id: profile.id,
    action: 'agent_assigned',
    details: `Assigné à ${agent?.full_name || 'Unknown'}`,
  })

  // Trigger in-app notification to the assigned agent
  await createNotification({
    agencyId: profile.agency_id,
    userId: agentId,
    title: 'Lead assigné',
    message: `Un prospect vous a été attribué par ${profile.full_name}.`,
    type: 'lead_assigned',
    link: `/dashboard/leads/${leadId}`,
  })

  revalidatePath('/dashboard/leads')
  return { success: true }
}

/**
 * Schedule a follow-up for a lead.
 */
export async function scheduleFollowUp(leadId: string, date: string) {
  const { profile } = await requireAuth()

  const { error } = await supabaseAdmin
    .from('leads')
    .update({ next_follow_up_at: date })
    .eq('id', leadId)
    .eq('agency_id', profile.agency_id)

  if (error) return { error: error.message }

  await supabaseAdmin.from('lead_activities').insert({
    lead_id: leadId,
    performed_by: profile.id,
    action: 'follow_up_scheduled',
    details: `Relance prévue le ${new Date(date).toLocaleDateString('fr-MA')}`,
  })

  revalidatePath('/dashboard/leads')
  revalidatePath('/dashboard/follow-ups')
  revalidatePath('/dashboard')
  return { success: true }
}

/**
 * Quick reschedule a follow-up by adding days.
 */
export async function quickRescheduleFollowUp(leadId: string, daysToAdd: number) {
  const nextDate = new Date()
  nextDate.setDate(nextDate.getDate() + daysToAdd)
  nextDate.setHours(10, 0, 0, 0)
  return scheduleFollowUp(leadId, nextDate.toISOString())
}

/**
 * Get leads grouped by follow-up urgency (overdue, today, upcoming).
 */
export async function getFollowUpsList(): Promise<{
  overdue: LeadWithRelations[]
  today: LeadWithRelations[]
  upcoming: LeadWithRelations[]
}> {
  const { profile } = await requireAuth()

  let query = supabaseAdmin
    .from('leads')
    .select(`
      *,
      property:properties(id, title, slug, city, price),
      assigned_agent:profiles!leads_assigned_to_fkey(id, full_name, avatar_url, phone)
    `)
    .eq('agency_id', profile.agency_id)
    .not('next_follow_up_at', 'is', null)
    .not('status', 'in', '("WON","LOST")')
    .order('next_follow_up_at', { ascending: true })

  if (profile.role !== 'admin') {
    query = query.eq('assigned_to', profile.id)
  }

  const { data, error } = await query
  if (error || !data) return { overdue: [], today: [], upcoming: [] }

  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).toISOString()

  const leads = data as unknown as LeadWithRelations[]

  return {
    overdue: leads.filter((l) => l.next_follow_up_at! < todayStart),
    today: leads.filter((l) => l.next_follow_up_at! >= todayStart && l.next_follow_up_at! <= todayEnd),
    upcoming: leads.filter((l) => l.next_follow_up_at! > todayEnd),
  }
}

/**
 * Add a note to a lead.
 */
export async function addLeadNote(leadId: string, content: string) {
  const { profile } = await requireAuth()

  // Anti-IDOR: Verify lead access
  const { data: lead } = await supabaseAdmin
    .from('leads')
    .select('id, agency_id, assigned_to')
    .eq('id', leadId)
    .single()

  if (!lead || lead.agency_id !== profile.agency_id) {
    return { error: 'Lead introuvable.' }
  }
  if (profile.role !== 'admin' && lead.assigned_to !== profile.id) {
    return { error: 'Accès refusé : ce lead ne vous est pas assigné.' }
  }

  const { error } = await supabaseAdmin.from('lead_notes').insert({
    lead_id: leadId,
    author_id: profile.id,
    content,
  })

  if (error) return { error: error.message }

  await supabaseAdmin.from('lead_activities').insert({
    lead_id: leadId,
    user_id: profile.id,
    action: 'note_added',
    details: content.slice(0, 100),
  })

  revalidatePath(`/dashboard/leads/${leadId}`)
  return { success: true }
}

/**
 * Get notes for a lead.
 */
export async function getLeadNotes(leadId: string) {
  const { profile } = await requireAuth()

  const { data: lead } = await supabaseAdmin
    .from('leads')
    .select('id, agency_id, assigned_to')
    .eq('id', leadId)
    .single()

  if (!lead || lead.agency_id !== profile.agency_id) return []
  if (profile.role !== 'admin' && lead.assigned_to !== profile.id) return []

  const { data, error } = await supabaseAdmin
    .from('lead_notes')
    .select(`
      *,
      author:profiles!lead_notes_author_id_fkey(id, full_name, avatar_url)
    `)
    .eq('lead_id', leadId)
    .order('created_at', { ascending: false })

  if (error) return []
  return data ?? []
}

/**
 * Get activities for a lead.
 */
export async function getLeadActivities(leadId: string) {
  const { profile } = await requireAuth()

  const { data: lead } = await supabaseAdmin
    .from('leads')
    .select('id, agency_id, assigned_to')
    .eq('id', leadId)
    .single()

  if (!lead || lead.agency_id !== profile.agency_id) return []
  if (profile.role !== 'admin' && lead.assigned_to !== profile.id) return []

  const { data, error } = await supabaseAdmin
    .from('lead_activities')
    .select(`
      *,
      user:profiles!lead_activities_user_id_fkey(id, full_name)
    `)
    .eq('lead_id', leadId)
    .order('created_at', { ascending: false })

  if (error) return []
  return data ?? []
}
