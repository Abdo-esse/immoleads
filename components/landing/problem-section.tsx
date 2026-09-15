import { MessageSquareOff, HelpCircle, Clock, BarChart3, AlertCircle } from 'lucide-react'

export function ProblemSection() {
  const painPoints = [
    {
      icon: MessageSquareOff,
      title: 'Messages dispersés',
      description:
        'Les demandes arrivent simultanément depuis Facebook, Instagram et WhatsApp sur les téléphones personnels de différents agents, sans centralisation.',
      badge: 'Perte d’information',
    },
    {
      icon: HelpCircle,
      title: 'Informations incomplètes',
      description:
        '« Prix ? », « Disponible ? », « Où exactement ? » : vous perdez un temps précieux à qualifier des curieux non finançables plutôt que de vrais acheteurs.',
      badge: 'Temps gaspillé',
    },
    {
      icon: Clock,
      title: 'Relances oubliées',
      description:
        'Les conversations descendent dans WhatsApp. Sans rappels planifiés, 60% des prospects intéressés ne sont jamais recontactés au moment opportun.',
      badge: 'Ventes perdues',
    },
    {
      icon: BarChart3,
      title: 'Manque de visibilité',
      description:
        'Impossible pour la direction de savoir quels leads sont qualifiés, quelles visites sont planifiées ou quelle campagne publicitaire est réellement rentable.',
      badge: 'Pilotage à l’aveugle',
    },
  ]

  return (
    <section className="relative py-20 lg:py-28 bg-white dark:bg-[#0D1F2D] border-b border-[#E2E8F0] dark:border-[#193646]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#DC3545]/20 bg-[#FDF2F2] dark:bg-[#2A1517] text-[#DC3545] dark:text-[#F05252] text-xs font-bold uppercase tracking-wider mb-4">
            <AlertCircle className="h-3.5 w-3.5" />
            Un problème bien connu dans l'immobilier
          </div>

          <p className="text-lg sm:text-xl font-semibold text-[#64748B] dark:text-[#A8B6C3] mb-2">
            Vous recevez des leads. Mais que deviennent-ils ensuite ?
          </p>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F2A3D] dark:text-[#F8FAFC] tracking-tight leading-tight">
            WhatsApp seul n’est pas un système de suivi commercial.
          </h2>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {painPoints.map((item, idx) => {
            const Icon = item.icon
            return (
              <div
                key={idx}
                className="group relative rounded-2xl bg-[#F8FAFC] dark:bg-[#132B3A] p-6 border border-[#E2E8F0] dark:border-[#213A49] transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-[#DC3545]/40"
              >
                {/* Badge */}
                <div className="inline-block px-2.5 py-0.5 rounded-md bg-[#FEE2E2] dark:bg-[#3B1719] text-[#B91C1C] dark:text-[#FCA5A5] text-[11px] font-bold mb-4">
                  {item.badge}
                </div>

                {/* Icon */}
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white dark:bg-[#0D1F2D] border border-[#E2E8F0] dark:border-[#213A49] shadow-xs mb-4 text-[#DC3545] group-hover:scale-110 transition-transform">
                  <Icon className="h-6 w-6" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-[#0F2A3D] dark:text-white mb-2">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-[#64748B] dark:text-[#A8B6C3] leading-relaxed">
                  {item.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* Strong Quote Banner */}
        <div className="mx-auto max-w-4xl rounded-2xl bg-gradient-to-r from-[#0F2A3D] via-[#102A3A] to-[#0F2A3D] p-6 sm:p-8 text-center text-white shadow-xl border border-[#213A49] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#58B52A_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
          <div className="relative">
            <p className="text-lg sm:text-xl md:text-2xl font-semibold leading-relaxed tracking-tight">
              « Le problème n’est pas toujours de recevoir plus de leads.{' '}
              <span className="text-[#58B52A] dark:text-[#65C832] font-bold">
                C’est surtout de mieux gérer et convertir ceux que vous recevez déjà.
              </span> »
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}
