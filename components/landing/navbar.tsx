'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, LogIn, Menu, X } from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Accueil', isExternal: false },
  { href: '#comment-ca-marche', label: 'Comment ça marche', isExternal: true },
  { href: '#produit', label: 'Dashboard', isExternal: true },
  { href: '#fonctionnalites', label: 'Fonctionnalités', isExternal: true },
  { href: '#pour-qui', label: 'Pour qui ?', isExternal: true },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
    <header className="sticky top-0 z-50 w-full border-b border-[#E2E8F0] dark:border-[#193646] bg-white/90 dark:bg-[#07131D]/90 backdrop-blur-md">
      <nav className="mx-auto flex h-16 sm:h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
          <div className="relative h-9 w-9 sm:h-11 sm:w-11 rounded-xl overflow-hidden shadow-xs shrink-0 border border-[#E2E8F0] dark:border-[#213A49] transition-transform group-hover:scale-105">
            <Image
              src="/images/logo/favicon.png"
              alt="ATLORYX ImmoLeads"
              width={44}
              height={44}
              className="object-cover h-full w-full"
              priority
            />
          </div>
          <div className="flex flex-col justify-center text-left">
            <span className="text-xs sm:text-sm font-black tracking-widest text-[#0F2A3D] dark:text-white uppercase leading-none">
              ATLORYX
            </span>
            <span className="text-sm sm:text-base font-extrabold tracking-tight text-[#58B52A] leading-tight mt-0.5">
              ImmoLeads
            </span>
            <span className="hidden sm:block text-[9px] sm:text-[10px] font-semibold text-[#64748B] dark:text-[#A8B6C3] leading-none mt-0.5">
              Du clic à la visite
            </span>
          </div>
        </Link>

        {/* Desktop Nav links */}
        <div className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) =>
            link.isExternal ? (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-[#64748B] dark:text-[#A8B6C3] transition-colors hover:text-[#0F2A3D] dark:hover:text-white"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-[#102A3A] dark:text-white transition-colors hover:text-[#58B52A]"
              >
                {link.label}
              </Link>
            )
          )}
        </div>

        {/* Right Action buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* CRM login — hide on very small screens */}
          <Link
            href="/login"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-bold text-[#0F2A3D] dark:text-white hover:text-[#58B52A] transition-colors"
          >
            <LogIn className="h-4 w-4 text-[#64748B]" />
            <span>Connexion CRM</span>
          </Link>

          {/* Démo CTA — always visible */}
          <a
            href="#demo"
            className="inline-flex h-9 sm:h-10 items-center justify-center gap-1.5 sm:gap-2 rounded-xl bg-[#58B52A] hover:bg-[#46951F] px-3 sm:px-5 text-xs sm:text-sm font-extrabold text-white shadow-md shadow-[#58B52A]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="hidden xs:inline">Demander une</span>
            <span>Démo</span>
            <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden flex items-center justify-center h-9 w-9 rounded-lg border border-[#E2E8F0] dark:border-[#213A49] hover:bg-[#F1F5F9] dark:hover:bg-[#193646] transition-colors"
            aria-label="Menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5 text-[#0F2A3D] dark:text-white" />
            ) : (
              <Menu className="h-5 w-5 text-[#0F2A3D] dark:text-white" />
            )}
          </button>
        </div>
      </nav>
    </header>

      {/* Mobile Drawer — rendered outside header to avoid stacking context issues */}
      {mobileOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-[60] bg-black/40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 right-0 z-[70] w-72 max-w-[85vw] bg-white dark:bg-[#0D1F2D] border-l border-[#E2E8F0] dark:border-[#213A49] shadow-2xl lg:hidden flex flex-col animate-in slide-in-from-right duration-200">

            {/* Drawer Header */}
            <div className="flex items-center justify-between h-16 px-5 border-b border-[#E2E8F0] dark:border-[#213A49]">
              <span className="font-bold text-[#0F2A3D] dark:text-white">Menu</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center h-8 w-8 rounded-lg hover:bg-[#F1F5F9] dark:hover:bg-[#193646] transition-colors"
              >
                <X className="h-5 w-5 text-[#64748B]" />
              </button>
            </div>

            {/* Drawer Nav Links */}
            <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
              {navLinks.map((link) => {
                const Tag = link.isExternal ? 'a' : Link
                return (
                  <Tag
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[#102A3A] dark:text-[#F8FAFC] hover:bg-[#F1F5F9] dark:hover:bg-[#193646] transition-colors"
                  >
                    {link.label}
                  </Tag>
                )
              })}

              <div className="h-px bg-[#E2E8F0] dark:bg-[#213A49] my-3" />

              {/* CRM Login link in drawer */}
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[#0F2A3D] dark:text-white hover:bg-[#F1F5F9] dark:hover:bg-[#193646] transition-colors"
              >
                <LogIn className="h-4 w-4 text-[#64748B]" />
                Connexion CRM
              </Link>
            </nav>

            {/* Drawer Footer CTA */}
            <div className="p-4 border-t border-[#E2E8F0] dark:border-[#213A49]">
              <a
                href="#demo"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-[#58B52A] hover:bg-[#46951F] text-sm font-extrabold text-white shadow-md shadow-[#58B52A]/20 transition-all"
              >
                Demander une démo
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </>
      )}
    </>
  )
}
