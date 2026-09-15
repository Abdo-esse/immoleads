import { Building2, User, HardHat, Check, ArrowRight } from 'lucide-react'

export function TargetAudienceSection() {
  const audiences = [
    {
      icon: Building2,
      badge: 'Agences Immobilières',
      title: 'Agences & Réseaux',
      subtitle: 'Centralisez les demandes de plusieurs agents et supervisez les performances.',
      features: [
        'Distribution équitable des leads entre agents',
        'Visibilité globale sur le pipeline de l’agence',
        'Contrôle des relances et des visites réalisées',
        'Statistiques de performance par négociateur',
      ],
      ctaText: 'Pour les équipes de 2 à 50+ agents',
      accent: '#3B82F6',
    },
    {
      icon: User,
      badge: 'Indépendants & Mandataires',
      title: 'Agents & Courtiers',
      subtitle: 'Organisez vos prospects personnels et ne laissez filer aucun mandat.',
      features: [
        'Gestion simple et rapide sans usine à gaz',
        'Alertes WhatsApp et rappels quotidiens',
        'Historique complet des critères de chaque acheteur',
        'Gain de 2h de gestion administrative par jour',
      ],
      ctaText: 'Idéal pour doubler ses visites en solo',
      accent: '#58B52A',
      popular: true,
    },
    {
      icon: HardHat,
      badge: 'Promotion Immobilière',
      title: 'Promoteurs Immobiliers',
      subtitle: 'Structurez les flux massifs de leads générés par vos projets neufs.',
      features: [
        'Gestion de gros volumes de leads publicitaires',
        'Filtrage automatique des budgets et apports',
        'Prise de rendez-vous directe au bureau de vente',
        'Traçabilité du coût d’acquisition par réservation',
      ],
      ctaText: 'Pour lancements et programmes neufs',
      accent: '#8B5CF6',
    },
  ]

  return (
    <section id="pour-qui" className="relative py-20 lg:py-28 bg-white dark:bg-[#0D1F2D] border-b border-[#E2E8F0] dark:border-[#193646]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#58B52A]/30 bg-[#ECF8E7] dark:bg-[#15351C] text-[#2E7D17] dark:text-[#65C832] text-xs font-bold uppercase tracking-wider mb-4">
            Pour Qui ?
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F2A3D] dark:text-[#F8FAFC] tracking-tight mb-4">
            Conçu pour les professionnels qui commercialisent des biens.
          </h2>
          <p className="text-base sm:text-lg text-[#64748B] dark:text-[#A8B6C3]">
            Une solution adaptée à votre modèle d’organisation et à vos volumes de contacts.
          </p>
        </div>

        {/* 3 Audience Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {audiences.map((aud, idx) => {
            const Icon = aud.icon
            return (
              <div
                key={idx}
                className={`relative rounded-2xl bg-[#F8FAFC] dark:bg-[#132B3A] p-7 sm:p-8 border ${aud.popular
                  ? 'border-[#58B52A] shadow-xl shadow-[#58B52A]/10 bg-white dark:bg-[#0D1F2D]'
                  : 'border-[#E2E8F0] dark:border-[#213A49] shadow-xs'
                  } flex flex-col justify-between hover:shadow-lg transition-all`}
              >
                {aud.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#58B52A] text-white text-[11px] font-extrabold shadow-xs">
                    Choix le plus populaire
                  </div>
                )}

                <div>
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className="h-12 w-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${aud.accent}18`, color: aud.accent }}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F1F5F9] dark:bg-[#193646] text-[#475569] dark:text-[#A8B6C3]">
                      {aud.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#0F2A3D] dark:text-white mb-2">
                    {aud.title}
                  </h3>
                  <p className="text-sm text-[#64748B] dark:text-[#A8B6C3] leading-relaxed mb-6">
                    {aud.subtitle}
                  </p>

                  {/* Checklist */}
                  <ul className="space-y-3 mb-8">
                    {aud.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#102A3A] dark:text-[#F8FAFC]">
                        <Check className="h-4 w-4 text-[#58B52A] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-[#E2E8F0] dark:border-[#213A49] text-xs font-bold text-[#58B52A] flex items-center justify-between">
                  <span>{aud.ctaText}</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
