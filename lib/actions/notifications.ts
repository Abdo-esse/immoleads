'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { requireAuth } from '@/lib/actions/auth'

export type NotificationType = 'lead_created' | 'lead_assigned' | 'visit_scheduled' | 'system'

export interface NotificationItem {
  id: string
  agency_id: string
  user_id: string | null
  title: string
  message: string
  type: NotificationType
  link: string | null
  is_read: boolean
  created_at: string
}

/**
 * Fetch recent notifications and unread count for current user / agency.
 */
export async function getNotifications(): Promise<{
  notifications: NotificationItem[]
  unreadCount: number
}> {
  const { profile } = await requireAuth()

  // 1. Try notifications table first
  try {
    const { data, error } = await supabaseAdmin
      .from('notifications')
      .select('*')
      .eq('agency_id', profile.agency_id)
      .eq('is_read', false)
      .or(`user_id.eq.${profile.id},user_id.is.null`)
      .order('created_at', { ascending: false })
      .limit(20)

    if (!error && data) {
      const notifications = data as NotificationItem[]
      return { notifications, unreadCount: notifications.length }
    }
  } catch (err) {
    // notifications table might not exist yet
  }

  // 2. Fallback: synthesize from lead_activities
  try {
    const { data: activities, error: actError } = await supabaseAdmin
      .from('lead_activities')
      .select(`
        id,
        action,
        details,
        created_at,
        lead_id,
        leads!inner(id, name, phone, agency_id)
      `)
      .eq('leads.agency_id', profile.agency_id)
      .order('created_at', { ascending: false })
      .limit(15)

    if (!actError && activities && activities.length > 0) {
      const notifications: NotificationItem[] = activities.map((act: any) => {
        let title = 'Activité prospect'
        let type: NotificationType = 'system'
        if (act.action === 'lead_created') {
          title = 'Nouveau lead reçu'
          type = 'lead_created'
        } else if (act.action === 'visit_scheduled') {
          title = 'Visite programmée'
          type = 'visit_scheduled'
        }

        const leadName = act.leads?.name || 'Prospect'
        const leadPhone = act.leads?.phone ? ` (${act.leads.phone})` : ''

        return {
          id: act.id,
          agency_id: profile.agency_id,
          user_id: null,
          title,
          message: `${leadName}${leadPhone} — ${act.details || ''}`,
          type,
          link: `/dashboard/leads/${act.lead_id}`,
          is_read: false,
          created_at: act.created_at,
        }
      })

      return {
        notifications,
        unreadCount: notifications.length,
      }
    }
  } catch (err) {
    // lead_activities query fallback
  }

  // 3. Fallback: synthesize directly from recent leads
  try {
    const { data: recentLeads } = await supabaseAdmin
      .from('leads')
      .select('id, name, phone, created_at, source')
      .eq('agency_id', profile.agency_id)
      .order('created_at', { ascending: false })
      .limit(10)

    if (recentLeads && recentLeads.length > 0) {
      const notifications: NotificationItem[] = recentLeads.map((l: any) => ({
        id: `lead-notif-${l.id}`,
        agency_id: profile.agency_id,
        user_id: null,
        title: 'Nouveau lead reçu',
        message: `${l.name} (${l.phone}) — Source: ${l.source || 'Site web'}`,
        type: 'lead_created' as NotificationType,
        link: `/dashboard/leads/${l.id}`,
        is_read: false,
        created_at: l.created_at,
      }))
      return { notifications, unreadCount: notifications.length }
    }
  } catch (err) {
    // Silent
  }

  return { notifications: [], unreadCount: 0 }
}

/**
 * Mark a single notification as read.
 */
export async function markNotificationAsRead(id: string) {
  try {
    const { profile } = await requireAuth()
    await supabaseAdmin
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
      .eq('agency_id', profile.agency_id)
  } catch (err) {
    // Ignore if table not present
  }

  revalidatePath('/dashboard')
  return { success: true }
}

/**
 * Mark all notifications as read for current user / agency.
 */
export async function markAllNotificationsAsRead() {
  try {
    const { profile } = await requireAuth()
    await supabaseAdmin
      .from('notifications')
      .update({ is_read: true })
      .eq('agency_id', profile.agency_id)
      .or(`user_id.eq.${profile.id},user_id.is.null`)
      .eq('is_read', false)
  } catch (err) {
    // Ignore if table not present
  }

  revalidatePath('/dashboard')
  return { success: true }
}

/**
 * Helper to create a notification in DB.
 * Called from server actions (new lead, new visit, assignment, webhook).
 */
export async function createNotification(params: {
  agencyId: string
  userId?: string | null
  title: string
  message: string
  type: NotificationType
  link?: string | null
}) {
  try {
    const { data, error } = await supabaseAdmin
      .from('notifications')
      .insert({
        agency_id: params.agencyId,
        user_id: params.userId || null,
        title: params.title,
        message: params.message,
        type: params.type,
        link: params.link || null,
        is_read: false,
        created_at: new Date().toISOString(),
      })
      .select('id')
      .single()

    if (error) {
      console.warn('[createNotification] Failed to insert notification:', error.message)
      return null
    }

    return data?.id ?? null
  } catch (err: any) {
    console.warn('[createNotification] Exception:', err.message)
    return null
  }
}
