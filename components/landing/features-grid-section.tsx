import { Home, Target, MessageSquare, Users, BellRing, Calendar, Shield, Sparkles, Check, Upload, Link2, ShieldCheck } from 'lucide-react'

export function FeaturesGridSection() {
  const mainFeatures = [
    {
      icon: Home,
      title: 'Pages immobilières',
      desc: 'Présentez vos biens avec des pages rapides, élégantes et spécialement optimisées pour déclencher la prise de contact WhatsApp.',
      color: '#3B82F6',
    },
    {
      icon: Target,
      title: 'Qualification des prospects',
      desc: 'Filtrez immédiatement les curieux en collectant budget, téléphone WhatsApp et délai du projet avant le premier échange.',
      color: '#58B52A',
    },
    {
      icon: MessageSquare,
      title: 'Parcours WhatsApp',
      desc: 'Facilitez le passage du prospect vers une conversation déjà contextualisée avec la référence du bien et son profil d’achat.',
      color: '#25D366',
    },
    {
      icon: Users,
      title: 'CRM immobilier',
      desc: 'Centralisez prospects, statuts, agents assignés, notes d’échanges et historique complet au même endroit.',
      color: '#8B5CF6',
    },
    {
      icon: BellRing,
      title: 'Relances & suivi',
      desc: 'Planifiez vos prochaines actions commerciales et repérez instantanément les relances prioritaires ou en retard.',
      color: '#F59E0B',
    },
    {
      icon: Calendar,
      title: 'Gestion des visites',
      desc: 'Transformez un prospect qualifié en visite planifiée directement dans l’agenda de vos agents avec rappels automatiques.',
      color: '#16A34A',
    },
    {
      icon: Upload,
      title: 'Import CSV / Excel',
      desc: 'Importez vos contacts existants en masse depuis un fichier. Migration simple et rapide vers ImmoLeads sans ressaisie.',
      color: '#06B6D4',
    },
    {
      icon: Link2,
      title: 'Matching lead ↔ bien',
      desc: 'Suggestion automatique des biens correspondant au profil du prospect (ville, budget, type) pour accélérer la conversion.',
      color: '#EC4899',
    },
    {
      icon: ShieldCheck,
      title: 'Détection de doublons',
      desc: 'Identifiez automatiquement les prospects en double par téléphone ou email et fusionnez les fiches pour éviter la confusion.',
      color: '#EF4444',
    },
  ]

  const secondaryTags = [
    'Pipeline commercial visuel',
    'Analytics & rentabilité sources',
    'UTM & Meta Ads Tracking',
    'Gestion complète du catalogue de biens',
    'Rôles Multi-agents & Administrateur',
    'Dashboard en temps réel',
    'Notifications instantanées',
    'Recherche globale Ctrl+K',
    'Application mobile PWA',
  ]

  return (
    <section id="fonctionnalites" className="relative py-20 lg:py-28 bg-[#F8FAFC] dark:bg-[#07131D] border-b border-[#E2E8F0] dark:border-[#193646]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#58B52A]/30 bg-[#ECF8E7] dark:bg-[#15351C] text-[#2E7D17] dark:text-[#65C832] text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            Fonctionnalités Clés
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F2A3D] dark:text-[#F8FAFC] tracking-tight mb-4">
            Un système complet pour votre acquisition immobilière.
          </h2>
          <p className="text-base sm:text-lg text-[#64748B] dark:text-[#A8B6C3]">
            Tous les outils nécessaires pour transformer un visiteur anonyme en acheteur sur place.
          </p>
        </div>

        {/* 3x3 Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {mainFeatures.map((feat, idx) => {
            const Icon = feat.icon
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white dark:bg-[#0D1F2D] p-7 border border-[#E2E8F0] dark:border-[#213A49] shadow-xs hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group"
              >
                <div
                  className="h-12 w-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: `${feat.color}18`, color: feat.color }}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-[#0F2A3D] dark:text-white mb-2.5">
                  {feat.title}
                </h3>
                <p className="text-sm text-[#64748B] dark:text-[#A8B6C3] leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            )
          })}
        </div>

        {/* Secondary Lighter Ribbon with Tags */}
        <div className="rounded-2xl bg-[#F1F5F9] dark:bg-[#132B3A] p-6 border border-[#E2E8F0] dark:border-[#213A49] text-center">
          <div className="text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-[#A8B6C3] mb-4">
            Et également inclus dans votre solution ATLORYX ImmoLeads :
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            {secondaryTags.map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#0D1F2D] border border-[#E2E8F0] dark:border-[#213A49] text-xs sm:text-sm font-semibold text-[#0F2A3D] dark:text-[#F8FAFC] shadow-2xs"
              >
                <Check className="h-3.5 w-3.5 text-[#58B52A]" />
                {tag}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
