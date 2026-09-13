'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Eye, MapPin, Bed, Bath, Maximize } from 'lucide-react'
import { deleteProperty } from '@/lib/actions/properties'
import { formatPrice } from '@/lib/utils'
import { PROPERTY_TYPES, PROPERTY_STATUSES, CITIES } from '@/lib/constants'
import { PropertyFormDialog } from './property-form-dialog'
import type { Property } from '@/types'

export function PropertiesClient({ properties }: { properties: Property[] }) {
  const router = useRouter()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProperty, setEditingProperty] = useState<Property | null>(null)
  const [filter, setFilter] = useState({ city: '', type: '', status: '' })

  const filtered = properties.filter((p) => {
    if (filter.city && p.city !== filter.city) return false
    if (filter.type && p.type !== filter.type) return false
    if (filter.status && p.status !== filter.status) return false
    return true
  })

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this property?')) return
    const result = await deleteProperty(id)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Property deleted')
      router.refresh()
    }
  }

  function handleEdit(property: Property) {
    setEditingProperty(property)
    setDialogOpen(true)
  }

  function handleCreate() {
    setEditingProperty(null)
    setDialogOpen(true)
  }

  const statusColor: Record<string, string> = {
    active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    draft: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    sold: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    rented: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  }

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <select
            value={filter.city}
            onChange={(e) => setFilter((f) => ({ ...f, city: e.target.value }))}
            className="h-9 rounded-lg border bg-background px-3 text-sm"
          >
            <option value="">All Cities</option>
            {CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            value={filter.type}
            onChange={(e) => setFilter((f) => ({ ...f, type: e.target.value }))}
            className="h-9 rounded-lg border bg-background px-3 text-sm"
          >
            <option value="">All Types</option>
            {PROPERTY_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          <select
            value={filter.status}
            onChange={(e) => setFilter((f) => ({ ...f, status: e.target.value }))}
            className="h-9 rounded-lg border bg-background px-3 text-sm"
          >
            <option value="">All Status</option>
            {PROPERTY_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Add Property
        </button>
      </div>

      {/* Cards Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16">
          <p className="text-lg font-medium">No properties found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {properties.length === 0 ? 'Create your first property to get started.' : 'Try adjusting your filters.'}
          </p>
          {properties.length === 0 && (
            <button
              onClick={handleCreate}
              className="mt-4 inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              Add Property
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((property) => (
            <div
              key={property.id}
              className="group rounded-xl border bg-card shadow-sm transition-all hover:shadow-md"
            >
              {/* Image placeholder */}
              <div className="relative aspect-[16/10] overflow-hidden rounded-t-xl bg-muted">
                {property.images && property.images.length > 0 ? (
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <MapPin className="h-8 w-8 text-muted-foreground/30" />
                  </div>
                )}
                <div className="absolute right-2 top-2">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColor[property.status]}`}>
                    {property.status}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold line-clamp-1">{property.title}</h3>
                  <p className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {property.city}{property.district ? `, ${property.district}` : ''}
                  </p>
                </div>

                <p className="text-lg font-bold text-primary">
                  {formatPrice(property.price)}
                </p>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  {property.bedrooms != null && (
                    <span className="flex items-center gap-1">
                      <Bed className="h-3.5 w-3.5" /> {property.bedrooms}
                    </span>
                  )}
                  {property.bathrooms != null && (
                    <span className="flex items-center gap-1">
                      <Bath className="h-3.5 w-3.5" /> {property.bathrooms}
                    </span>
                  )}
                  {property.area != null && (
                    <span className="flex items-center gap-1">
                      <Maximize className="h-3.5 w-3.5" /> {property.area}m²
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 border-t pt-3">
                  <a
                    href={`/properties/${property.slug}`}
                    target="_blank"
                    className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md border text-xs font-medium transition-colors hover:bg-accent"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View
                  </a>
                  <button
                    onClick={() => handleEdit(property)}
                    className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md border text-xs font-medium transition-colors hover:bg-accent"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(property.id)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border text-xs text-destructive transition-colors hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <PropertyFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        property={editingProperty}
      />
    </>
  )
}
