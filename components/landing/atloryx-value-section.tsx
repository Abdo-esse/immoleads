import { Sliders, Headphones, MessageSquare, TrendingUp, Sparkles, CheckCircle2 } from 'lucide-react'

export function AtloryxValueSection() {
  const pillars = [
    {
      icon: Sliders,
      title: 'Personnalisé pour votre agence',
      desc: 'Votre logo, vos biens, votre équipe, vos statuts et vos workflows commerciaux configurés sur-mesure.',
    },
    {
      icon: Headphones,
      title: 'Accompagnement à la mise en place',
      desc: 'L’équipe ATLORYX configure le système avec vous et forme vos agents pour une prise en main immédiate.',
    },
    {
      icon: MessageSquare,
      title: 'Pensé nativement pour WhatsApp',
      desc: 'Parce que 90% des transactions au Maroc se négocient sur WhatsApp, le système est centré sur ce canal clé.',
    },
    {
      icon: TrendingUp,
      title: 'Évolutif & Sans Limite',
      desc: 'Connectez de nouvelles campagnes Meta Ads, ajoutez des agents ou étendez à d’autres villes au fil de votre croissance.',
    },
  ]

  return (
    <section className="relative py-20 lg:py-28 bg-[#F8FAFC] dark:bg-[#07131D] border-b border-[#E2E8F0] dark:border-[#193646]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#58B52A]/30 bg-[#ECF8E7] dark:bg-[#15351C] text-[#2E7D17] dark:text-[#65C832] text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            L’Approche ATLORYX
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F2A3D] dark:text-[#F8FAFC] tracking-tight mb-4">
            Ce n’est pas simplement un CRM.
          </h2>
          <p className="text-xl sm:text-2xl font-bold text-[#58B52A] dark:text-[#65C832] mb-4">
            ImmoLeads relie l’acquisition publicitaire au suivi commercial.
          </p>
          <p className="text-base sm:text-lg text-[#64748B] dark:text-[#A8B6C3]">
            Un pont technologique complet entre vos dépenses marketing et les visites physiques générées par vos négociateurs.
          </p>
        </div>

        {/* Chain Ribbon */}
        <div className="mx-auto max-w-4xl rounded-2xl bg-[#0F2A3D] p-5 sm:p-6 text-white mb-16 shadow-lg border border-[#213A49]">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm font-bold">
            <span className="px-3 py-1 rounded-lg bg-[#132B3A] text-slate-200">Acquisition</span>
            <span className="text-[#58B52A]">→</span>
            <span className="px-3 py-1 rounded-lg bg-[#132B3A] text-slate-200">Qualification</span>
            <span className="text-[#58B52A]">→</span>
            <span className="px-3 py-1 rounded-lg bg-[#132B3A] text-slate-200">Conversation</span>
            <span className="text-[#58B52A]">→</span>
            <span className="px-3 py-1 rounded-lg bg-[#132B3A] text-slate-200">CRM Central</span>
            <span className="text-[#58B52A]">→</span>
            <span className="px-3 py-1 rounded-lg bg-[#132B3A] text-slate-200">Follow-up</span>
            <span className="text-[#58B52A]">→</span>
            <span className="px-3 py-1 rounded-lg bg-[#58B52A] text-white font-extrabold shadow-xs">Visite ✓</span>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {pillars.map((pil, idx) => {
            const Icon = pil.icon
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white dark:bg-[#0D1F2D] p-6 border border-[#E2E8F0] dark:border-[#213A49] shadow-xs hover:shadow-md hover:border-[#58B52A]/40 transition-all"
              >
                <div className="h-11 w-11 rounded-xl bg-[#ECF8E7] dark:bg-[#15351C] text-[#58B52A] flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-base text-[#0F2A3D] dark:text-white mb-2">
                  {pil.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#A8B6C3] leading-relaxed">
                  {pil.desc}
                </p>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
