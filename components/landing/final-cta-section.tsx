'use client'

import { MessageSquare, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react'

export function FinalCtaSection() {
  const whatsappUrl =
    'https://wa.me/212688062883?text=Bonjour%20ATLORYX,%20je%20souhaite%20d%C3%A9couvrir%20ImmoLeads%20pour%20mon%20agence%20immobili%C3%A8re.'

  return (
    <section className="relative py-20 lg:py-28 bg-[#0F2A3D] text-white overflow-hidden border-b border-[#213A49]">
      {/* Background glow and subtle dot grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#58B52A_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#58B52A]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#58B52A]/40 bg-[#58B52A]/15 text-[#65C832] text-xs font-bold uppercase tracking-wider mb-6">
          <Sparkles className="h-3.5 w-3.5" />
          Passez à l’action
        </div>

        {/* Headline */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4 max-w-3xl mx-auto leading-tight">
          Vos prochains leads vont arriver.{' '}
          <span className="text-[#58B52A] dark:text-[#65C832] block sm:inline">
            Êtes-vous prêt à bien les suivre ?
          </span>
        </h2>

        {/* Subtitle */}
        <p className="text-xl sm:text-2xl font-bold text-slate-300 mb-2">
          ATLORYX ImmoLeads
        </p>
        <p className="text-base sm:text-lg text-slate-400 mb-10">
          Du clic à la visite, dans un seul parcours.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-10">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-[#58B52A] hover:bg-[#46951F] text-white font-black text-base shadow-xl shadow-[#58B52A]/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <MessageSquare className="h-5 w-5" />
            <span>Demander une démo sur WhatsApp</span>
          </a>

          <a
            href="#demo"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold text-base transition-colors"
          >
            <span>Remplir le formulaire</span>
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        {/* Guarantees */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-[#58B52A]" />
            Mise en service rapide sous 48h
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-[#58B52A]" />
            Accompagnement humain dédié
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-[#58B52A]" />
            Sans engagement de durée
          </span>
        </div>

      </div>
    </section>
  )
}
