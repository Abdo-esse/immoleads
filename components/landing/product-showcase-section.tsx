'use client'

import { LayoutDashboard, GitFork, Clock, Building2, Calendar, BarChart2, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react'

export function ProductShowcaseSection() {
  const annotations = [
    {
      icon: LayoutDashboard,
      title: 'Dashboard',
      desc: 'Visualisez d’un coup d’œil vos nouveaux leads, prospects qualifiés, relances et visites en cours.',
      color: '#3B82F6',
    },
    {
      icon: GitFork,
      title: 'Pipeline commercial',
      desc: 'Nouveau → Contacté → Qualifié → Visite → Négociation → Gagné. Aucun lead ne stagne.',
      color: '#06B6D4',
    },
    {
      icon: Clock,
      title: 'Follow-up intelligent',
      desc: 'Identifiez immédiatement les prospects prioritaires à relancer aujourd’hui pour ne rien oublier.',
      color: '#58B52A',
    },
    {
      icon: Building2,
      title: 'Gestion des biens',
      desc: 'Centralisez toutes les propriétés associées à vos campagnes d’acquisition et partagez leurs fiches.',
      color: '#8B5CF6',
    },
    {
      icon: Calendar,
      title: 'Gestion des visites',
      desc: 'Planifiez, confirmez et notez les comptes-rendus de visites physiques depuis le même espace.',
      color: '#F59E0B',
    },
    {
      icon: BarChart2,
      title: 'Analytics & ROI',
      desc: 'Mesurez précisément quelles sources (Meta, WhatsApp, Portails) génèrent vos meilleurs mandats.',
      color: '#16A34A',
    },
  ]

  return (
    <section id="produit" className="relative py-20 lg:py-32 bg-[#0F2A3D] text-white overflow-hidden border-b border-[#213A49]">
      {/* Background glow lines */}
      <div className="absolute inset-0 bg-[radial-gradient(#58B52A_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#58B52A]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#58B52A]/40 bg-[#58B52A]/10 text-[#65C832] text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            Votre Espace Centralisé
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            Tout ce dont votre équipe a besoin pour suivre ses opportunités.
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Une interface claire, rapide et pensée pour l’action quotidienne de vos agents immobiliers.
          </p>
        </div>

        {/* Grand Screenshot / Dashboard Mockup (70% of impact) */}
        <div className="relative mx-auto max-w-6xl rounded-2xl bg-[#07131D] p-3 sm:p-5 border-2 border-[#213A49] shadow-2xl shadow-black/60 mb-16">

          {/* Top window bar */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#193646] px-1">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#EF4444]" />
              <div className="h-3 w-3 rounded-full bg-[#F59E0B]" />
              <div className="h-3 w-3 rounded-full bg-[#10B981]" />
              <span className="ml-2 text-xs font-mono text-slate-400">ATLORYX ImmoLeads — Dashboard Commercial Pro</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0F2A3D] text-[11px] border border-[#213A49]">
                <span className="h-2 w-2 rounded-full bg-[#58B52A] animate-pulse" />
                Synchronisation WhatsApp active
              </span>
              <span className="font-semibold text-[#65C832]">Agence Atlas • Marrakech</span>
            </div>
          </div>

          {/* Internal Dashboard View */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

            {/* Left stats & pipeline (8 cols) */}
            <div className="lg:col-span-8 space-y-4">

              {/* 4 Metric counters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-xl bg-[#0D1F2D] p-3.5 border border-[#213A49]">
                  <div className="text-xs text-slate-400 mb-1">Nouveaux leads</div>
                  <div className="text-2xl font-black text-white">128</div>
                  <div className="text-[11px] text-[#58B52A] font-semibold mt-1">↑ +24% ce mois</div>
                </div>
                <div className="rounded-xl bg-[#0D1F2D] p-3.5 border border-[#213A49]">
                  <div className="text-xs text-slate-400 mb-1">Qualifiés & contactés</div>
                  <div className="text-2xl font-black text-[#58B52A]">64</div>
                  <div className="text-[11px] text-slate-400 mt-1">50% du total</div>
                </div>
                <div className="rounded-xl bg-[#0D1F2D] p-3.5 border border-[#213A49]">
                  <div className="text-xs text-slate-400 mb-1">Visites planifiées</div>
                  <div className="text-2xl font-black text-[#8B5CF6]">24</div>
                  <div className="text-[11px] text-[#8B5CF6] font-semibold mt-1">8 cette semaine</div>
                </div>
                <div className="rounded-xl bg-[#0D1F2D] p-3.5 border border-[#213A49]">
                  <div className="text-xs text-slate-400 mb-1">Relances urgentes</div>
                  <div className="text-2xl font-black text-[#F59E0B]">8</div>
                  <div className="text-[11px] text-[#F59E0B] font-semibold mt-1">À traiter ajd.</div>
                </div>
              </div>

              {/* Pipeline Kanban view */}
              <div className="rounded-xl bg-[#0D1F2D] p-4 border border-[#213A49]">
                <div className="flex items-center justify-between mb-3 text-xs">
                  <div className="font-bold uppercase tracking-wider text-slate-300">
                    Pipeline des Ventes (128 Opportunités)
                  </div>
                  <div className="flex gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#132B3A] text-slate-300 text-[10px]">Toutes les villes</span>
                    <span className="px-2 py-0.5 rounded bg-[#58B52A] text-white text-[10px] font-bold">+ Nouveau Lead</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-xs">
                  <div className="rounded-lg bg-[#132B3A] p-2 border-t-2 border-[#3B82F6]">
                    <div className="flex justify-between font-bold text-[11px] mb-1.5">
                      <span className="text-[#3B82F6]">Nouveau</span>
                      <span className="text-slate-400">32</span>
                    </div>
                    <div className="p-1.5 rounded bg-[#07131D] mb-1.5 text-[10px]">
                      <div className="font-bold truncate text-white">Karim Tazi</div>
                      <div className="text-slate-400 text-[9px]">1.5M DH • Guéliz</div>
                    </div>
                    <div className="p-1.5 rounded bg-[#07131D] text-[10px]">
                      <div className="font-bold truncate text-white">Nadia B.</div>
                      <div className="text-slate-400 text-[9px]">900K DH • Hivernage</div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-[#132B3A] p-2 border-t-2 border-[#06B6D4]">
                    <div className="flex justify-between font-bold text-[11px] mb-1.5">
                      <span className="text-[#06B6D4]">Contacté</span>
                      <span className="text-slate-400">28</span>
                    </div>
                    <div className="p-1.5 rounded bg-[#07131D] mb-1.5 text-[10px]">
                      <div className="font-bold truncate text-white">Samir Alami</div>
                      <div className="text-[#06B6D4] text-[9px]">WhatsApp envoyé</div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-[#132B3A] p-2 border-t-2 border-[#58B52A]">
                    <div className="flex justify-between font-bold text-[11px] mb-1.5">
                      <span className="text-[#58B52A]">Qualifié</span>
                      <span className="text-slate-400">19</span>
                    </div>
                    <div className="p-1.5 rounded bg-[#07131D] mb-1.5 text-[10px]">
                      <div className="font-bold truncate text-white">Youssef A.</div>
                      <div className="text-[#58B52A] font-bold text-[9px]">Budget OK • 1.8M</div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-[#132B3A] p-2 border-t-2 border-[#8B5CF6]">
                    <div className="flex justify-between font-bold text-[11px] mb-1.5">
                      <span className="text-[#8B5CF6]">Visite</span>
                      <span className="text-slate-400">14</span>
                    </div>
                    <div className="p-1.5 rounded bg-[#07131D] mb-1.5 text-[10px]">
                      <div className="font-bold truncate text-white">Omar Fassi</div>
                      <div className="text-[#8B5CF6] font-bold text-[9px]">Demain 16:00</div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-[#132B3A] p-2 border-t-2 border-[#F59E0B]">
                    <div className="flex justify-between font-bold text-[11px] mb-1.5">
                      <span className="text-[#F59E0B]">Négo</span>
                      <span className="text-slate-400">9</span>
                    </div>
                    <div className="p-1.5 rounded bg-[#07131D] mb-1.5 text-[10px]">
                      <div className="font-bold truncate text-white">Driss M.</div>
                      <div className="text-[#F59E0B] text-[9px]">Offre soumise</div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-[#132B3A] p-2 border-t-2 border-[#16A34A]">
                    <div className="flex justify-between font-bold text-[11px] mb-1.5">
                      <span className="text-[#16A34A]">Gagné</span>
                      <span className="text-slate-400">26</span>
                    </div>
                    <div className="p-1.5 rounded bg-[#07131D] mb-1.5 text-[10px]">
                      <div className="font-bold truncate text-white">Villa Palmeraie</div>
                      <div className="text-[#16A34A] font-bold text-[9px]">Vendu ✓ 4.2M DH</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right column: Source breakdown & live follow-up (4 cols) */}
            <div className="lg:col-span-4 space-y-4">

              {/* Source breakdown chart mockup */}
              <div className="rounded-xl bg-[#0D1F2D] p-4 border border-[#213A49]">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
                  Provenance des Leads
                </div>
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between mb-1 text-[11px]">
                      <span className="font-medium text-slate-300">Meta Ads (Facebook / Insta)</span>
                      <span className="font-bold text-[#58B52A]">58% (74)</span>
                    </div>
                    <div className="h-2 rounded-full bg-[#132B3A] overflow-hidden">
                      <div className="h-full bg-[#58B52A] rounded-full" style={{ width: '58%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1 text-[11px]">
                      <span className="font-medium text-slate-300">WhatsApp Direct</span>
                      <span className="font-bold text-[#25D366]">24% (31)</span>
                    </div>
                    <div className="h-2 rounded-full bg-[#132B3A] overflow-hidden">
                      <div className="h-full bg-[#25D366] rounded-full" style={{ width: '24%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1 text-[11px]">
                      <span className="font-medium text-slate-300">Site Agence & Portails</span>
                      <span className="font-bold text-[#3B82F6]">18% (23)</span>
                    </div>
                    <div className="h-2 rounded-full bg-[#132B3A] overflow-hidden">
                      <div className="h-full bg-[#3B82F6] rounded-full" style={{ width: '18%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Today's follow-up reminders widget preview */}
              <div className="rounded-xl bg-[#0D1F2D] p-4 border border-[#213A49]">
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="font-bold uppercase tracking-wider text-[#F59E0B]">À relancer aujourd'hui</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#F59E0B]/20 text-[#F59E0B] text-[10px] font-bold">8 leads</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2 rounded-lg bg-[#07131D] border border-[#213A49] flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white text-[11px]">Youssef A.</div>
                      <div className="text-[10px] text-slate-400">Appart Guéliz • 14:30</div>
                    </div>
                    <span className="px-2 py-1 rounded bg-[#58B52A] text-white text-[10px] font-bold">
                      WhatsApp
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#07131D] border border-[#213A49] flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white text-[11px]">Sara M.</div>
                      <div className="text-[10px] text-[#DC3545] font-semibold">En retard • 1 jour</div>
                    </div>
                    <span className="px-2 py-1 rounded bg-[#DC3545]/20 text-[#DC3545] border border-[#DC3545]/40 text-[10px] font-bold">
                      Rappeler
                    </span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* 6 Annotations Grid around the product */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {annotations.map((item, idx) => {
            const Icon = item.icon
            return (
              <div
                key={idx}
                className="rounded-xl bg-[#0D1F2D] p-5 border border-[#213A49] hover:border-[#58B52A]/50 transition-colors"
              >
                <div className="flex items-center gap-3 mb-2.5">
                  <div
                    className="p-2 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${item.color}20`, color: item.color }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">{item.title}</h3>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{item.desc}</p>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
