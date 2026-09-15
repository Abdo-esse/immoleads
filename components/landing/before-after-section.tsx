import { X, Check, ArrowRight, Zap, TrendingUp, ShieldAlert, Sparkles } from 'lucide-react'

export function BeforeAfterSection() {
  const beforeList = [
    'Messages éparpillés entre WhatsApp personnels et messageries',
    'Informations incomplètes sans budget ni délai d’achat précisé',
    'Relances manuelles aléatoires selon la bonne mémoire de l’agent',
    'Prospects chauds oubliés ou recontactés après la concurrence',
    'Aucun pipeline clair ni visibilité pour la direction d’agence',
    'Impossible de mesurer le ROI réel des campagnes publicitaires',
  ]

  const afterList = [
    'Prospects qualifiés dès le premier contact avec budget et délai',
    'Leads centralisés en temps réel et distribués équitablement',
    'Relances planifiées avec rappels quotidiens automatiques',
    'Pipeline commercial visuel de la découverte à la signature',
    'Visites physiques organisées et confirmées en quelques clics',
    'Sources et conversions suivies au dirham près (Meta, WhatsApp, Web)',
  ]

  return (
    <section className="relative py-20 lg:py-28 bg-white dark:bg-[#0D1F2D] border-b border-[#E2E8F0] dark:border-[#193646]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#58B52A]/30 bg-[#ECF8E7] dark:bg-[#15351C] text-[#2E7D17] dark:text-[#65C832] text-xs font-bold uppercase tracking-wider mb-4">
            <TrendingUp className="h-3.5 w-3.5" />
            Impact Commercial Immédiat
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F2A3D] dark:text-[#F8FAFC] tracking-tight mb-4">
            Passez d’un suivi dispersé à un processus commercial structuré.
          </h2>
          <p className="text-base sm:text-lg text-[#64748B] dark:text-[#A8B6C3]">
            Voyez ce qui change concrètement dès la première semaine d’utilisation d’ImmoLeads.
          </p>
        </div>

        {/* Central Transition Banner */}
        <div className="mx-auto max-w-xl rounded-full bg-[#F1F5F9] dark:bg-[#132B3A] p-2 border border-[#E2E8F0] dark:border-[#213A49] mb-12 flex items-center justify-between text-xs sm:text-sm font-bold text-center px-4 sm:px-6 shadow-xs">
          <span className="text-[#DC3545]">Chaos manuel</span>
          <span className="text-[#64748B]">→</span>
          <span className="px-3 py-1 rounded-full bg-[#0F2A3D] text-white text-xs font-black">
            ATLORYX ImmoLeads
          </span>
          <span className="text-[#64748B]">→</span>
          <span className="text-[#58B52A] font-extrabold">Processus organisé ✓</span>
        </div>

        {/* 2 Comparison Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-5xl mx-auto mb-16">

          {/* Column AVANT */}
          <div className="rounded-2xl bg-[#FFF5F5] dark:bg-[#1A1214] p-6 sm:p-8 border-2 border-[#FCA5A5] dark:border-[#7F1D1D] shadow-xs flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-[#FCA5A5]/60 dark:border-[#7F1D1D] mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#991B1B] dark:text-[#F87171]">
                  Situation habituelle
                </span>
                <h3 className="text-2xl font-black text-[#7F1D1D] dark:text-[#FCA5A5] mt-0.5">
                  AVANT
                </h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-[#FEE2E2] dark:bg-[#3B1719] flex items-center justify-center text-[#DC3545]">
                <ShieldAlert className="h-5 w-5" />
              </div>
            </div>

            <ul className="space-y-4 flex-1">
              {beforeList.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-[#FEE2E2] dark:bg-[#3B1719] flex items-center justify-center text-[#DC3545] shrink-0 mt-0.5">
                    <X className="h-3.5 w-3.5 stroke-[3]" />
                  </div>
                  <span className="text-sm font-medium text-[#7F1D1D] dark:text-[#FCA5A5] leading-snug">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column AVEC IMMOLEADS */}
          <div className="rounded-2xl bg-[#ECF8E7]/40 dark:bg-[#0E2613] p-6 sm:p-8 border-2 border-[#58B52A] shadow-xl shadow-[#58B52A]/10 flex flex-col relative">

            {/* Top Recommended Badge */}
            <div className="absolute -top-3.5 right-6 px-3 py-0.5 rounded-full bg-[#58B52A] text-white text-xs font-extrabold shadow-sm flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Recommandé
            </div>

            <div className="flex items-center justify-between pb-4 border-b border-[#58B52A]/40 mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#2E7D17] dark:text-[#65C832]">
                  La méthode ATLORYX
                </span>
                <h3 className="text-2xl font-black text-[#15351C] dark:text-white mt-0.5">
                  AVEC IMMOLEADS
                </h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-[#ECF8E7] dark:bg-[#15351C] flex items-center justify-center text-[#58B52A]">
                <Check className="h-5 w-5 stroke-[3]" />
              </div>
            </div>

            <ul className="space-y-4 flex-1">
              {afterList.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-[#58B52A] flex items-center justify-center text-white shrink-0 mt-0.5">
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                  </div>
                  <span className="text-sm font-bold text-[#0F2A3D] dark:text-[#F8FAFC] leading-snug">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* 3 Impact Numbers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center p-5 rounded-2xl bg-[#F8FAFC] dark:bg-[#132B3A] border border-[#E2E8F0] dark:border-[#213A49]">
            <div className="text-3xl sm:text-4xl font-black text-[#58B52A] mb-1">+120%</div>
            <div className="text-xs sm:text-sm font-semibold text-[#102A3A] dark:text-white">De visites planifiées</div>
            <div className="text-xs text-[#64748B] dark:text-[#A8B6C3] mt-0.5">Dès les 30 premiers jours</div>
          </div>
          <div className="text-center p-5 rounded-2xl bg-[#F8FAFC] dark:bg-[#132B3A] border border-[#E2E8F0] dark:border-[#213A49]">
            <div className="text-3xl sm:text-4xl font-black text-[#3B82F6] mb-1">-60%</div>
            <div className="text-xs sm:text-sm font-semibold text-[#102A3A] dark:text-white">De temps perdu en suivi</div>
            <div className="text-xs text-[#64748B] dark:text-[#A8B6C3] mt-0.5">Grâce aux rappels intelligents</div>
          </div>
          <div className="text-center p-5 rounded-2xl bg-[#F8FAFC] dark:bg-[#132B3A] border border-[#E2E8F0] dark:border-[#213A49]">
            <div className="text-3xl sm:text-4xl font-black text-[#8B5CF6] mb-1">0</div>
            <div className="text-xs sm:text-sm font-semibold text-[#102A3A] dark:text-white">Prospect qualifié oublié</div>
            <div className="text-xs text-[#64748B] dark:text-[#A8B6C3] mt-0.5">Chaque demande a son statut</div>
          </div>
        </div>

      </div>
    </section>
  )
}
