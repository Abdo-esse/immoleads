import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPropertyBySlug } from '@/lib/actions/properties'
import { formatPrice } from '@/lib/utils'
import { MapPin, Bed, Bath, Maximize, ArrowLeft, Phone } from 'lucide-react'
import { buildWhatsAppUrl, buildPropertyMessage } from '@/lib/whatsapp'
import { LeadFormSection } from './lead-form-section'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const property = await getPropertyBySlug(slug)
  if (!property) return { title: 'Property Not Found' }
  return {
    title: `${property.title} — ImmoLeads`,
    description: property.description || `${property.title} à ${property.city}`,
  }
}

export default async function PropertyDetailPage({ params }: Props) {
  const { slug } = await params
  const property = await getPropertyBySlug(slug)

  if (!property) {
    notFound()
  }

  const whatsappMessage = buildPropertyMessage(property.title)
  const whatsappUrl = buildWhatsAppUrl('212669808310', whatsappMessage)

  return (
    <div>
      {/* Breadcrumb */}
      <div className="border-b bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/properties"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux biens
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-muted">
              {property.images && property.images.length > 0 ? (
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/5 to-primary/15">
                  <div className="text-center">
                    <MapPin className="mx-auto h-16 w-16 text-primary/20" />
                    <p className="mt-2 text-sm text-muted-foreground">Photos bientôt disponibles</p>
                  </div>
                </div>
              )}
              <div className="absolute left-4 top-4">
                <span className="rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground shadow-lg">
                  {property.transaction_type === 'sale' ? 'Vente' : 'Location'}
                </span>
              </div>
            </div>

            {/* Title & Location */}
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{property.title}</h1>
              <p className="mt-2 flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {property.city}{property.district ? `, ${property.district}` : ''}
              </p>
            </div>

            {/* Key Details */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { icon: Bed, label: 'Chambres', value: property.bedrooms ?? '—' },
                { icon: Bath, label: 'Salle de bain', value: property.bathrooms ?? '—' },
                { icon: Maximize, label: 'Surface', value: property.area ? `${property.area} m²` : '—' },
                { icon: MapPin, label: 'Ville', value: property.city },
              ].map((detail) => (
                <div key={detail.label} className="rounded-xl border bg-card p-4 text-center">
                  <detail.icon className="mx-auto h-5 w-5 text-primary" />
                  <p className="mt-2 text-lg font-bold">{detail.value}</p>
                  <p className="text-xs text-muted-foreground">{detail.label}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            {property.description && (
              <div>
                <h2 className="text-lg font-semibold">Description</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground whitespace-pre-line">
                  {property.description}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="sticky top-20 space-y-4 rounded-2xl border bg-card p-6 shadow-sm">
              <div>
                <p className="text-sm text-muted-foreground">Prix</p>
                <p className="text-3xl font-bold text-primary">
                  {formatPrice(property.price)}
                </p>
                {property.transaction_type === 'rent' && (
                  <p className="text-sm text-muted-foreground">par mois</p>
                )}
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] text-sm font-medium text-white shadow-lg shadow-[#25D366]/25 transition-all hover:bg-[#20BD5C] hover:shadow-xl"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </a>

                <a
                  href="tel:+212522000000"
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border text-sm font-medium transition-colors hover:bg-accent"
                >
                  <Phone className="h-4 w-4" />
                  Appeler l&apos;agence
                </a>
              </div>

              <div className="border-t pt-4">
                <p className="text-xs text-muted-foreground text-center">
                  Réponse garantie sous 24h
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Lead Form Section */}
        <div className="mt-12">
          <LeadFormSection
            propertyId={property.id}
            agencyId={property.agency_id}
            propertyTitle={property.title}
          />
        </div>
      </div>
    </div>
  )
}
