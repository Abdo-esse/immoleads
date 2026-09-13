'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { propertySchema, type PropertyFormValues } from '@/lib/validators/property'
import { generateSlug } from '@/lib/utils'
import { requireAuth, requireAdmin } from '@/lib/actions/auth'
import type { Property } from '@/types'

/**
 * Get all properties for the current user's agency.
 */
export async function getProperties(): Promise<Property[]> {
  const { profile } = await requireAuth()

  const { data, error } = await supabaseAdmin
    .from('properties')
    .select('*')
    .eq('agency_id', profile.agency_id)
    .order('created_at', { ascending: false })

  if (error) return []
  return data ?? []
}

/**
 * Get a property by slug (public — reads active properties only via RLS).
 */
export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  const supabase = supabaseAdmin

  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'active')
    .single()

  if (error) return null
  return data
}

/**
 * Get a property by ID (dashboard — agency-scoped via RLS).
 */
export async function getPropertyById(id: string): Promise<Property | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

/**
 * Get all active properties (public listing).
 */
export async function getActiveProperties(filters?: {
  city?: string
  type?: string
  transaction_type?: string
  min_price?: number
  max_price?: number
}): Promise<Property[]> {
  const supabase = supabaseAdmin

  let query = supabase
    .from('properties')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (filters?.city) {
    query = query.eq('city', filters.city)
  }
  if (filters?.type) {
    query = query.eq('type', filters.type)
  }
  if (filters?.transaction_type) {
    query = query.eq('transaction_type', filters.transaction_type)
  }
  if (filters?.min_price) {
    query = query.gte('price', filters.min_price)
  }
  if (filters?.max_price) {
    query = query.lte('price', filters.max_price)
  }

  const { data, error } = await query

  if (error) throw new Error(error.message)
  return data ?? []
}

/**
 * Create a new property.
 */
export async function createProperty(values: PropertyFormValues) {
  const { profile } = await requireAuth()
  const parsed = propertySchema.safeParse(values)

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  const supabase = await createClient()
  const slug = generateSlug(parsed.data.title)

  const insertData = {
    ...parsed.data,
    slug,
    agency_id: profile.agency_id,
  }

  const { data, error } = await (supabase
    .from('properties') as any)
    .insert(insertData)
    .select()
    .single()

  if (error) {
    if (error.message.includes('duplicate')) {
      return { error: { slug: ['Ce titre existe déjà, veuillez en choisir un autre.'] } }
    }
    return { error: { _form: [error.message] } }
  }

  revalidatePath('/dashboard/properties')
  revalidatePath('/properties')
  return { data }
}

/**
 * Update an existing property.
 */
export async function updateProperty(id: string, values: PropertyFormValues) {
  await requireAuth()
  const parsed = propertySchema.safeParse(values)

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('properties')
    .update(parsed.data)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return { error: { _form: [error.message] } }
  }

  revalidatePath('/dashboard/properties')
  revalidatePath('/properties')
  revalidatePath(`/properties/${(data as any).slug}`)
  return { data }
}

/**
 * Delete a property.
 */
export async function deleteProperty(id: string) {
  await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/properties')
  revalidatePath('/properties')
  return { success: true }
}

/**
 * Get agents for property assignment dropdown.
 */
export async function getAgencyAgents() {
  const { profile } = await requireAuth()

  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('id, full_name, role')
    .eq('agency_id', profile.agency_id)

  if (error) return []
  return data ?? []
}
