'use client'

import { MessageSquare, ArrowRight } from 'lucide-react'

export function WhatsappStickyBar() {
  const whatsappUrl =
    'https://wa.me/212688062883?text=Bonjour%20ATLORYX,%20je%20souhaite%20d%C3%A9couvrir%20ImmoLeads%20pour%20mon%20agence%20immobili%C3%A8re.'

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-3 bg-white/95 dark:bg-[#07131D]/95 backdrop-blur-md border-t border-[#E2E8F0] dark:border-[#193646] sm:hidden shadow-2xl">
      <div className="flex items-center gap-2">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-[#58B52A] hover:bg-[#46951F] text-white font-extrabold text-sm shadow-lg shadow-[#58B52A]/30 active:scale-95 transition-all"
        >
          <div className="relative">
            <MessageSquare className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-white animate-ping" />
          </div>
          <span>Discuter sur WhatsApp</span>
        </a>

        <a
          href="#demo"
          className="px-3.5 py-3 rounded-xl border border-[#CBD5E1] dark:border-[#213A49] bg-[#F8FAFC] dark:bg-[#0D1F2D] text-[#0F2A3D] dark:text-white text-xs font-bold shrink-0"
        >
          Démo
        </a>
      </div>
    </div>
  )
}
