'use server'

import { supabaseAdmin } from '@/lib/supabase/admin'
import { requireAuth } from '@/lib/actions/auth'
import { createNotification } from '@/lib/actions/notifications'

export interface FollowUpReminder {
  id: string
  name: string
  phone: string
  status: string
  reason: string
  urgency: 'critical' | 'high' | 'medium'
  minutesSince: number
  leadId: string
}

/**
 * Detect leads that need follow-up reminders.
 */
export async function getFollowUpReminders(): Promise<FollowUpReminder[]> {
  const { profile } = await requireAuth()
  const agencyId = profile.agency_id
  const now = new Date()

  // Fetch leads that may need attention
  const { data: leads } = await supabaseAdmin
    .from('leads')
    .select('id, name, phone, status, created_at, last_contacted_at, next_follow_up_at, assigned_to')
    .eq('agency_id', agencyId)
    .not('status', 'in', '("WON","LOST")')
    .order('created_at', { ascending: true })

  if (!leads) return []

  const reminders: FollowUpReminder[] = []

  for (const lead of leads as any[]) {
    const createdAt = new Date(lead.created_at)
    const minutesSinceCreation = (now.getTime() - createdAt.getTime()) / 60_000

    // 1. NEW lead > 30 min without contact → critical
    if (lead.status === 'NEW' && !lead.last_contacted_at && minutesSinceCreation > 30) {
      reminders.push({
        id: lead.id,
        name: lead.name,
        phone: lead.phone,
        status: lead.status,
        reason: `Nouveau lead sans contact depuis ${formatDuration(minutesSinceCreation)}`,
        urgency: minutesSinceCreation > 120 ? 'critical' : 'high',
        minutesSince: Math.round(minutesSinceCreation),
        leadId: lead.id,
      })
      continue
    }

    // 2. next_follow_up_at is past → high
    if (lead.next_follow_up_at) {
      const followUpAt = new Date(lead.next_follow_up_at)
      if (followUpAt < now) {
        const minutesOverdue = (now.getTime() - followUpAt.getTime()) / 60_000
        reminders.push({
          id: lead.id,
          name: lead.name,
          phone: lead.phone,
          status: lead.status,
          reason: `Relance prévue en retard de ${formatDuration(minutesOverdue)}`,
          urgency: minutesOverdue > 240 ? 'critical' : 'high',
          minutesSince: Math.round(minutesOverdue),
          leadId: lead.id,
        })
        continue
      }
    }

    // 3. QUALIFIED > 48h without a visit scheduled → medium
    if (lead.status === 'QUALIFIED') {
      const lastActivity = lead.last_contacted_at || lead.created_at
      const hoursSinceActivity = (now.getTime() - new Date(lastActivity).getTime()) / 3_600_000
      if (hoursSinceActivity > 48) {
        reminders.push({
          id: lead.id,
          name: lead.name,
          phone: lead.phone,
          status: lead.status,
          reason: `Qualifié depuis ${Math.round(hoursSinceActivity / 24)}j sans visite programmée`,
          urgency: 'medium',
          minutesSince: Math.round(hoursSinceActivity * 60),
          leadId: lead.id,
        })
      }
    }
  }

  // Sort by urgency then by minutesSince
  const urgencyOrder = { critical: 0, high: 1, medium: 2 }
  reminders.sort((a, b) => {
    const urgDiff = urgencyOrder[a.urgency] - urgencyOrder[b.urgency]
    if (urgDiff !== 0) return urgDiff
    return b.minutesSince - a.minutesSince
  })

  return reminders.slice(0, 10)
}

/**
 * Trigger auto-reminders: create notifications for overdue leads.
 * Designed to be called from a cron endpoint.
 */
export async function triggerFollowUpReminders(agencyId: string): Promise<{ sent: number }> {
  const now = new Date()

  // Get NEW leads > 30 min without contact
  const { data: urgentLeads } = await supabaseAdmin
    .from('leads')
    .select('id, name, assigned_to, created_at')
    .eq('agency_id', agencyId)
    .eq('status', 'NEW')
    .is('last_contacted_at', null)
    .lt('created_at', new Date(now.getTime() - 30 * 60_000).toISOString())
    .limit(20)

  let sent = 0

  for (const lead of (urgentLeads || []) as any[]) {
    if (!lead.assigned_to) continue

    await createNotification({
      userId: lead.assigned_to,
      agencyId: agencyId,
      type: 'system',
      title: `⏰ Relance urgente : ${lead.name}`,
      message: `Ce lead attend un premier contact depuis ${formatDuration(
        (now.getTime() - new Date(lead.created_at).getTime()) / 60_000
      )}. Contactez-le rapidement !`,
      link: `/dashboard/leads/${lead.id}`,
    })
    sent++
  }

  // Get overdue follow-ups
  const { data: overdueLeads } = await supabaseAdmin
    .from('leads')
    .select('id, name, assigned_to, next_follow_up_at')
    .eq('agency_id', agencyId)
    .not('status', 'in', '("WON","LOST")')
    .lt('next_follow_up_at', now.toISOString())
    .not('assigned_to', 'is', null)
    .limit(20)

  for (const lead of (overdueLeads || []) as any[]) {
    await createNotification({
      userId: lead.assigned_to,
      agencyId: agencyId,
      type: 'system',
      title: `📞 Rappel de relance : ${lead.name}`,
      message: `La relance prévue est en retard. Pensez à contacter ce lead.`,
      link: `/dashboard/leads/${lead.id}`,
    })
    sent++
  }

  return { sent }
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${Math.round(minutes)}min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  return `${days}j ${hours % 24}h`
}
