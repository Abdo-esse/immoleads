'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { requireAuth } from '@/lib/actions/auth'

export interface ImportedLeadRow {
  name: string
  phone: string
  email?: string
  budget?: number
  source?: string
  status?: string
  notes?: string
}

export interface ImportResult {
  success: boolean
  importedCount: number
  failedCount: number
  errors: string[]
}

/**
 * Batch import leads from CSV data.
 */
export async function importLeadsBatch(rows: ImportedLeadRow[]): Promise<ImportResult> {
  const { profile } = await requireAuth()

  if (!rows || rows.length === 0) {
    return { success: false, importedCount: 0, failedCount: 0, errors: ['Le fichier CSV est vide.'] }
  }

  const validRows: any[] = []
  const errors: string[] = []

  rows.forEach((row, index) => {
    const lineNum = index + 1
    const name = row.name?.trim()
    const phone = row.phone?.trim()

    if (!name) {
      errors.push(`Ligne ${lineNum} : Le nom est obligatoire.`)
      return
    }
    if (!phone) {
      errors.push(`Ligne ${lineNum} : Le numéro de téléphone est obligatoire.`)
      return
    }

    validRows.push({
      agency_id: profile.agency_id,
      name,
      phone,
      email: row.email?.trim() || null,
      budget: typeof row.budget === 'number' && !isNaN(row.budget) ? row.budget : null,
      source: row.source?.trim() || 'import_csv',
      status: (row.status?.toUpperCase() as any) || 'NEW',
      notes: row.notes?.trim() || null,
      assigned_to: profile.role === 'agent' ? profile.id : null,
      created_at: new Date().toISOString(),
    })
  })

  if (validRows.length === 0) {
    return {
      success: false,
      importedCount: 0,
      failedCount: rows.length,
      errors,
    }
  }

  // Insert in batches of 50
  const BATCH_SIZE = 50
  let importedCount = 0

  for (let i = 0; i < validRows.length; i += BATCH_SIZE) {
    const batch = validRows.slice(i, i + BATCH_SIZE)
    const { data, error } = await supabaseAdmin
      .from('leads')
      .insert(batch)
      .select('id')

    if (error) {
      errors.push(`Erreur d'insertion du lot ${Math.floor(i / BATCH_SIZE) + 1} : ${error.message}`)
    } else if (data) {
      importedCount += data.length

      // Log activities for each imported lead
      const activities = data.map((item) => ({
        lead_id: item.id,
        action: 'lead_created',
        details: 'Lead importé via fichier CSV',
        performed_by: profile.id,
      }))

      await supabaseAdmin.from('lead_activities').insert(activities)
    }
  }

  revalidatePath('/dashboard/leads')
  revalidatePath('/dashboard')

  return {
    success: importedCount > 0,
    importedCount,
    failedCount: rows.length - importedCount,
    errors,
  }
}
