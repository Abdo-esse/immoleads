import { Suspense } from 'react'
import { getActiveProperties } from '@/lib/actions/properties'
import { PropertiesGrid } from './properties-grid'

export const metadata = {
  title: 'Nos Biens — ImmoLeads',
  description: 'Découvrez nos biens immobiliers disponibles au Maroc. Appartements, villas, riads et terrains.',
}

interface Props {
  searchParams: Promise<{
    city?: string
    type?: string
    transaction_type?: string
    min_price?: string
    max_price?: string
  }>
}

export default async function PublicPropertiesPage({ searchParams }: Props) {
  const params = await searchParams
  const properties = await getActiveProperties({
    city: params.city,
    type: params.type,
    transaction_type: params.transaction_type,
    min_price: params.min_price ? Number(params.min_price) : undefined,
    max_price: params.max_price ? Number(params.max_price) : undefined,
  })

  return (
    <div>
      {/* Hero */}
      <section className="border-b bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Nos <span className="text-primary">Biens</span> Immobiliers
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            {properties.length} bien{properties.length !== 1 ? 's' : ''} disponible{properties.length !== 1 ? 's' : ''}
          </p>
        </div>
      </section>

      {/* Listings */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Suspense fallback={<div className="py-12 text-center text-muted-foreground">Chargement...</div>}>
          <PropertiesGrid properties={properties} />
        </Suspense>
      </section>
    </div>
  )
}
