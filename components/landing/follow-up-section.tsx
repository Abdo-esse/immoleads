'use client'

import { Clock, CheckCircle2, MessageSquare, Phone, UserCheck, ShieldCheck, ArrowRight, History, Calendar } from 'lucide-react'

export function FollowUpSection() {
  const historyItems = [
    { label: 'Dernier contact', value: 'Aujourd’hui à 11:20 (par WhatsApp)' },
    { label: 'Prochaine relance', value: 'Aujourd’hui à 14:30 (Confirmé)' },
    { label: 'Agent responsable', value: 'Omar B. (Agent Senior)' },
    { label: 'Notes commerciales', value: '« Client prêt, financement accordé, recherche terrasse plein sud »' },
    { label: 'Bien recherché', value: 'Appartement T3 — Guéliz (Réf: GZ-402)' },
    { label: 'Budget validé', value: '1.800.000 DH à 2.200.000 DH' },
    { label: 'Historique complet', value: '3 échanges enregistrés • Lead créé il y a 2 jours' },
    { label: 'Visite programmée', value: 'Demain à 16h00 avec le propriétaire' },
  ]

  return (
    <section className="relative py-20 lg:py-28 bg-[#F8FAFC] dark:bg-[#07131D] border-b border-[#E2E8F0] dark:border-[#193646]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#58B52A]/30 bg-[#ECF8E7] dark:bg-[#15351C] text-[#2E7D17] dark:text-[#65C832] text-xs font-bold uppercase tracking-wider mb-4">
            <Clock className="h-3.5 w-3.5" />
            Le Différenciateur Clé
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F2A3D] dark:text-[#F8FAFC] tracking-tight mb-4">
            Ne laissez plus un prospect intéressé disparaître dans vos conversations.
          </h2>
          <p className="text-base sm:text-lg text-[#64748B] dark:text-[#A8B6C3]">
            En immobilier, 80% des ventes se concluent entre la 2ème et la 5ème relance. ImmoLeads donne à chaque agent son plan de relance quotidien sans effort mental.
          </p>
        </div>

        {/* 2 Columns: Left Reminder Widget + Right Lead History Folder */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: "À relancer aujourd'hui — 8" Widget */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="rounded-2xl bg-white dark:bg-[#0D1F2D] p-6 sm:p-7 border border-[#E2E8F0] dark:border-[#213A49] shadow-lg flex-1 flex flex-col">
              
              {/* Widget Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] dark:border-[#213A49] mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-[#FFFBEB] dark:bg-[#2A1D05] border border-[#FDE68A] dark:border-[#78350F] flex items-center justify-center text-[#D97706]">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#0F2A3D] dark:text-white">
                      À relancer aujourd’hui
                    </h3>
                    <div className="text-xs text-[#64748B] dark:text-[#A8B6C3]">Priorités du jour pour vos agents</div>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#ECF8E7] dark:bg-[#15351C] text-[#2E7D17] dark:text-[#65C832] font-black text-sm">
                  8
                </span>
              </div>

              {/* Cards List */}
              <div className="space-y-4 flex-1">
                
                {/* Lead 1 */}
                <div className="rounded-xl bg-[#F8FAFC] dark:bg-[#132B3A] p-4 border border-[#E2E8F0] dark:border-[#213A49] hover:border-[#58B52A]/40 transition-all">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-bold text-[#0F2A3D] dark:text-white text-base">Youssef A.</div>
                      <div className="text-xs text-[#64748B] dark:text-[#A8B6C3]">Appartement T3 — Guéliz</div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#ECF8E7] text-[#2E7D17] dark:bg-[#15351C] dark:text-[#65C832]">
                      Aujourd’hui • 14:30
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#E2E8F0] dark:border-[#213A49]">
                    <button className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#58B52A] hover:bg-[#46951F] text-white text-xs font-bold shadow-xs transition-colors">
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>WhatsApp direct</span>
                    </button>
                    <button className="inline-flex items-center justify-center gap-1 py-2 px-3 rounded-lg border border-[#E2E8F0] dark:border-[#213A49] bg-white dark:bg-[#0D1F2D] text-[#102A3A] dark:text-white text-xs font-semibold hover:bg-slate-50 dark:hover:bg-[#193646] transition-colors">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#58B52A]" />
                      <span>Contacté ✓</span>
                    </button>
                  </div>
                </div>

                {/* Lead 2 (Late) */}
                <div className="rounded-xl bg-[#FDF2F2] dark:bg-[#2A1517] p-4 border border-[#FCA5A5] dark:border-[#7F1D1D] transition-all">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-bold text-[#991B1B] dark:text-[#FCA5A5] text-base">Sara M.</div>
                      <div className="text-xs text-[#7F1D1D] dark:text-[#F87171]">Villa — Route de Casablanca</div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#DC3545] text-white">
                      En retard • 1 jour
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#FCA5A5]/40 dark:border-[#7F1D1D]">
                    <button className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#DC3545] hover:bg-[#B91C1C] text-white text-xs font-bold shadow-xs transition-colors">
                      <Phone className="h-3.5 w-3.5" />
                      <span>Relancer en priorité</span>
                    </button>
                  </div>
                </div>

                {/* Lead 3 */}
                <div className="rounded-xl bg-[#F8FAFC] dark:bg-[#132B3A] p-4 border border-[#E2E8F0] dark:border-[#213A49]">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-bold text-[#0F2A3D] dark:text-white text-base">Karim B.</div>
                      <div className="text-xs text-[#64748B] dark:text-[#A8B6C3]">Penthouse — Hivernage</div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#F1F5F9] dark:bg-[#1E3A4C] text-[#475569] dark:text-[#94A3B8]">
                      Demain • 10:00
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#E2E8F0] dark:border-[#213A49]">
                    <span className="text-[11px] text-[#64748B] dark:text-[#A8B6C3]">
                      Visite confirmée, préparer les clés
                    </span>
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* Right Column: "Chaque lead garde son historique" */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="rounded-2xl bg-white dark:bg-[#0D1F2D] p-6 sm:p-7 border border-[#E2E8F0] dark:border-[#213A49] shadow-lg flex-1 flex flex-col">
              
              <div className="flex items-center gap-2.5 pb-4 border-b border-[#E2E8F0] dark:border-[#213A49] mb-5">
                <div className="h-9 w-9 rounded-xl bg-[#ECF8E7] dark:bg-[#15351C] border border-[#58B52A]/30 flex items-center justify-center text-[#58B52A]">
                  <History className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-[#0F2A3D] dark:text-white">
                    Chaque lead garde son historique complet.
                  </h3>
                  <div className="text-xs text-[#64748B] dark:text-[#A8B6C3]">
                    Fini les pertes de mémoire quand un agent est absent ou en visite.
                  </div>
                </div>
              </div>

              {/* Checklist grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 flex-1">
                {historyItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#F8FAFC] dark:bg-[#132B3A] border border-[#E2E8F0] dark:border-[#213A49] flex items-start gap-3"
                  >
                    <div className="mt-0.5 rounded-full p-1 bg-[#ECF8E7] dark:bg-[#15351C] text-[#58B52A] shrink-0">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#0F2A3D] dark:text-white">
                        {item.label}
                      </div>
                      <div className="text-xs text-[#64748B] dark:text-[#A8B6C3] mt-0.5 leading-snug">
                        {item.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Value note */}
              <div className="mt-5 p-4 rounded-xl bg-[#0F2A3D] text-white flex items-center justify-between text-xs sm:text-sm">
                <span className="font-medium text-slate-200">
                  Transférez un prospect à un autre agent en 1 clic sans perdre une seule note.
                </span>
                <span className="font-bold text-[#58B52A] shrink-0 ml-3">100% traçable</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
