import Link from 'next/link'
import { Building2, ArrowRight, MapPin, Home, Users } from 'lucide-react'

export const metadata = {
  title: 'ImmoLeads — Votre Partenaire Immobilier au Maroc',
  description:
    'Découvrez les meilleurs biens immobiliers au Maroc. Appartements, villas, riads et terrains dans les meilleures villes.',
}

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/80 px-4 py-1.5 text-sm backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-success animate-pulse" />
              <span className="text-muted-foreground">Biens disponibles à Marrakech, Casablanca, Rabat</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Trouvez le Bien{' '}
              <span className="text-gradient">Idéal</span>{' '}
              au Maroc
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Appartements, villas, riads et terrains dans les meilleures villes du Maroc.
              Notre agence vous accompagne dans votre projet immobilier.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/properties"
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30"
              >
                Voir nos biens
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/request-visit"
                className="inline-flex h-12 items-center gap-2 rounded-xl border bg-background px-6 text-sm font-medium transition-colors hover:bg-accent"
              >
                Demander une visite
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { icon: Home, value: '150+', label: 'Biens Disponibles' },
              { icon: Users, value: '500+', label: 'Clients Satisfaits' },
              { icon: MapPin, value: '10+', label: 'Villes Couvertes' },
              { icon: Building2, value: '5 ans', label: "d'Expérience" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-primary px-8 py-16 text-center shadow-2xl shadow-primary/20 sm:px-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,oklch(0.55_0.18_260/0.3),transparent_60%)]" />
          <div className="relative">
            <h2 className="text-3xl font-bold text-primary-foreground sm:text-4xl">
              Vous cherchez un bien immobilier ?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
              Remplissez notre formulaire rapide et un agent vous contactera dans les 24 heures.
            </p>
            <div className="mt-8">
              <Link
                href="/request-visit"
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-background px-8 text-sm font-semibold text-foreground shadow-lg transition-all hover:scale-105"
              >
                Demander une visite gratuite
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
