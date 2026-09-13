import Link from 'next/link'
import { Building2, Phone, Mail } from 'lucide-react'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Building2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Immo<span className="text-primary">Leads</span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Accueil
            </Link>
            <Link
              href="/properties"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Nos Biens
            </Link>
            <Link
              href="/request-visit"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Demander une Visite
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="tel:+212522000000"
              className="hidden items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground sm:flex"
            >
              <Phone className="h-4 w-4" />
              +212 5 22 00 00 00
            </a>
            <Link
              href="/request-visit"
              className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Demander une Visite
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                  <Building2 className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold">ImmoLeads</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Votre partenaire immobilier de confiance au Maroc. Trouvez le bien de vos rêves.
              </p>
            </div>

            {/* Navigation */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Navigation</h3>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Accueil
                  </Link>
                </li>
                <li>
                  <Link href="/properties" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Nos Biens
                  </Link>
                </li>
                <li>
                  <Link href="/request-visit" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Demander une Visite
                  </Link>
                </li>
              </ul>
            </div>

            {/* Villes */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Villes</h3>
              <ul className="space-y-2.5">
                {['Marrakech', 'Casablanca', 'Rabat', 'Tanger', 'Agadir'].map((city) => (
                  <li key={city}>
                    <Link
                      href={`/properties?city=${encodeURIComponent(city)}`}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {city}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Contact</h3>
              <ul className="space-y-2.5">
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 shrink-0" />
                  +212 5 22 00 00 00
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 shrink-0" />
                  contact@immomaroc.ma
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 border-t pt-6">
            <p className="text-center text-xs text-muted-foreground">
              © {new Date().getFullYear()} ImmoMaroc Agency. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
