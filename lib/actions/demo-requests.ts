'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { requireSuperAdmin } from '@/lib/actions/auth'
import type { DemoRequest, DemoRequestStatus } from '@/types'

export interface DemoRequestPayload {
  fullName: string
  phone: string
  agencyName?: string
  city: string
  teamSize?: string
  sources?: string[]
  monthlyLeads?: string
  mainProblem?: string
}

/**
 * Public action called when a prospect submits the demo request form
 * on the ATLORYX ImmoLeads landing page.
 * Strictly saves the request in the database without forcing WhatsApp opening.
 */
export async function submitDemoRequest(payload: DemoRequestPayload) {
  try {
    const fullName = payload.fullName?.trim()
    const phone = payload.phone?.trim()
    const city = payload.city?.trim()

    if (!fullName) {
      return { success: false, error: 'Le nom complet est obligatoire.' }
    }
    if (!phone) {
      return { success: false, error: 'Le numéro de téléphone est obligatoire.' }
    }
    if (!city) {
      return { success: false, error: 'La ville est obligatoire.' }
    }

    const { data, error } = await supabaseAdmin
      .from('demo_requests')
      .insert({
        full_name: fullName,
        phone,
        agency_name: payload.agencyName?.trim() || null,
        city,
        team_size: payload.teamSize?.trim() || null,
        lead_sources: payload.sources && payload.sources.length > 0 ? payload.sources : null,
        monthly_leads: payload.monthlyLeads?.trim() || null,
        main_problem: payload.mainProblem?.trim() || null,
        status: 'NEW',
      })
      .select('id')
      .single()

    if (error) {
      console.error('[submitDemoRequest] Database error:', error)
      return { success: false, error: error.message }
    }

    // Revalidate SuperAdmin demo requests inbox
    revalidatePath('/admin/demo-requests')
    revalidatePath('/admin')

    return { success: true, id: data.id }
  } catch (err: any) {
    console.error('[submitDemoRequest] Unexpected error:', err)
    return { success: false, error: err?.message || 'Une erreur inattendue est survenue.' }
  }
}

/**
 * Super Admin: Fetch all demo requests, optionally filtered by status.
 */
export async function getDemoRequests(status?: DemoRequestStatus): Promise<DemoRequest[]> {
  await requireSuperAdmin()

  let query = supabaseAdmin
    .from('demo_requests')
    .select('*')
    .order('created_at', { ascending: false })

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) {
    console.error('[getDemoRequests] Error fetching requests:', error)
    return []
  }

  return (data as DemoRequest[]) ?? []
}

/**
 * Super Admin: Update a demo request's commercial status and notes.
 */
export async function updateDemoRequestStatus(
  id: string,
  status: DemoRequestStatus,
  notes?: string
) {
  await requireSuperAdmin()

  const updatePayload: Record<string, any> = {
    status,
    updated_at: new Date().toISOString(),
  }

  if (notes !== undefined) {
    updatePayload.notes = notes
  }

  const { error } = await supabaseAdmin
    .from('demo_requests')
    .update(updatePayload)
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/demo-requests')
  revalidatePath('/admin')
  return { success: true }
}

/**
 * Super Admin: Delete a demo request from the inbox.
 */
export async function deleteDemoRequest(id: string) {
  await requireSuperAdmin()

  const { error } = await supabaseAdmin
    .from('demo_requests')
    .delete()
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/demo-requests')
  revalidatePath('/admin')
  return { success: true }
}
