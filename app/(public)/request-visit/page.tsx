import { Metadata } from 'next'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { getActiveProperties } from '@/lib/actions/properties'
import { RequestVisitForm } from './request-visit-form'
import { Building2, Calendar, PhoneCall, ShieldCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Demander une Visite — ImmoLeads',
  description: 'Planifiez une visite accompagnée avec nos conseillers immobiliers pour découvrir vos futurs biens au Maroc.',
}

export const dynamic = 'force-dynamic'

export default async function RequestVisitPage() {
  const [properties, agencyRes] = await Promise.all([
    getActiveProperties().catch(() => []),
    supabaseAdmin.from('agencies').select('id, name').limit(1).single(),
  ])

  const agencyId = agencyRes.data?.id || '00000000-0000-0000-0000-000000000001'
  const agencyName = agencyRes.data?.name || 'ImmoLeads'

  const simplifiedProperties = properties.map((p) => ({
    id: p.id,
    title: p.title,
    city: p.city,
    price: p.price,
  }))

  return (
    <div className="py-12 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
            <Calendar className="h-3.5 w-3.5" />
            <span>Rendez-vous & Visite accompagnée</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Planifiez la Visite de Votre Futur Bien
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
            Remplissez ce formulaire et l&apos;un de nos agents experts vous recontactera sous 24h ouvrées pour organiser votre visite dans les meilleures conditions.
          </p>
        </div>

        {/* Benefits bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          <div className="flex items-center gap-2.5 rounded-xl border bg-card/60 p-3 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
            <span>Accompagnement gratuit et sans engagement</span>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl border bg-card/60 p-3 text-xs text-muted-foreground">
            <Building2 className="h-4 w-4 text-primary shrink-0" />
            <span>Conseil juridique & vérification des titres</span>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl border bg-card/60 p-3 text-xs text-muted-foreground">
            <PhoneCall className="h-4 w-4 text-primary shrink-0" />
            <span>Réponse rapide via WhatsApp ou Téléphone</span>
          </div>
        </div>

        {/* Form Container */}
        <div className="rounded-2xl border bg-card p-6 sm:p-8 shadow-sm">
          <RequestVisitForm
            properties={simplifiedProperties}
            agencyId={agencyId}
            agencyName={agencyName}
          />
        </div>
      </div>
    </div>
  )
}
