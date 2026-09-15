import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Phone, MessageSquare, ShieldCheck, LogIn, Sparkles } from 'lucide-react'
import { WhatsappStickyBar } from '@/components/landing/whatsapp-sticky-bar'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const currentYear = 2026

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC] dark:bg-[#07131D] text-[#102A3A] dark:text-[#F8FAFC] font-sans antialiased">

      {/* Top Banner: Solution agences */}
      <div className="bg-[#0F2A3D] text-white py-1.5 px-4 text-center text-xs font-medium border-b border-[#213A49]">
        <div className="mx-auto max-w-7xl flex items-center justify-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#58B52A] animate-pulse" />
          <span>Solution PropTech conçue pour les agences immobilières et promoteurs au Maroc.</span>
          <a href="#demo" className="hidden sm:inline-flex items-center gap-1 text-[#58B52A] font-bold hover:underline ml-1">
            Demander une démo <ArrowRight className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-[#E2E8F0] dark:border-[#193646] bg-white/90 dark:bg-[#07131D]/90 backdrop-blur-md">
        <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative h-9 w-9 rounded-xl overflow-hidden shadow-xs shrink-0 border border-[#E2E8F0] dark:border-[#213A49]">
              <Image
                src="/images/logo/favicon.png"
                alt="ATLORYX"
                width={36}
                height={36}
                className="object-cover h-full w-full"
                priority
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-black tracking-tight text-[#0F2A3D] dark:text-white leading-none">
                  ATLORYX
                </span>
                <span className="text-base sm:text-lg font-extrabold tracking-tight text-[#58B52A] leading-none">
                  ImmoLeads
                </span>
              </div>
              <span className="text-[9px] uppercase tracking-wider font-bold text-[#64748B] dark:text-[#A8B6C3] mt-0.5">
                Du clic à la visite
              </span>
            </div>
          </Link>

          {/* Nav links */}
          <div className="hidden lg:flex items-center gap-7">
            <Link
              href="/"
              className="text-sm font-semibold text-[#102A3A] dark:text-white transition-colors hover:text-[#58B52A]"
            >
              Accueil
            </Link>
            <a
              href="#comment-ca-marche"
              className="text-sm font-semibold text-[#64748B] dark:text-[#A8B6C3] transition-colors hover:text-[#0F2A3D] dark:hover:text-white"
            >
              Comment ça marche
            </a>
            <a
              href="#produit"
              className="text-sm font-semibold text-[#64748B] dark:text-[#A8B6C3] transition-colors hover:text-[#0F2A3D] dark:hover:text-white"
            >
              Dashboard
            </a>
            <a
              href="#fonctionnalites"
              className="text-sm font-semibold text-[#64748B] dark:text-[#A8B6C3] transition-colors hover:text-[#0F2A3D] dark:hover:text-white"
            >
              Fonctionnalités
            </a>
            <a
              href="#pour-qui"
              className="text-sm font-semibold text-[#64748B] dark:text-[#A8B6C3] transition-colors hover:text-[#0F2A3D] dark:hover:text-white"
            >
              Pour qui ?
            </a>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-bold text-[#0F2A3D] dark:text-white hover:text-[#58B52A] transition-colors"
            >
              <LogIn className="h-4 w-4 text-[#64748B]" />
              <span>Connexion CRM</span>
            </Link>

            <a
              href="#demo"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#58B52A] hover:bg-[#46951F] px-4 sm:px-5 text-xs sm:text-sm font-extrabold text-white shadow-md shadow-[#58B52A]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Demander une démo</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </nav>
      </header>

      {/* Main Page Body */}
      <main className="flex-1 pb-16 sm:pb-0">{children}</main>

      {/* Mobile Sticky WhatsApp Bar */}
      <WhatsappStickyBar />

      {/* Premium Footer */}
      <footer className="border-t border-[#213A49] bg-[#07131D] text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">

            {/* Brand column */}
            <div className="space-y-4 lg:col-span-2">
              <div className="flex items-center gap-2.5">
                <div className="relative h-8 w-8 rounded-lg overflow-hidden shadow-xs shrink-0 border border-[#213A49]">
                  <Image
                    src="/images/logo/favicon.png"
                    alt="ATLORYX"
                    width={32}
                    height={32}
                    className="object-cover h-full w-full"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-black tracking-tight text-white leading-none">
                    ATLORYX
                  </span>
                  <span className="text-base font-extrabold tracking-tight text-[#58B52A] leading-none">
                    ImmoLeads
                  </span>
                </div>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
                Solution PropTech d’acquisition et de suivi commercial pour agences immobilières. Du clic publicitaire à la visite organisée.
              </p>
              <div className="flex items-center gap-2 text-xs text-[#65C832] font-semibold">
                <span className="flex h-2 w-2 rounded-full bg-[#58B52A]" />
                Conçu et hébergé pour le marché immobilier marocain
              </div>
            </div>

            {/* Navigation links */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Navigation</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/" className="text-slate-300 hover:text-white transition-colors">
                    Accueil
                  </Link>
                </li>
                <li>
                  <a href="#comment-ca-marche" className="text-slate-300 hover:text-white transition-colors">
                    Comment ça marche
                  </a>
                </li>
                <li>
                  <a href="#produit" className="text-slate-300 hover:text-white transition-colors">
                    Dashboard & Pipeline
                  </a>
                </li>
                <li>
                  <a href="#fonctionnalites" className="text-slate-300 hover:text-white transition-colors">
                    Fonctionnalités
                  </a>
                </li>
                <li>
                  <a href="#pour-qui" className="text-slate-300 hover:text-white transition-colors">
                    Pour qui ?
                  </a>
                </li>
              </ul>
            </div>

            {/* Solution & Tech */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Solution</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#demo" className="text-slate-300 hover:text-white transition-colors">
                    Demande de démo
                  </a>
                </li>
                <li>
                  <Link href="/login" className="text-slate-300 hover:text-white transition-colors">
                    Accès Espace Agent
                  </Link>
                </li>
                <li>
                  <a
                    href="https://wa.me/212688062883"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#58B52A] hover:underline flex items-center gap-1 font-bold"
                  >
                    <MessageSquare className="h-3.5 w-3.5" /> Support WhatsApp
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Contact ATLORYX</h3>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-[#58B52A] shrink-0" />
                  +212 6 88 06 28 83
                </li>
                <li className="text-slate-400">
                  Marrakech • Casablanca • Rabat
                </li>
                <li className="pt-2">
                  <span className="inline-block px-2.5 py-1 rounded bg-[#0F2A3D] text-[#65C832] border border-[#213A49] text-[11px] font-semibold">
                    Accompagnement Dédié
                  </span>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom copyright */}
          <div className="mt-12 border-t border-[#193646] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>
              ATLORYX © {currentYear} • ImmoLeads. Tous droits réservés.
            </p>
            <div className="flex items-center gap-6">
              <span className="hover:text-white transition-colors cursor-pointer">Confidentialité</span>
              <span className="hover:text-white transition-colors cursor-pointer">Conditions</span>
              <a
                href="https://wa.me/212688062883"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
