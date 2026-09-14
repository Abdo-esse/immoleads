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
  sendEmailInvite?: boolean
}) {
  const { profile } = await requireAdmin()

  const email = values.email.trim().toLowerCase()
  const sendEmailInvite = values.sendEmailInvite ?? true

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

  let userId: string | null = null
  let temporaryPassword: string | null = null
  let invitedViaEmail = false

  const crypto = await import('crypto')

  // 1. If email invite requested, try inviteUserByEmail first
  if (sendEmailInvite) {
    const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
      email,
      {
        data: {
          full_name: values.full_name.trim(),
          agency_id: profile.agency_id,
          role: values.role,
        },
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback?next=/auth/set-password`,
      }
    )

    if (!inviteError && inviteData?.user) {
      userId = inviteData.user.id
      invitedViaEmail = true
    }
  }

  // 2. Fallback: if email invite not requested or failed (SMTP not set up yet), create directly with password
  if (!userId) {
    temporaryPassword = 'Immo!' + crypto.randomBytes(6).toString('hex')

    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: temporaryPassword,
      email_confirm: true,
      user_metadata: {
        full_name: values.full_name.trim(),
        agency_id: profile.agency_id,
        role: values.role,
      },
    })

    if (authUser?.user) {
      userId = authUser.user.id
    } else {
      // If user already exists in auth.users, find their ID
      const { data: listData } = await supabaseAdmin.auth.admin.listUsers()
      const existingAuthUser = listData?.users?.find(
        (u: any) => u.email?.toLowerCase() === email
      )

      if (existingAuthUser) {
        userId = existingAuthUser.id
      } else {
        const isDbError = authError?.message?.includes('Database error')

        const errorMessage = isDbError
          ? "Erreur de déclencheur Supabase : Veuillez exécuter la migration 016 dans votre Supabase SQL Editor."
          : authError?.message || 'Erreur lors de la création du compte.'

        return { error: errorMessage }
      }
    }
  }

  // Upsert profile in CRM database
  const { error: profileError } = await supabaseAdmin.from('profiles').upsert({
    id: userId,
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
  return {
    success: true,
    invitedViaEmail,
    temporaryPassword: invitedViaEmail ? null : temporaryPassword,
  }
}
