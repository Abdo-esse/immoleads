'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, CheckCircle2, MessageSquare, Phone, TrendingUp, Calendar, Users, Eye, Sparkles, Building2, Check, ArrowDown } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#F8FAFC] dark:bg-[#07131D] pt-8 pb-20 lg:pt-14 lg:pb-32 border-b border-[#E2E8F0] dark:border-[#193646]">
      {/* Background subtle mesh glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none opacity-40 dark:opacity-20">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#58B52A]/15 rounded-full blur-3xl" />
        <div className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-[#0F2A3D]/10 dark:bg-[#65C832]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left Column: Offer understanding in 3 seconds */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#58B52A]/30 bg-[#ECF8E7] dark:bg-[#15351C] text-[#2E7D17] dark:text-[#65C832] text-xs sm:text-sm font-semibold mb-6 shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-[#58B52A] animate-pulse" />
              Solution conçue pour les agences immobilières
            </div>

            {/* Headline */}
            <div className="relative mb-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[2.75rem] xl:text-[3.1rem] font-extrabold text-[#0F2A3D] dark:text-[#F8FAFC] tracking-tight leading-[1.15]">
                Transformez vos prospects immobiliers{' '}
                <span className="relative inline-block text-[#58B52A] dark:text-[#65C832]">
                  en visites organisées.
                  <svg className="absolute -bottom-2 left-0 w-full h-2.5 text-[#58B52A]/40" viewBox="0 0 200 8" fill="none" preserveAspectRatio="none">
                    <path d="M0 6C50 1 150 1 200 6" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>

              {/* Brush note annotation */}
              <div className="hidden sm:inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-md bg-[#FFF7ED] dark:bg-[#2D1F0D] border border-[#FDBA74] text-[#C2410C] dark:text-[#FDBA74] text-xs font-bold rotate-[-1deg] shadow-xs">
                <Sparkles className="h-3.5 w-3.5 text-[#F97316]" />
                Plus de visites, plus de mandats signés !
              </div>
            </div>

            {/* Subtitle / Core transformation */}
            <p className="text-base sm:text-lg text-[#64748B] dark:text-[#A8B6C3] leading-relaxed mb-8 max-w-xl">
              <strong className="font-semibold text-[#102A3A] dark:text-white">ATLORYX ImmoLeads</strong> centralise vos leads publicitaires, facilite leur qualification immédiate et aide votre équipe à suivre chaque opportunité jusqu’à la visite physique.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto mb-8">
              <a
                href="#demo"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#58B52A] hover:bg-[#46951F] text-white font-bold text-base shadow-lg shadow-[#58B52A]/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Demander une démo</span>
                <ArrowRight className="h-4 w-4" />
              </a>

              <a
                href="#comment-ca-marche"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-[#E2E8F0] dark:border-[#213A49] bg-white dark:bg-[#0D1F2D] hover:bg-[#F1F5F9] dark:hover:bg-[#193646] text-[#0F2A3D] dark:text-[#F8FAFC] font-semibold text-base transition-colors"
              >
                <span>Voir comment ça marche</span>
                <ArrowDown className="h-4 w-4 text-[#64748B]" />
              </a>
            </div>

            {/* Trust elements */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full border-t border-[#E2E8F0] dark:border-[#193646] pt-6">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-[#102A3A] dark:text-[#A8B6C3]">
                <CheckCircle2 className="h-4 w-4 text-[#58B52A] shrink-0" />
                <span>Installation personnalisée</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-[#102A3A] dark:text-[#A8B6C3]">
                <CheckCircle2 className="h-4 w-4 text-[#58B52A] shrink-0" />
                <span>Accompagnement ATLORYX</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-[#102A3A] dark:text-[#A8B6C3]">
                <CheckCircle2 className="h-4 w-4 text-[#58B52A] shrink-0" />
                <span>Conçu pour le Maroc</span>
              </div>
            </div>

          </div>

          {/* Right Column: Real Product Mockup (Laptop Dashboard + Phone WhatsApp) */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">

              {/* Laptop frame */}
              <div className="relative rounded-2xl bg-[#0F2A3D] p-2 sm:p-3.5 shadow-2xl shadow-[#0F2A3D]/25 border border-[#213A49]">

                {/* Laptop Camera dot and top bar */}
                <div className="flex items-center justify-between pb-2 px-2 border-b border-[#213A49]/60">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#DC3545]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#58B52A]" />
                  </div>
                  <div className="flex items-center gap-2 px-3 py-0.5 rounded-md bg-[#07131D] text-[10px] font-mono text-[#94A3B8]">
                    <span>app.immoleads.ma/dashboard</span>
                  </div>
                  <div className="w-10" />
                </div>

                {/* Dashboard screen mockup */}
                <div className="rounded-lg bg-white dark:bg-[#0D1F2D] p-3 sm:p-4 text-[#102A3A] dark:text-[#F8FAFC] overflow-hidden text-xs">

                  {/* Dashboard top header */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] dark:border-[#213A49] mb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded bg-[#58B52A] flex items-center justify-center font-bold text-white text-xs">
                        A
                      </div>
                      <span className="font-bold text-sm tracking-tight text-[#0F2A3D] dark:text-white">ATLORYX ImmoLeads</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#ECF8E7] text-[#2E7D17] dark:bg-[#15351C] dark:text-[#65C832]">Agence Atlas</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#64748B]">
                      <span className="flex h-2 w-2 rounded-full bg-[#58B52A]" />
                      <span>Direct Live</span>
                    </div>
                  </div>

                  {/* 4 Stats Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 mb-3">
                    <div className="p-2 rounded-lg bg-[#F8FAFC] dark:bg-[#132B3A] border border-[#E2E8F0] dark:border-[#213A49]">
                      <div className="text-[10px] text-[#64748B] font-medium">Nouveaux</div>
                      <div className="text-sm sm:text-base font-bold text-[#3B82F6]">128</div>
                      <div className="text-[9px] text-[#58B52A] font-semibold">+18% sem.</div>
                    </div>
                    <div className="p-2 rounded-lg bg-[#F8FAFC] dark:bg-[#132B3A] border border-[#E2E8F0] dark:border-[#213A49]">
                      <div className="text-[10px] text-[#64748B] font-medium">Qualifiés</div>
                      <div className="text-sm sm:text-base font-bold text-[#58B52A]">64</div>
                      <div className="text-[9px] text-[#64748B]">Budget validé</div>
                    </div>
                    <div className="p-2 rounded-lg bg-[#F8FAFC] dark:bg-[#132B3A] border border-[#E2E8F0] dark:border-[#213A49]">
                      <div className="text-[10px] text-[#64748B] font-medium">Visites</div>
                      <div className="text-sm sm:text-base font-bold text-[#8B5CF6]">24</div>
                      <div className="text-[9px] text-[#8B5CF6] font-semibold">12 cette sem.</div>
                    </div>
                    <div className="p-2 rounded-lg bg-[#F8FAFC] dark:bg-[#132B3A] border border-[#E2E8F0] dark:border-[#213A49]">
                      <div className="text-[10px] text-[#64748B] font-medium">Conversion</div>
                      <div className="text-sm sm:text-base font-bold text-[#F59E0B]">38%</div>
                      <div className="text-[9px] text-[#58B52A] font-semibold">Excellente</div>
                    </div>
                  </div>

                  {/* Mini pipeline visualization */}
                  <div className="rounded-lg bg-[#F1F5F9] dark:bg-[#132B3A] p-2.5 mb-3 border border-[#E2E8F0] dark:border-[#213A49]">
                    <div className="flex items-center justify-between text-[11px] font-semibold mb-1.5 text-[#0F2A3D] dark:text-[#F8FAFC]">
                      <span>Pipeline d'acquisition</span>
                      <span className="text-[10px] text-[#58B52A]">Flux continu</span>
                    </div>
                    <div className="flex items-center gap-1 text-[9px] font-semibold overflow-x-auto">
                      <div className="flex-1 py-1 rounded text-center bg-[#3B82F6]/15 text-[#2563EB] border border-[#3B82F6]/30">Nouveau (32)</div>
                      <div className="flex-1 py-1 rounded text-center bg-[#06B6D4]/15 text-[#0891B2] border border-[#06B6D4]/30">Contacté (28)</div>
                      <div className="flex-1 py-1 rounded text-center bg-[#58B52A]/15 text-[#2E7D17] border border-[#58B52A]/30">Qualifié (19)</div>
                      <div className="flex-1 py-1 rounded text-center bg-[#8B5CF6]/15 text-[#7C3AED] border border-[#8B5CF6]/30">Visite (12)</div>
                    </div>
                  </div>

                  {/* Leads table preview */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-bold text-[#64748B] uppercase px-1">
                      <span>Prospect récent</span>
                      <span className="hidden sm:inline">Bien / Intention</span>
                      <span>Action requise</span>
                    </div>

                    {/* Lead 1 */}
                    <div className="flex items-center justify-between p-1.5 rounded bg-white dark:bg-[#07131D] border border-[#E2E8F0] dark:border-[#213A49]">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-[#ECF8E7] text-[#58B52A] font-bold flex items-center justify-center text-[10px]">
                          YA
                        </div>
                        <div>
                          <div className="font-bold text-[11px] text-[#0F2A3D] dark:text-white">Youssef Amrani</div>
                          <div className="text-[9px] text-[#64748B]">Meta Ads • Il y a 12 min</div>
                        </div>
                      </div>
                      <div className="text-[10px] hidden sm:block">
                        <span className="font-medium">Appart T3 Guéliz</span>
                        <span className="block text-[9px] text-[#58B52A]">1.8M DH</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#58B52A] text-white">
                        Planifier Visite
                      </span>
                    </div>

                    {/* Lead 2 */}
                    <div className="flex items-center justify-between p-1.5 rounded bg-white dark:bg-[#07131D] border border-[#E2E8F0] dark:border-[#213A49]">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-[#EFF6FF] text-[#3B82F6] font-bold flex items-center justify-center text-[10px]">
                          SM
                        </div>
                        <div>
                          <div className="font-bold text-[11px] text-[#0F2A3D] dark:text-white">Sara Mansouri</div>
                          <div className="text-[9px] text-[#64748B]">WhatsApp • Il y a 34 min</div>
                        </div>
                      </div>
                      <div className="text-[10px] hidden sm:block">
                        <span className="font-medium">Villa Route Casa</span>
                        <span className="block text-[9px] text-[#58B52A]">3.5M DH</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#ECF8E7] text-[#2E7D17]">
                        Relance 14:30
                      </span>
                    </div>

                  </div>

                </div>

                {/* Laptop base */}
                <div className="h-2 w-full bg-[#1E3A4C] rounded-b-xl mt-1 border-t border-[#213A49]" />
              </div>

              {/* Overlapping Smartphone frame with real WhatsApp chat */}
              <div className="hidden sm:block absolute -bottom-8 -right-4 sm:-right-6 w-56 sm:w-64 rounded-3xl bg-[#0F2A3D] p-2.5 shadow-2xl border-2 border-[#213A49] z-10 backdrop-blur-md">

                {/* Phone speaker notch */}
                <div className="mx-auto w-16 h-3 bg-[#07131D] rounded-full mb-2 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#1F2937]" />
                </div>

                {/* WhatsApp Chat screen */}
                <div className="rounded-2xl bg-[#EFEAE2] dark:bg-[#0B141A] p-2.5 text-[11px] text-[#111B21] dark:text-[#E9EDEF] shadow-inner font-sans">

                  {/* WhatsApp contact header */}
                  <div className="flex items-center gap-2 pb-2 border-b border-black/10 dark:border-white/10 mb-2">
                    <div className="h-6 w-6 rounded-full bg-[#58B52A] text-white flex items-center justify-center font-bold text-[9px]">
                      AL
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-[10px] truncate text-[#0F2A3D] dark:text-white">Agence Atlas Immobilier</div>
                      <div className="text-[8px] text-[#58B52A]">En ligne</div>
                    </div>
                    <Phone className="h-3 w-3 text-[#58B52A]" />
                  </div>

                  {/* Chat Bubbles */}
                  <div className="space-y-1.5 text-[10px]">

                    {/* Incoming prospect message */}
                    <div className="rounded-lg rounded-tl-none bg-white dark:bg-[#202C33] p-2 shadow-xs max-w-[90%]">
                      <p className="leading-tight">
                        Bonjour, je suis intéressé par l'appartement à Guéliz (Réf: GZ-402).
                      </p>
                      <div className="text-[8px] text-gray-400 text-right mt-0.5">14:28</div>
                    </div>

                    {/* Bot / Agent automated qualified message */}
                    <div className="rounded-lg rounded-tr-none bg-[#D9FDD3] dark:bg-[#005C4B] p-2 shadow-xs ml-auto max-w-[92%] text-[#111B21] dark:text-[#E9EDEF]">
                      <p className="font-semibold text-[9px] text-[#075E54] dark:text-[#25D366] mb-0.5">
                        Dossier qualifié par ImmoLeads ✓
                      </p>
                      <p className="leading-tight">
                        Parfait Youssef ! Votre budget (1.8M DH) est validé. Une visite est possible demain à 16h00. Cela vous convient ?
                      </p>
                      <div className="text-[8px] text-gray-500 dark:text-gray-300 text-right mt-0.5">14:29 ✓✓</div>
                    </div>

                    {/* Prospect confirmation */}
                    <div className="rounded-lg rounded-tl-none bg-white dark:bg-[#202C33] p-1.5 shadow-xs max-w-[85%]">
                      <p className="leading-tight font-medium text-[#58B52A]">
                        Oui, parfait pour demain 16h !
                      </p>
                      <div className="text-[8px] text-gray-400 text-right mt-0.5">14:30</div>
                    </div>

                  </div>

                  {/* Visit created notification banner */}
                  <div className="mt-2 p-1 rounded bg-[#58B52A] text-white text-[8px] font-bold text-center">
                    Visite confirmée & synchronisée dans le CRM
                  </div>

                </div>

                {/* Home bar */}
                <div className="mx-auto w-20 h-1 bg-[#475569] rounded-full mt-2" />
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
