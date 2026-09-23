'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { X, Loader2, Upload, Trash2, ImagePlus } from 'lucide-react'
import { createProperty, updateProperty, getAgencyAgents } from '@/lib/actions/properties'
import { uploadPropertyImage, deletePropertyImage } from '@/lib/actions/storage'
import { PROPERTY_TYPES, CITIES } from '@/lib/constants'
import type { Property } from '@/types'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  property: Property | null
}

function compressImage(file: File, maxWidth = 1600, maxHeight = 1600, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.type === 'image/svg+xml' || file.size < 150 * 1024) {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
      return
    }

    const reader = new FileReader()
    reader.onerror = (err) => reject(err)
    reader.onload = (e) => {
      const img = new Image()
      img.onerror = (err) => reject(err)
      img.onload = () => {
        let { width, height } = img
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width)
            width = maxWidth
          } else {
            width = Math.round((width * maxHeight) / height)
            height = maxHeight
          }
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          return resolve(e.target?.result as string)
        }
        ctx.drawImage(img, 0, 0, width, height)
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality)
        resolve(compressedBase64)
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
  })
}

export function PropertyFormDialog({ open, onOpenChange, property }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [agents, setAgents] = useState<{ id: string; full_name: string; role: string }[]>([])
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [images, setImages] = useState<string[]>(property?.images ?? [])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isEditing = property !== null

  useEffect(() => {
    if (open) {
      getAgencyAgents().then(setAgents)
      setImages(property?.images ?? [])
    }
  }, [open, property])

  async function handleImageUpload(files: FileList | null) {
    if (!files || files.length === 0) return
    setUploading(true)

    const propertyId = property?.id || 'new-' + Date.now()

    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} n'est pas une image valide`)
          continue
        }
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`${file.name} dépasse la limite de 10 Mo`)
          continue
        }

        // Convert & compress image client-side to avoid payload issues and speed up upload
        let base64: string
        try {
          base64 = await compressImage(file)
        } catch {
          base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result as string)
            reader.readAsDataURL(file)
          })
        }

        const result = await uploadPropertyImage(base64, file.name, propertyId)
        if (result.error) {
          toast.error(`Échec du téléversement (${file.name}) : ${result.error}`)
        } else if (result.url) {
          setImages(prev => [...prev, result.url!])
          toast.success(`${file.name} téléversé avec succès`)
        }
      }
    } catch (error: any) {
      console.error('Upload error:', error)
      toast.error('Une erreur est survenue lors du téléversement')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  async function handleImageDelete(url: string) {
    const result = await deletePropertyImage(url)
    if (result.error) {
      toast.error(result.error)
    } else {
      setImages(prev => prev.filter(img => img !== url))
      toast.success('Image removed')
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    const form = new FormData(e.currentTarget)
    const values = {
      title: form.get('title') as string,
      description: form.get('description') as string,
      price: Number(form.get('price')),
      city: form.get('city') as string,
      district: form.get('district') as string,
      type: form.get('type') as 'apartment' | 'villa' | 'studio' | 'riad' | 'terrain' | 'commercial',
      transaction_type: form.get('transaction_type') as 'sale' | 'rent',
      bedrooms: form.get('bedrooms') ? Number(form.get('bedrooms')) : null,
      bathrooms: form.get('bathrooms') ? Number(form.get('bathrooms')) : null,
      area: form.get('area') ? Number(form.get('area')) : null,
      status: (form.get('status') as string || 'draft') as 'active' | 'draft' | 'sold' | 'rented',
      assigned_agent_id: form.get('assigned_agent_id') as string || null,
      images,
    }

    const result = isEditing
      ? await updateProperty(property!.id, values)
      : await createProperty(values)

    setLoading(false)

    if (result.error) {
      if (typeof result.error === 'object') {
        setErrors(result.error as Record<string, string[]>)
      }
      toast.error(isEditing ? 'Failed to update property' : 'Failed to create property')
    } else {
      toast.success(isEditing ? 'Property updated' : 'Property created')
      onOpenChange(false)
      router.refresh()
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      {/* Dialog */}
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border bg-card p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">
            {isEditing ? 'Edit Property' : 'New Property'}
          </h2>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-md p-1.5 hover:bg-accent"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {errors._form && (
            <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {errors._form[0]}
            </div>
          )}

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Title *</label>
            <input
              name="title"
              defaultValue={property?.title ?? ''}
              required
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Appartement T3 - Guéliz"
            />
            {errors.title && <p className="text-xs text-destructive">{errors.title[0]}</p>}
          </div>

          {/* Type + Transaction */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Type *</label>
              <select
                name="type"
                defaultValue={property?.type ?? ''}
                required
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
              >
                <option value="">Select type...</option>
                {PROPERTY_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Transaction *</label>
              <select
                name="transaction_type"
                defaultValue={property?.transaction_type ?? 'sale'}
                required
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
              >
                <option value="sale">Sale</option>
                <option value="rent">Rent</option>
              </select>
            </div>
          </div>

          {/* Price */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Price (MAD) *</label>
            <input
              name="price"
              type="number"
              defaultValue={property?.price ?? ''}
              required
              min={0}
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="950000"
            />
          </div>

          {/* City + District */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">City *</label>
              <select
                name="city"
                defaultValue={property?.city ?? ''}
                required
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
              >
                <option value="">Select city...</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">District</label>
              <input
                name="district"
                defaultValue={property?.district ?? ''}
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Guéliz"
              />
            </div>
          </div>

          {/* Bedrooms, Bathrooms, Area */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Bedrooms</label>
              <input
                name="bedrooms"
                type="number"
                min={0}
                defaultValue={property?.bedrooms ?? ''}
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Bathrooms</label>
              <input
                name="bathrooms"
                type="number"
                min={0}
                defaultValue={property?.bathrooms ?? ''}
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Area (m²)</label>
              <input
                name="area"
                type="number"
                min={0}
                defaultValue={property?.area ?? ''}
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Description</label>
            <textarea
              name="description"
              defaultValue={property?.description ?? ''}
              rows={3}
              className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              placeholder="Describe the property..."
            />
          </div>

          {/* Images Upload */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Images</label>
            <div
              className="relative flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-input p-6 transition-colors hover:border-primary/50 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation() }}
              onDrop={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleImageUpload(e.dataTransfer.files)
              }}
            >
              {uploading ? (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              ) : (
                <ImagePlus className="h-6 w-6 text-muted-foreground" />
              )}
              <p className="text-xs text-muted-foreground">
                {uploading ? 'Uploading...' : 'Click or drag images here'}
              </p>
              <p className="text-[10px] text-muted-foreground">Max 5MB per image</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleImageUpload(e.target.files)}
              />
            </div>

            {/* Image Thumbnails */}
            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-2">
                {images.map((url, i) => (
                  <div key={i} className="group relative aspect-square rounded-lg overflow-hidden border bg-muted">
                    <img src={url} alt={`Property image ${i + 1}`} className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleImageDelete(url) }}
                      className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Status + Assigned Agent */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Status</label>
              <select
                name="status"
                defaultValue={property?.status ?? 'draft'}
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="sold">Sold</option>
                <option value="rented">Rented</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Assigned Agent</label>
              <select
                name="assigned_agent_id"
                defaultValue={property?.assigned_agent_id ?? ''}
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
              >
                <option value="">Unassigned</option>
                {agents.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.full_name} {a.role === 'admin' ? '(Admin)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="inline-flex h-10 items-center rounded-lg border px-4 text-sm font-medium transition-colors hover:bg-accent"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEditing ? 'Update Property' : 'Create Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
