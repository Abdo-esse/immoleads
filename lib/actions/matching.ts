'use server'

import { supabaseAdmin } from '@/lib/supabase/admin'
import { requireAuth } from '@/lib/actions/auth'
import { rankProperties, type MatchResult } from '@/lib/utils/matching'
import type { Lead, Property } from '@/types'

/**
 * Fetch properties that match a lead's criteria.
 * Returns ranked results with match scores.
 */
export async function getMatchingProperties(
  lead: Pick<Lead, 'id' | 'agency_id' | 'city' | 'budget_min' | 'budget_max' | 'property_type'>
): Promise<MatchResult[]> {
  const { profile } = await requireAuth()

  // Fetch all active properties for the agency
  const { data: properties, error } = await supabaseAdmin
    .from('properties')
    .select('*')
    .eq('agency_id', profile.agency_id)
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (error || !properties) return []

  // Run matching engine
  return rankProperties(
    {
      city: lead.city,
      budget_min: lead.budget_min,
      budget_max: lead.budget_max,
      property_type: lead.property_type,
    },
    properties as Property[],
    20,  // min score threshold
    8    // max results
  )
}
