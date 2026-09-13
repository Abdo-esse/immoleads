'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { requireAuth, requireAdmin } from '@/lib/actions/auth'
import type { Profile, Agency } from '@/types'

export interface SettingsData {
  profile: Profile
  agency: Agency | null
  team: Profile[]
  isAdmin: boolean
}

/**
 * Fetch settings data: current user profile, agency details, and team members.
 */
export async function getSettingsData(): Promise<SettingsData> {
  const { profile } = await requireAuth()

  // Fetch agency details
  const { data: agency } = await supabaseAdmin
    .from('agencies')
    .select('*')
    .eq('id', profile.agency_id)
    .single()

  // Fetch all team members in this agency
  const { data: team } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('agency_id', profile.agency_id)
    .order('created_at', { ascending: true })

  return {
    profile,
    agency: agency as Agency | null,
    team: (team as Profile[]) ?? [],
    isAdmin: profile.role === 'admin',
  }
}

/**
 * Update the current authenticated user's profile.
 */
export async function updateProfile(values: {
  full_name: string
  phone?: string
}) {
  const { profile } = await requireAuth()

  const { error } = await supabaseAdmin
    .from('profiles')
    .update({
      full_name: values.full_name.trim(),
      phone: values.phone?.trim() || null,
    })
    .eq('id', profile.id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/settings')
  return { success: true }
}

/**
 * Update agency information (admin only).
 */
export async function updateAgencyInfo(values: {
  name: string
  city?: string
  phone?: string
  whatsapp_number?: string
  email?: string
}) {
  const { profile } = await requireAdmin()

  const { error } = await supabaseAdmin
    .from('agencies')
    .update({
      name: values.name.trim(),
      city: values.city?.trim() || null,
      phone: values.phone?.trim() || null,
      whatsapp_number: values.whatsapp_number?.trim() || null,
      email: values.email?.trim() || null,
    })
    .eq('id', profile.agency_id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/settings')
  return { success: true }
}

/**
 * Update an agent's role (admin only).
 */
export async function updateAgentRole(agentId: string, newRole: 'admin' | 'agent') {
  const { profile } = await requireAdmin()

  // Prevent demoting oneself if the only admin
  if (agentId === profile.id && newRole !== 'admin') {
    return { error: 'Vous ne pouvez pas retirer vos propres droits administrateur.' }
  }

  const { error } = await supabaseAdmin
    .from('profiles')
    .update({ role: newRole })
    .eq('id', agentId)
    .eq('agency_id', profile.agency_id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/settings')
  return { success: true }
}

/**
 * Add / Invite a new agent to the agency (admin only).
 */
export async function addTeamMember(values: {
  full_name: string
  email: string
  phone?: string
  role: 'admin' | 'agent'
}) {
  const { profile } = await requireAdmin()

  const email = values.email.trim().toLowerCase()

  // Check if profile with email already exists
  const { data: existing } = await supabaseAdmin
    .from('profiles')
    .select('id, agency_id')
    .eq('email', email)
    .maybeSingle()

  if (existing) {
    if (existing.agency_id === profile.agency_id) {
      return { error: 'Un membre avec cet email fait déjà partie de votre agence.' }
    }
    return { error: 'Cet email est déjà associé à un compte utilisateur existant.' }
  }

  // Create auth user via admin client
  const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password: 'Demo@' + Math.floor(100000 + Math.random() * 900000),
    email_confirm: true,
    user_metadata: {
      full_name: values.full_name.trim(),
      agency_id: profile.agency_id,
    },
  })

  if (authError || !authUser?.user) {
    return { error: authError?.message || 'Erreur lors de la création du compte.' }
  }

  // Upsert profile
  const { error: profileError } = await supabaseAdmin.from('profiles').upsert({
    id: authUser.user.id,
    agency_id: profile.agency_id,
    full_name: values.full_name.trim(),
    email,
    phone: values.phone?.trim() || null,
    role: values.role,
    created_at: new Date().toISOString(),
  })

  if (profileError) {
    return { error: profileError.message }
  }

  revalidatePath('/dashboard/settings')
  return { success: true }
}
