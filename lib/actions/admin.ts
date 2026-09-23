'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { requireSuperAdmin } from '@/lib/actions/auth'
import { getAppBaseUrl } from '@/lib/utils'
import type { Agency, Profile, DemoRequest } from '@/types'

export interface SuperAdminStats {
  totalAgencies: number
  totalUsers: number
  totalLeads: number
  pendingDemos: number
  recentDemos: DemoRequest[]
  recentAgencies: AgencyWithCounts[]
}

export interface AgencyWithCounts extends Agency {
  userCount: number
  leadCount: number
  adminUser?: {
    id: string
    full_name: string
    email: string
  } | null
}

export interface GlobalUserWithAgency extends Profile {
  agency?: {
    id: string
    name: string
    city: string | null
  } | null
}

/**
 * Fetch platform-wide KPI metrics and recent activity for the Super Admin overview.
 */
export async function getSuperAdminStats(): Promise<SuperAdminStats> {
  await requireSuperAdmin()

  // 1. Total agencies count
  const { count: totalAgencies } = await supabaseAdmin
    .from('agencies')
    .select('*', { count: 'exact', head: true })

  // 2. Total users count
  const { count: totalUsers } = await supabaseAdmin
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  // 3. Total leads count
  const { count: totalLeads } = await supabaseAdmin
    .from('leads')
    .select('*', { count: 'exact', head: true })

  // 4. Pending demo requests count
  const { count: pendingDemos } = await supabaseAdmin
    .from('demo_requests')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'NEW')

  // 5. Recent demo requests (5 latest)
  const { data: recentDemos } = await supabaseAdmin
    .from('demo_requests')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  // 6. Recent agencies (5 latest) with counts
  const allAgencies = await getAllAgencies()
  const recentAgencies = allAgencies.slice(0, 5)

  return {
    totalAgencies: totalAgencies || 0,
    totalUsers: totalUsers || 0,
    totalLeads: totalLeads || 0,
    pendingDemos: pendingDemos || 0,
    recentDemos: (recentDemos as DemoRequest[]) || [],
    recentAgencies,
  }
}

/**
 * Fetch all agencies with calculated user and lead totals.
 */
export async function getAllAgencies(): Promise<AgencyWithCounts[]> {
  await requireSuperAdmin()

  const { data: agencies, error: agenciesError } = await supabaseAdmin
    .from('agencies')
    .select('*')
    .order('created_at', { ascending: false })

  if (agenciesError || !agencies) {
    console.error('[getAllAgencies] Error:', agenciesError)
    return []
  }

  // Fetch all profiles and leads to aggregate counts efficiently
  const { data: profiles } = await supabaseAdmin
    .from('profiles')
    .select('id, agency_id, full_name, email, role')

  const { data: leads } = await supabaseAdmin
    .from('leads')
    .select('id, agency_id')

  const userCountsByAgency = new Map<string, number>()
  const leadCountsByAgency = new Map<string, number>()
  const adminByAgency = new Map<string, { id: string; full_name: string; email: string }>()

  profiles?.forEach((p) => {
    if (p.agency_id) {
      userCountsByAgency.set(p.agency_id, (userCountsByAgency.get(p.agency_id) || 0) + 1)
      if (p.role === 'admin' && !adminByAgency.has(p.agency_id)) {
        adminByAgency.set(p.agency_id, {
          id: p.id,
          full_name: p.full_name,
          email: p.email,
        })
      }
    }
  })

  leads?.forEach((l) => {
    if (l.agency_id) {
      leadCountsByAgency.set(l.agency_id, (leadCountsByAgency.get(l.agency_id) || 0) + 1)
    }
  })

  return agencies.map((agency) => ({
    ...agency,
    userCount: userCountsByAgency.get(agency.id) || 0,
    leadCount: leadCountsByAgency.get(agency.id) || 0,
    adminUser: adminByAgency.get(agency.id) || null,
  }))
}

export type CreateAgencyResult =
  | {
      success: true
      agency: any
      adminResult: {
        invitedViaEmail?: boolean
        temporaryPassword?: string | null
        error?: string
      } | null
      error?: undefined
    }
  | {
      success: false
      error: string
      agency?: undefined
      adminResult?: undefined
    }

/**
 * Create a new agency and optionally configure its primary administrator.
 */
export async function createAgencyWithAdmin(
  agencyData: {
    name: string
    city?: string
    phone?: string
    email?: string
    whatsapp_number?: string
  },
  adminData?: {
    fullName: string
    email: string
    password?: string
    sendEmailInvite?: boolean
  }
): Promise<CreateAgencyResult> {
  await requireSuperAdmin()

  const name = agencyData.name.trim()
  if (!name) {
    return { success: false, error: "Le nom de l'agence est obligatoire." }
  }

  // 1. Create agency row
  const { data: agency, error: agencyError } = await supabaseAdmin
    .from('agencies')
    .insert({
      name,
      city: agencyData.city?.trim() || null,
      phone: agencyData.phone?.trim() || null,
      email: agencyData.email?.trim() || null,
      whatsapp_number: agencyData.whatsapp_number?.trim() || agencyData.phone?.trim() || null,
    })
    .select('*')
    .single()

  if (agencyError || !agency) {
    console.error('[createAgencyWithAdmin] Agency creation failed:', agencyError)
    return { success: false, error: agencyError?.message || "Erreur lors de la création de l'agence." }
  }

  let adminCreationResult: {
    invitedViaEmail?: boolean
    temporaryPassword?: string | null
    error?: string
  } | null = null

  // 2. If initial admin data provided, create/invite admin
  if (adminData && adminData.email && adminData.fullName) {
    const adminEmail = adminData.email.trim().toLowerCase()
    const adminName = adminData.fullName.trim()
    const sendInvite = adminData.sendEmailInvite ?? true

    let userId: string | null = null
    let temporaryPassword: string | null = null
    let invitedViaEmail = false

    const crypto = await import('crypto')

    // Option B preferred: direct email invitation if sendInvite is true
    if (sendInvite) {
      const baseUrl = await getAppBaseUrl()
      const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
        adminEmail,
        {
          data: {
            full_name: adminName,
            agency_id: agency.id,
            role: 'admin',
          },
          redirectTo: `${baseUrl}/auth/callback?next=/auth/set-password`,
        }
      )

      if (!inviteError && inviteData?.user) {
        userId = inviteData.user.id
        invitedViaEmail = true
      }
    }

    // Fallback: If not invited via email, create user with password
    if (!userId) {
      temporaryPassword = adminData.password || 'Immo!' + crypto.randomBytes(6).toString('hex')

      const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: adminEmail,
        password: temporaryPassword,
        email_confirm: true,
        user_metadata: {
          full_name: adminName,
          agency_id: agency.id,
          role: 'admin',
        },
      })

      if (authUser?.user) {
        userId = authUser.user.id
      } else {
        const { data: listData } = await supabaseAdmin.auth.admin.listUsers()
        const existingAuthUser = listData?.users?.find(
          (u: any) => u.email?.toLowerCase() === adminEmail
        )
        if (existingAuthUser) {
          userId = existingAuthUser.id
        }
      }
    }

    if (userId) {
      // Upsert profile in CRM profiles table
      await supabaseAdmin.from('profiles').upsert({
        id: userId,
        agency_id: agency.id,
        full_name: adminName,
        email: adminEmail,
        role: 'admin',
        created_at: new Date().toISOString(),
      })

      adminCreationResult = {
        invitedViaEmail,
        temporaryPassword: invitedViaEmail ? null : temporaryPassword,
      }
    }
  }

  revalidatePath('/admin/agencies')
  revalidatePath('/admin/users')
  revalidatePath('/admin')

  return {
    success: true,
    agency,
    adminResult: adminCreationResult,
  }
}

/**
 * Update agency information.
 */
export async function updateAgency(
  agencyId: string,
  values: {
    name: string
    city?: string | null
    phone?: string | null
    email?: string | null
    whatsapp_number?: string | null
  }
) {
  await requireSuperAdmin()

  const { error } = await supabaseAdmin
    .from('agencies')
    .update({
      name: values.name.trim(),
      city: values.city?.trim() || null,
      phone: values.phone?.trim() || null,
      email: values.email?.trim() || null,
      whatsapp_number: values.whatsapp_number?.trim() || null,
    })
    .eq('id', agencyId)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/agencies')
  revalidatePath('/admin')
  return { success: true }
}

/**
 * Delete an agency and optionally cascade delete related records.
 */
export async function deleteAgency(agencyId: string) {
  await requireSuperAdmin()

  const { error } = await supabaseAdmin
    .from('agencies')
    .delete()
    .eq('id', agencyId)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/agencies')
  revalidatePath('/admin/users')
  revalidatePath('/admin')
  return { success: true }
}

/**
 * Fetch all users across all agencies with their agency details.
 */
export async function getAllUsers(agencyFilterId?: string): Promise<GlobalUserWithAgency[]> {
  await requireSuperAdmin()

  let query = supabaseAdmin
    .from('profiles')
    .select('*, agencies(id, name, city)')
    .order('created_at', { ascending: false })

  if (agencyFilterId && agencyFilterId !== 'all') {
    query = query.eq('agency_id', agencyFilterId)
  }

  const { data, error } = await query

  if (error || !data) {
    console.error('[getAllUsers] Error:', error)
    return []
  }

  return data.map((profile: any) => ({
    ...profile,
    agency: profile.agencies || null,
  }))
}

/**
 * Create a new user (admin or agent) assigned to a chosen agency.
 */
export async function createUserForAgency(
  agencyId: string,
  userData: {
    fullName: string
    email: string
    phone?: string
    role: 'admin' | 'agent'
    password?: string
    sendEmailInvite?: boolean
  }
) {
  await requireSuperAdmin()

  const email = userData.email.trim().toLowerCase()
  const fullName = userData.fullName.trim()
  const sendInvite = userData.sendEmailInvite ?? true

  let userId: string | null = null
  let temporaryPassword: string | null = null
  let invitedViaEmail = false

  const crypto = await import('crypto')

  // 1. Try email invite if requested
  if (sendInvite) {
    const baseUrl = await getAppBaseUrl()
    const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
      email,
      {
        data: {
          full_name: fullName,
          agency_id: agencyId,
          role: userData.role,
        },
        redirectTo: `${baseUrl}/auth/callback?next=/auth/set-password`,
      }
    )

    if (!inviteError && inviteData?.user) {
      userId = inviteData.user.id
      invitedViaEmail = true
    }
  }

  // 2. Fallback: Create direct user with password
  if (!userId) {
    temporaryPassword = userData.password || 'Immo!' + crypto.randomBytes(6).toString('hex')

    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: temporaryPassword,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        agency_id: agencyId,
        role: userData.role,
      },
    })

    if (authUser?.user) {
      userId = authUser.user.id
    } else {
      const { data: listData } = await supabaseAdmin.auth.admin.listUsers()
      const existingAuthUser = listData?.users?.find(
        (u: any) => u.email?.toLowerCase() === email
      )
      if (existingAuthUser) {
        userId = existingAuthUser.id
      } else {
        return { success: false, error: authError?.message || 'Erreur lors de la création du compte.' }
      }
    }
  }

  // 3. Upsert profile in CRM database
  const { error: profileError } = await supabaseAdmin.from('profiles').upsert({
    id: userId,
    agency_id: agencyId,
    full_name: fullName,
    email,
    phone: userData.phone?.trim() || null,
    role: userData.role,
    created_at: new Date().toISOString(),
  })

  if (profileError) {
    return { success: false, error: profileError.message }
  }

  revalidatePath('/admin/users')
  revalidatePath('/admin/agencies')
  revalidatePath('/admin')

  return {
    success: true,
    invitedViaEmail,
    temporaryPassword: invitedViaEmail ? null : temporaryPassword,
  }
}

/**
 * Update an existing user's role, name, phone, or agency assignment.
 */
export async function updateUserProfile(
  userId: string,
  data: {
    fullName?: string
    phone?: string | null
    role?: 'superadmin' | 'admin' | 'agent'
    agencyId?: string | null
  }
) {
  await requireSuperAdmin()

  const updateFields: Record<string, any> = {}
  if (data.fullName !== undefined) updateFields.full_name = data.fullName.trim()
  if (data.phone !== undefined) updateFields.phone = data.phone?.trim() || null
  if (data.role !== undefined) updateFields.role = data.role
  if (data.agencyId !== undefined) updateFields.agency_id = data.agencyId

  const { error } = await supabaseAdmin
    .from('profiles')
    .update(updateFields)
    .eq('id', userId)

  if (error) {
    return { success: false, error: error.message }
  }

  // Also sync role in auth user_metadata if role changed
  if (data.role || data.fullName) {
    await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: {
        ...(data.role ? { role: data.role } : {}),
        ...(data.fullName ? { full_name: data.fullName } : {}),
      },
    })
  }

  revalidatePath('/admin/users')
  revalidatePath('/admin')
  return { success: true }
}

/**
 * Delete a user from the platform (removes from both auth and profiles).
 */
export async function deleteUser(userId: string) {
  await requireSuperAdmin()

  // 1. Delete from auth.users (cascades or cleans up auth)
  const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId)

  // 2. Ensure profile is removed if not cascaded
  await supabaseAdmin.from('profiles').delete().eq('id', userId)

  if (authError) {
    return { success: false, error: authError.message }
  }

  revalidatePath('/admin/users')
  revalidatePath('/admin/agencies')
  revalidatePath('/admin')
  return { success: true }
}

/**
 * Convert a demo request directly into a newly created agency and administrator.
 * Automatically links the created agency_id and sets status to 'CONVERTED'.
 */
export async function convertDemoRequestToAgency(
  requestId: string,
  agencyData: {
    name: string
    city?: string
    phone?: string
    email?: string
  },
  adminData: {
    fullName: string
    email: string
    sendEmailInvite?: boolean
  }
) {
  await requireSuperAdmin()

  // 1. Create agency with admin
  const result = await createAgencyWithAdmin(agencyData, adminData)

  if (!result.success || !result.agency) {
    return result
  }

  // 2. Mark demo request as CONVERTED and link agency_id
  await supabaseAdmin
    .from('demo_requests')
    .update({
      status: 'CONVERTED',
      agency_id: result.agency.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', requestId)

  revalidatePath('/admin/demo-requests')
  revalidatePath('/admin/agencies')
  revalidatePath('/admin')

  return {
    success: true,
    agency: result.agency,
    adminResult: result.adminResult,
  }
}
