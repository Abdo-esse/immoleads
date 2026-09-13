'use server'

import { supabaseAdmin } from '@/lib/supabase/admin'
import { requireAuth } from '@/lib/actions/auth'
import { nanoid } from 'nanoid'

const BUCKET = 'property-images'

/**
 * Upload a property image to Supabase Storage.
 * Accepts a base64-encoded file string (from client).
 */
export async function uploadPropertyImage(
  base64Data: string,
  fileName: string,
  propertyId: string
) {
  await requireAuth()

  // Decode base64 to buffer
  const base64 = base64Data.split(',')[1] || base64Data
  const buffer = Buffer.from(base64, 'base64')

  // Determine content type from data URL prefix
  const mimeMatch = base64Data.match(/^data:(.+?);/)
  const contentType = mimeMatch?.[1] || 'image/jpeg'

  // Generate unique file path
  const ext = fileName.split('.').pop() || 'jpg'
  const filePath = `${propertyId}/${nanoid(8)}.${ext}`

  const { data, error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(filePath, buffer, {
      contentType,
      upsert: false,
    })

  if (error) return { error: error.message }

  // Get public URL
  const { data: publicUrlData } = supabaseAdmin.storage
    .from(BUCKET)
    .getPublicUrl(filePath)

  return { url: publicUrlData.publicUrl }
}

/**
 * Delete a property image from Supabase Storage.
 */
export async function deletePropertyImage(url: string) {
  await requireAuth()

  // Extract the file path from the full URL
  // URL format: .../storage/v1/object/public/property-images/propertyId/filename.ext
  const bucketPath = url.split(`${BUCKET}/`)[1]
  if (!bucketPath) return { error: 'Invalid image URL' }

  const { error } = await supabaseAdmin.storage
    .from(BUCKET)
    .remove([bucketPath])

  if (error) return { error: error.message }
  return { success: true }
}
