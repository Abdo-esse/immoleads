'use client'

import { ArrowRight, Check, Sparkles, Megaphone, Home, FileText, MessageSquare, LayoutDashboard, CalendarCheck } from 'lucide-react'

export function HowItWorksSection() {
  const steps = [
    {
      num: '01',
      tag: 'Meta Ads',
      title: 'Publicité',
      desc: 'Le prospect découvre votre bien sponsorisé sur Facebook, Instagram ou Google Ads.',
      color: '#3B82F6',
      icon: Megaphone,
      preview: (
        <div className="rounded-lg bg-white dark:bg-[#07131D] p-2.5 border border-[#E2E8F0] dark:border-[#213A49] shadow-inner text-[10px]">
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="w-3.5 h-3.5 rounded-full bg-[#1877F2] text-white flex items-center justify-center font-bold text-[8px]">f</div>
            <span className="font-bold text-[10px] text-[#0F2A3D] dark:text-white">Agence Atlas</span>
            <span className="text-[8px] text-[#94A3B8]">• Sponsorisé</span>
          </div>
          <div className="h-14 rounded bg-gradient-to-tr from-slate-300 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center text-[10px] font-semibold text-slate-600 dark:text-slate-300 relative overflow-hidden mb-1.5">
            <div className="absolute top-1 right-1 px-1 py-0.5 rounded bg-[#58B52A] text-white text-[8px] font-bold">1.8M DH</div>
            <span>Villa & Piscine Guéliz</span>
          </div>
          <div className="flex items-center justify-between text-[9px]">
            <span className="font-semibold text-[#0F2A3D] dark:text-white">Découvrir le projet</span>
            <span className="px-1.5 py-0.5 rounded bg-[#1877F2] text-white font-bold">Voir plus</span>
          </div>
        </div>
      ),
    },
    {
      num: '02',
      tag: 'Page Immobilière',
      title: 'Page du bien',
      desc: 'Il consulte photos HD, vidéo, prix, localisation précise et caractéristiques clés.',
      color: '#06B6D4',
      icon: Home,
      preview: (
        <div className="rounded-lg bg-white dark:bg-[#07131D] p-2.5 border border-[#E2E8F0] dark:border-[#213A49] shadow-inner text-[10px]">
          <div className="flex items-center justify-between mb-1 text-[9px] text-[#64748B]">
            <span className="font-bold text-[#0F2A3D] dark:text-white">Réf: GZ-402</span>
            <span className="text-[#58B52A] font-bold">Disponible</span>
          </div>
          <div className="h-10 rounded bg-[#F1F5F9] dark:bg-[#132B3A] p-1.5 mb-1.5">
            <div className="font-bold text-[10px] text-[#0F2A3D] dark:text-white">Appartement T3 • 112 m²</div>
            <div className="text-[8px] text-[#64748B]">3 Chambres • 2 SDB • Terrasse</div>
          </div>
          <div className="flex items-center gap-1 text-[8px]">
            <span className="px-1 py-0.5 rounded bg-[#ECF8E7] text-[#2E7D17] font-semibold">Guéliz</span>
            <span className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">Ascenseur</span>
            <span className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">Garage</span>
          </div>
        </div>
      ),
    },
    {
      num: '03',
      tag: 'Prospect Qualifié',
      title: 'Qualification',
      desc: 'Un formulaire court filtre immédiatement : numéro WhatsApp, budget et délai d’achat.',
      color: '#58B52A',
      icon: FileText,
      preview: (
        <div className="rounded-lg bg-white dark:bg-[#07131D] p-2.5 border border-[#E2E8F0] dark:border-[#213A49] shadow-inner text-[10px] space-y-1">
          <div className="text-[9px] font-bold text-[#58B52A]">Formulaire ultra-court</div>
          <div className="p-1 rounded bg-[#F8FAFC] dark:bg-[#132B3A] border border-[#E2E8F0] dark:border-[#213A49] text-[9px] flex justify-between">
            <span className="text-gray-400">WhatsApp:</span>
            <span className="font-mono font-medium">+212 661...</span>
          </div>
          <div className="p-1 rounded bg-[#F8FAFC] dark:bg-[#132B3A] border border-[#E2E8F0] dark:border-[#213A49] text-[9px] flex justify-between">
            <span className="text-gray-400">Budget:</span>
            <span className="font-bold text-[#58B52A]">1.5M - 2M DH</span>
          </div>
          <div className="p-1 rounded bg-[#F8FAFC] dark:bg-[#132B3A] border border-[#E2E8F0] dark:border-[#213A49] text-[9px] flex justify-between">
            <span className="text-gray-400">Délai:</span>
            <span className="font-medium">&lt; 1 mois</span>
          </div>
        </div>
      ),
    },
    {
      num: '04',
      tag: 'Conversation',
      title: 'WhatsApp',
      desc: 'Le prospect poursuit l’échange en 1 clic avec son besoin déjà formalisé.',
      color: '#25D366',
      icon: MessageSquare,
      preview: (
        <div className="rounded-lg bg-[#EFEAE2] dark:bg-[#0B141A] p-2 border border-black/10 dark:border-white/10 shadow-inner text-[10px]">
          <div className="rounded bg-white dark:bg-[#202C33] p-1.5 shadow-xs mb-1 text-[9px]">
            <p className="font-medium text-[#111B21] dark:text-[#E9EDEF]">
              « Bonjour, je souhaite visiter l’appartement Guéliz. Mon budget est de 1.8M DH. »
            </p>
          </div>
          <div className="rounded bg-[#D9FDD3] dark:bg-[#005C4B] p-1.5 shadow-xs ml-auto text-[9px] text-[#111B21] dark:text-[#E9EDEF]">
            <p className="font-medium">
              « Bonjour ! Notre agent Omar vous contacte pour bloquer votre créneau. »
            </p>
          </div>
        </div>
      ),
    },
    {
      num: '05',
      tag: 'Suivi Commercial',
      title: 'ImmoLeads CRM',
      desc: 'Le lead arrive instantanément dans le pipeline de votre équipe avec rappel planifié.',
      color: '#8B5CF6',
      icon: LayoutDashboard,
      preview: (
        <div className="rounded-lg bg-white dark:bg-[#07131D] p-2.5 border border-[#E2E8F0] dark:border-[#213A49] shadow-inner text-[10px] space-y-1">
          <div className="flex items-center justify-between text-[9px]">
            <span className="font-bold text-[#0F2A3D] dark:text-white">Youssef Amrani</span>
            <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-[#8B5CF6] text-white">QUALIFIÉ</span>
          </div>
          <div className="text-[8px] text-[#64748B]">Assigné à: <strong className="text-[#102A3A] dark:text-white">Omar B. (Agent)</strong></div>
          <div className="flex items-center gap-1 text-[8px] text-[#F59E0B] font-semibold bg-[#FFFBEB] dark:bg-[#261B07] p-1 rounded">
            <span>⏰ Rappel programmé: 14:30</span>
          </div>
        </div>
      ),
    },
    {
      num: '06',
      tag: 'Visite Réalisée',
      title: 'Visite',
      desc: 'L’agent réalise la visite physique du bien avec un prospect prêt à acheter.',
      color: '#16A34A',
      icon: CalendarCheck,
      preview: (
        <div className="rounded-lg bg-[#ECF8E7] dark:bg-[#15351C] p-2.5 border border-[#58B52A]/40 shadow-inner text-[10px] text-center space-y-1">
          <div className="inline-flex items-center gap-1 text-[9px] font-bold text-[#2E7D17] dark:text-[#65C832]">
            <Check className="h-3.5 w-3.5" /> Visite confirmée
          </div>
          <div className="font-bold text-[11px] text-[#0F2A3D] dark:text-white">Demain à 16:00</div>
          <div className="text-[8px] text-[#64748B] dark:text-[#A8B6C3]">Sur place avec le propriétaire</div>
          <div className="text-[9px] font-bold text-[#16A34A] pt-0.5">Statut: Prêt pour offre ✓</div>
        </div>
      ),
    },
  ]

  return (
    <section id="comment-ca-marche" className="relative py-20 lg:py-28 bg-[#F8FAFC] dark:bg-[#07131D] border-b border-[#E2E8F0] dark:border-[#193646]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#58B52A]/30 bg-[#ECF8E7] dark:bg-[#15351C] text-[#2E7D17] dark:text-[#65C832] text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            Un parcours commercial fluide
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F2A3D] dark:text-[#F8FAFC] tracking-tight mb-4">
            Du clic à la visite, dans un seul parcours.
          </h2>
          <p className="text-base sm:text-lg text-[#64748B] dark:text-[#A8B6C3]">
            Fini le chaos des messages perdus. ImmoLeads relie chaque étape de votre acquisition pour maximiser le taux de visite.
          </p>
        </div>

        {/* 6 Steps Grid with Flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-12">
          {steps.map((step, idx) => {
            const Icon = step.icon
            return (
              <div
                key={step.num}
                className="relative flex flex-col rounded-2xl bg-white dark:bg-[#0D1F2D] p-4 border border-[#E2E8F0] dark:border-[#213A49] shadow-xs hover:shadow-md transition-all hover:-translate-y-1"
              >
                {/* Step header */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black font-mono text-[#58B52A] dark:text-[#65C832]">
                    {step.num}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#F1F5F9] dark:bg-[#132B3A] text-[#475569] dark:text-[#94A3B8]">
                    {step.tag}
                  </span>
                </div>

                {/* Title & Icon */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-lg bg-[#F8FAFC] dark:bg-[#132B3A] border border-[#E2E8F0] dark:border-[#213A49]">
                    <Icon className="h-4 w-4 text-[#0F2A3D] dark:text-white" />
                  </div>
                  <h3 className="font-bold text-sm text-[#0F2A3D] dark:text-white">
                    {step.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-[11px] text-[#64748B] dark:text-[#A8B6C3] leading-relaxed mb-4 flex-1">
                  {step.desc}
                </p>

                {/* Realistic Mini UI Preview */}
                <div className="mt-auto pt-2 border-t border-[#F1F5F9] dark:border-[#213A49]">
                  {step.preview}
                </div>
              </div>
            )
          })}
        </div>

        {/* Continuous Horizontal Flow Ribbon */}
        <div className="rounded-2xl bg-[#0F2A3D] p-4 sm:p-5 border border-[#213A49] text-white">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm font-bold tracking-tight text-center">
            <span className="text-slate-300">Publicité</span>
            <span className="text-[#58B52A]">→</span>
            <span className="text-slate-300">Bien</span>
            <span className="text-[#58B52A]">→</span>
            <span className="text-slate-300">Formulaire</span>
            <span className="text-[#58B52A]">→</span>
            <span className="text-slate-300">WhatsApp</span>
            <span className="text-[#58B52A]">→</span>
            <span className="text-slate-300">CRM</span>
            <span className="text-[#58B52A]">→</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#58B52A] text-white font-extrabold shadow-sm">
              Visite Programmée ✓
            </span>
          </div>
        </div>

      </div>
    </section>
  )
}
