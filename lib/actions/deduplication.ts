'use server'

import { createClient } from '@/lib/supabase/server'

export interface DuplicateGroup {
  matchType: 'phone' | 'email' | 'name_city'
  confidence: 'high' | 'medium'
  leads: {
    id: string
    name: string
    phone: string
    email: string | null
    city: string | null
    status: string
    source: string | null
    created_at: string
    note_count: number
  }[]
}

/**
 * Find potential duplicate leads for an agency.
 */
export async function findDuplicates(): Promise<DuplicateGroup[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data: profile } = await supabase
    .from('profiles')
    .select('agency_id')
    .eq('id', user.id)
    .single()

  if (!profile?.agency_id) return []

  // Get all leads for this agency
  const { data: leads } = await supabase
    .from('leads')
    .select('id, name, phone, email, city, status, source, created_at')
    .eq('agency_id', profile.agency_id)
    .order('created_at', { ascending: true })

  if (!leads || leads.length < 2) return []

  const groups: DuplicateGroup[] = []

  // 1. Phone duplicates (exact match after normalization)
  const phoneMap = new Map<string, typeof leads>()
  for (const lead of leads) {
    const normalized = lead.phone.replace(/[\s\-\+\(\)]/g, '').slice(-9)
    if (!normalized) continue
    const group = phoneMap.get(normalized) || []
    group.push(lead)
    phoneMap.set(normalized, group)
  }
  for (const [, group] of phoneMap) {
    if (group.length > 1) {
      groups.push({
        matchType: 'phone',
        confidence: 'high',
        leads: group.map((l) => ({ ...l, note_count: 0 })),
      })
    }
  }

  // 2. Email duplicates (exact match, non-null)
  const emailMap = new Map<string, typeof leads>()
  for (const lead of leads) {
    if (!lead.email) continue
    const normalized = lead.email.toLowerCase().trim()
    const group = emailMap.get(normalized) || []
    group.push(lead)
    emailMap.set(normalized, group)
  }
  for (const [, group] of emailMap) {
    if (group.length > 1) {
      // Check if already found by phone
      const ids = group.map((l) => l.id).sort().join(',')
      const alreadyFound = groups.some(
        (g) => g.leads.map((l) => l.id).sort().join(',') === ids
      )
      if (!alreadyFound) {
        groups.push({
          matchType: 'email',
          confidence: 'high',
          leads: group.map((l) => ({ ...l, note_count: 0 })),
        })
      }
    }
  }

  // 3. Name + City (case-insensitive)
  const nameCityMap = new Map<string, typeof leads>()
  for (const lead of leads) {
    if (!lead.city) continue
    const key = `${lead.name.toLowerCase().trim()}|${lead.city.toLowerCase().trim()}`
    const group = nameCityMap.get(key) || []
    group.push(lead)
    nameCityMap.set(key, group)
  }
  for (const [, group] of nameCityMap) {
    if (group.length > 1) {
      const ids = group.map((l) => l.id).sort().join(',')
      const alreadyFound = groups.some(
        (g) => g.leads.map((l) => l.id).sort().join(',') === ids
      )
      if (!alreadyFound) {
        groups.push({
          matchType: 'name_city',
          confidence: 'medium',
          leads: group.map((l) => ({ ...l, note_count: 0 })),
        })
      }
    }
  }

  return groups
}

/**
 * Merge two leads: keep the older one, migrate notes/activities/visits, delete the newer one.
 */
export async function mergeLeads(keepId: string, deleteId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non authentifié' }

  // Migrate notes
  await supabase
    .from('lead_notes')
    .update({ lead_id: keepId })
    .eq('lead_id', deleteId)

  // Migrate activities
  await supabase
    .from('lead_activities')
    .update({ lead_id: keepId })
    .eq('lead_id', deleteId)

  // Migrate visits
  await supabase
    .from('visits')
    .update({ lead_id: keepId })
    .eq('lead_id', deleteId)

  // Migrate WhatsApp messages if table exists
  await supabase
    .from('whatsapp_messages')
    .update({ lead_id: keepId })
    .eq('lead_id', deleteId)

  // Delete duplicate
  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', deleteId)

  if (error) return { error: error.message }

  // Log merge activity
  await supabase.from('lead_activities').insert({
    lead_id: keepId,
    user_id: user.id,
    action: 'lead_merged',
    details: `Fusionné avec un doublon (supprimé: ${deleteId})`,
  })

  return { success: true }
}
