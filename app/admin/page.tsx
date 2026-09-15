import Link from 'next/link'
import {
  Building2,
  Users,
  BarChart3,
  Inbox,
  ArrowRight,
  Phone,
  MapPin,
  Shield,
  MessageSquare,
  Sparkles,
} from 'lucide-react'
import { getSuperAdminStats } from '@/lib/actions/admin'

export default async function SuperAdminOverviewPage() {
  const stats = await getSuperAdminStats()

  const kpis = [
    {
      title: 'Agences Clientes',
      value: stats.totalAgencies.toString(),
      description: 'Tenants actifs',
      icon: Building2,
      color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30',
      href: '/admin/agencies',
    },
    {
      title: 'Utilisateurs Globaux',
      value: stats.totalUsers.toString(),
      description: 'Admins & agents',
      icon: Users,
      color: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30',
      href: '/admin/users',
    },
    {
      title: 'Leads CRM',
      value: stats.totalLeads.toString(),
      description: 'Toutes agences confondues',
      icon: BarChart3,
      color: 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30',
    },
    {
      title: 'Démos en Attente',
      value: stats.pendingDemos.toString(),
      description: stats.pendingDemos > 0 ? 'À traiter rapidement' : 'À jour',
      icon: Inbox,
      color: 'text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30',
      alert: stats.pendingDemos > 0,
      href: '/admin/demo-requests',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight">Vue d'ensemble</h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary border border-primary/20">
              <Shield className="h-3.5 w-3.5" />
              SuperAdmin
            </span>
          </div>
          <p className="text-muted-foreground mt-0.5">
            Superviser l'ensemble des agences, des équipes et des demandes de démonstration entrantes.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin/agencies"
            prefetch={false}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg border bg-card text-card-foreground hover:bg-accent text-xs sm:text-sm font-medium transition-colors shadow-xs"
          >
            <Building2 className="h-4 w-4 text-primary" />
            <span>Gérer Agences</span>
          </Link>

          <Link
            href="/admin/demo-requests"
            prefetch={false}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs sm:text-sm font-medium transition-colors shadow-xs"
          >
            <Inbox className="h-4 w-4" />
            <span>Boîte de Démo ({stats.pendingDemos})</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.title}
            className="relative overflow-hidden rounded-xl border bg-card p-3 sm:p-5 shadow-xs transition-all duration-300 hover:shadow-md"
          >
            <div className="flex items-center justify-between gap-1">
              <span className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                {kpi.title}
              </span>
              <div className={`rounded-lg p-1.5 sm:p-2.5 shrink-0 ${kpi.color}`}>
                <kpi.icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
            </div>
            <div className="mt-2 sm:mt-3">
              <div className="text-xl sm:text-3xl font-bold sm:font-extrabold tracking-tight">
                {kpi.value}
              </div>
              <p
                className={`mt-0.5 sm:mt-1 text-[11px] sm:text-xs truncate ${
                  kpi.alert ? 'font-medium text-destructive animate-pulse' : 'text-muted-foreground'
                }`}
              >
                {kpi.description}
              </p>
            </div>
            {kpi.href && (
              <div className="mt-3 pt-2.5 border-t border-border flex items-center justify-between text-xs">
                <Link
                  href={kpi.href}
                  prefetch={false}
                  className="text-primary hover:underline font-medium flex items-center gap-1"
                >
                  <span>Consulter</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Two Column Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Latest Demo Requests */}
        <div className="rounded-xl border bg-card p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                <Inbox className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-semibold">Dernières Demandes de Démo</h3>
                <p className="text-xs text-muted-foreground">Prospects via « Demander ma démonstration »</p>
              </div>
            </div>
            <Link
              href="/admin/demo-requests"
              prefetch={false}
              className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
            >
              <span>Toutes ({stats.pendingDemos})</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {stats.recentDemos.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-xs">
              Aucune demande de démonstration reçue pour le moment.
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recentDemos.map((demo) => {
                const phoneClean = demo.phone.replace(/[^0-9]/g, '')
                const whatsappUrl = `https://wa.me/${phoneClean}?text=${encodeURIComponent(
                  `Bonjour ${demo.full_name}, nous avons bien reçu votre demande de démonstration pour ImmoLeads. Quand seriez-vous disponible pour échanger ?`
                )}`

                return (
                  <div
                    key={demo.id}
                    className="p-3.5 rounded-lg border bg-muted/20 hover:bg-muted/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{demo.full_name}</span>
                        {demo.agency_name && (
                          <span className="text-xs text-muted-foreground">• {demo.agency_name}</span>
                        )}
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                            demo.status === 'NEW'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                              : demo.status === 'CONVERTED'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {demo.status === 'NEW' ? 'Nouveau' : demo.status === 'CONVERTED' ? 'Converti' : demo.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {demo.city}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {demo.phone}
                        </span>
                        {demo.monthly_leads && <span>{demo.monthly_leads} leads/m</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-xs"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Right: Recent Agencies */}
        <div className="rounded-xl border bg-card p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <Building2 className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-semibold">Agences Récentes</h3>
                <p className="text-xs text-muted-foreground">Derniers comptes agences configurés</p>
              </div>
            </div>
            <Link
              href="/admin/agencies"
              prefetch={false}
              className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
            >
              <span>Voir tout ({stats.totalAgencies})</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {stats.recentAgencies.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-xs">
              Aucune agence configurée pour le moment.
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recentAgencies.map((agency) => (
                <div
                  key={agency.id}
                  className="p-3.5 rounded-lg border bg-muted/20 hover:bg-muted/40 flex items-center justify-between gap-3 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{agency.name}</span>
                      {agency.city && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-muted text-muted-foreground">
                          {agency.city}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {agency.adminUser ? (
                        <span>
                          Admin : <strong className="text-foreground">{agency.adminUser.full_name}</strong>
                        </span>
                      ) : (
                        <span className="italic">Sans admin assigné</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-right">
                    <div className="text-xs">
                      <p className="font-semibold text-foreground">
                        {agency.userCount} agent{agency.userCount > 1 ? 's' : ''}
                      </p>
                      <p className="text-[11px] text-muted-foreground">{agency.leadCount} leads</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
