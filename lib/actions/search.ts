'use server'

import { supabaseAdmin } from '@/lib/supabase/admin'
import { requireAuth } from '@/lib/actions/auth'

export interface SearchResult {
  type: 'lead' | 'property' | 'agent'
  id: string
  title: string
  subtitle: string
  href: string
  icon: string
}

/**
 * Global multi-entity search across leads, properties, and agents.
 */
export async function globalSearch(query: string): Promise<SearchResult[]> {
  const { profile } = await requireAuth()
  const agencyId = profile.agency_id

  if (!query || query.trim().length < 2) return []

  const q = query.trim()
  const ilike = `%${q}%`

  // Run all 3 searches in parallel
  const [leadsRes, propertiesRes, agentsRes] = await Promise.all([
    // Search Leads
    supabaseAdmin
      .from('leads')
      .select('id, name, phone, email, status, city')
      .eq('agency_id', agencyId)
      .or(`name.ilike.${ilike},phone.ilike.${ilike},email.ilike.${ilike},city.ilike.${ilike}`)
      .limit(5),

    // Search Properties
    supabaseAdmin
      .from('properties')
      .select('id, title, slug, city, quartier, price')
      .eq('agency_id', agencyId)
      .or(`title.ilike.${ilike},city.ilike.${ilike},quartier.ilike.${ilike}`)
      .limit(5),

    // Search Agents
    supabaseAdmin
      .from('profiles')
      .select('id, full_name, phone, role')
      .eq('agency_id', agencyId)
      .ilike('full_name', ilike)
      .limit(3),
  ])

  const results: SearchResult[] = []

  // Leads
  for (const lead of (leadsRes.data || []) as any[]) {
    results.push({
      type: 'lead',
      id: lead.id,
      title: lead.name,
      subtitle: [lead.phone, lead.city, lead.status].filter(Boolean).join(' · '),
      href: `/dashboard/leads/${lead.id}`,
      icon: '👤',
    })
  }

  // Properties
  for (const prop of (propertiesRes.data || []) as any[]) {
    const priceStr = prop.price
      ? new Intl.NumberFormat('fr-MA').format(prop.price) + ' MAD'
      : ''
    results.push({
      type: 'property',
      id: prop.id,
      title: prop.title,
      subtitle: [prop.city, prop.quartier, priceStr].filter(Boolean).join(' · '),
      href: `/dashboard/properties/${prop.slug || prop.id}`,
      icon: '🏠',
    })
  }

  // Agents
  for (const agent of (agentsRes.data || []) as any[]) {
    results.push({
      type: 'agent',
      id: agent.id,
      title: agent.full_name,
      subtitle: agent.role === 'admin' ? 'Administrateur' : 'Agent',
      href: `/dashboard/settings`,
      icon: '🧑‍💼',
    })
  }

  return results
}
