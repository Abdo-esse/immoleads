'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { MapPin, Bed, Bath, Maximize, SlidersHorizontal, X } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { CITIES, PROPERTY_TYPES } from '@/lib/constants'
import type { Property } from '@/types'

export function PropertiesGrid({ properties }: { properties: Property[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)

  const activeCity = searchParams.get('city') || ''
  const activeType = searchParams.get('type') || ''

  function applyFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/properties?${params.toString()}`)
  }

  function clearFilters() {
    router.push('/properties')
  }

  const hasFilters = activeCity || activeType

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors hover:bg-accent"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filtres
        </button>

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-dashed px-3 text-sm text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
            Effacer les filtres
          </button>
        )}

        {activeCity && (
          <span className="inline-flex h-7 items-center gap-1 rounded-full bg-primary/10 px-3 text-xs font-medium text-primary">
            {activeCity}
          </span>
        )}
        {activeType && (
          <span className="inline-flex h-7 items-center gap-1 rounded-full bg-primary/10 px-3 text-xs font-medium text-primary">
            {PROPERTY_TYPES.find((t) => t.value === activeType)?.label || activeType}
          </span>
        )}
      </div>

      {filtersOpen && (
        <div className="rounded-xl border bg-card p-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Ville</label>
              <select
                value={activeCity}
                onChange={(e) => applyFilter('city', e.target.value)}
                className="flex h-10 w-full rounded-lg border bg-background px-3 text-sm"
              >
                <option value="">Toutes les villes</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Type</label>
              <select
                value={activeType}
                onChange={(e) => applyFilter('type', e.target.value)}
                className="flex h-10 w-full rounded-lg border bg-background px-3 text-sm"
              >
                <option value="">Tous les types</option>
                {PROPERTY_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Transaction</label>
              <select
                onChange={(e) => applyFilter('transaction_type', e.target.value)}
                className="flex h-10 w-full rounded-lg border bg-background px-3 text-sm"
              >
                <option value="">Tous</option>
                <option value="sale">Vente</option>
                <option value="rent">Location</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      {properties.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-lg font-medium">Aucun bien trouvé</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Essayez de modifier vos filtres ou revenez plus tard.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <Link
              key={property.id}
              href={`/properties/${property.slug}`}
              className="group rounded-xl border bg-card shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              {/* Image */}
              <div className="relative aspect-[16/10] overflow-hidden rounded-t-xl bg-muted">
                {property.images && property.images.length > 0 ? (
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
                    <MapPin className="h-10 w-10 text-primary/20" />
                  </div>
                )}
                <div className="absolute left-3 top-3">
                  <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground shadow-lg">
                    {property.transaction_type === 'sale' ? 'Vente' : 'Location'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 space-y-3">
                <div>
                  <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                    {property.title}
                  </h3>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {property.city}{property.district ? `, ${property.district}` : ''}
                  </p>
                </div>

                <p className="text-xl font-bold text-primary">
                  {formatPrice(property.price)}
                  {property.transaction_type === 'rent' && <span className="text-sm font-normal text-muted-foreground"> /mois</span>}
                </p>

                <div className="flex items-center gap-5 border-t pt-3 text-sm text-muted-foreground">
                  {property.bedrooms != null && (
                    <span className="flex items-center gap-1.5">
                      <Bed className="h-4 w-4" /> {property.bedrooms} ch.
                    </span>
                  )}
                  {property.bathrooms != null && (
                    <span className="flex items-center gap-1.5">
                      <Bath className="h-4 w-4" /> {property.bathrooms} sdb.
                    </span>
                  )}
                  {property.area != null && (
                    <span className="flex items-center gap-1.5">
                      <Maximize className="h-4 w-4" /> {property.area} m²
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
