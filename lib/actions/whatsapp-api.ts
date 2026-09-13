'use server'

import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { requireAuth } from '@/lib/actions/auth'

interface WhatsAppConfig {
  phoneId: string
  accessToken: string
  businessId: string
}

interface SendResult {
  success: boolean
  error?: string
  messageId?: string
}

/**
 * Send a WhatsApp message via the WhatsApp Business Cloud API.
 * Falls back to returning a wa.me URL if API is not configured.
 */
export async function sendWhatsAppMessage(
  leadId: string,
  phone: string,
  message: string,
  template?: string
): Promise<SendResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Non authentifié' }

  // Get user profile for agency
  const { data: profile } = await supabase
    .from('profiles')
    .select('agency_id')
    .eq('id', user.id)
    .single()

  if (!profile?.agency_id) return { success: false, error: 'Agence introuvable' }

  // Get WhatsApp config
  const { data: agency } = await supabase
    .from('agencies')
    .select('wa_phone_id, wa_access_token, wa_business_id')
    .eq('id', profile.agency_id)
    .single()

  const config: WhatsAppConfig | null =
    agency?.wa_phone_id && agency?.wa_access_token
      ? {
          phoneId: agency.wa_phone_id,
          accessToken: agency.wa_access_token,
          businessId: agency.wa_business_id || '',
        }
      : null

  if (!config) {
    // No API configured — return fallback info
    return {
      success: false,
      error: 'FALLBACK',
    }
  }

  // Format phone number for WhatsApp API (must include country code, no +)
  let formattedPhone = phone.replace(/[\s\-\+\(\)]/g, '')
  if (formattedPhone.startsWith('0') && formattedPhone.length === 10) {
    formattedPhone = '212' + formattedPhone.substring(1)
  } else if (formattedPhone.startsWith('+')) {
    formattedPhone = formattedPhone.substring(1)
  }

  try {
    // Send via WhatsApp Business Cloud API
    const res = await fetch(
      `https://graph.facebook.com/v21.0/${config.phoneId}/messages`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.accessToken}`,
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: formattedPhone,
          type: 'text',
          text: { body: message },
        }),
      }
    )

    const data = await res.json()

    if (!res.ok) {
      console.error('WhatsApp API error:', data)
      return {
        success: false,
        error: data.error?.message || 'Erreur API WhatsApp',
      }
    }

    const waMessageId = data.messages?.[0]?.id || null

    // Save message to history
    await supabase.from('whatsapp_messages').insert({
      agency_id: profile.agency_id,
      lead_id: leadId,
      sender_id: user.id,
      phone: formattedPhone,
      message,
      template: template || null,
      status: 'sent',
      wa_message_id: waMessageId,
    })

    return { success: true, messageId: waMessageId }
  } catch (err) {
    console.error('WhatsApp send error:', err)
    return { success: false, error: 'Erreur de connexion au serveur WhatsApp' }
  }
}

/**
 * Get message history for a lead.
 */
export async function getWhatsAppMessages(leadId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('whatsapp_messages')
    .select('*, sender:profiles(full_name)')
    .eq('lead_id', leadId)
    .order('created_at', { ascending: true })
    .limit(50)

  return data || []
}

/**
 * Check if WhatsApp API is configured for the current agency.
 */
export async function isWhatsAppConfigured(): Promise<boolean> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data: profile } = await supabase
    .from('profiles')
    .select('agency_id')
    .eq('id', user.id)
    .single()

  if (!profile?.agency_id) return false

  const { data: agency } = await supabase
    .from('agencies')
    .select('wa_phone_id, wa_access_token')
    .eq('id', profile.agency_id)
    .single()

  return !!(agency?.wa_phone_id && agency?.wa_access_token)
}

/**
 * Save WhatsApp Business API configuration for the agency.
 */
export async function saveWhatsAppConfig({
  phoneId,
  accessToken,
  businessId,
}: {
  phoneId: string
  accessToken: string
  businessId: string
}) {
  const { profile } = await requireAuth()
  if (profile.role !== 'admin') {
    return { error: 'Action réservée aux administrateurs.' }
  }

  const { error } = await supabaseAdmin
    .from('agencies')
    .update({
      wa_phone_id: phoneId.trim() || null,
      wa_access_token: accessToken.trim() || null,
      wa_business_id: businessId.trim() || null,
    })
    .eq('id', profile.agency_id)

  if (error) return { error: error.message }
  return { success: true }
}

