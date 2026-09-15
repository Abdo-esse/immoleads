'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { cn } from 'cn'
import { signOut } from '@/lib/actions/auth'
import type { Profile } from '@/types'
import {
  LayoutDashboard,
  Building2,
  Users,
  Inbox,
  Shield,
  ArrowLeftRight,
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
  Search,
  Loader2,
} from 'lucide-react'
import { useTheme } from 'next-themes'

interface AdminShellProps {
  children: React.ReactNode
  pendingCount?: number
  profile?: Profile | null
  userEmail?: string
}

export function AdminShell({
  children,
  pendingCount = 0,
  profile,
  userEmail = '',
}: AdminShellProps) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleSignOut = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoggingOut) return
    setIsLoggingOut(true)
    try {
      await signOut()
    } catch (err: any) {
      if (err?.message?.includes('NEXT_REDIRECT') || err?.digest?.includes('NEXT_REDIRECT')) {
        throw err
      }
      setIsLoggingOut(false)
    }
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  const navItems = [
    {
      href: '/admin',
      label: "Vue d'ensemble",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: '/admin/agencies',
      label: 'Agences',
      icon: Building2,
      exact: false,
    },
    {
      href: '/admin/users',
      label: 'Utilisateurs',
      icon: Users,
      exact: false,
    },
    {
      href: '/admin/demo-requests',
      label: 'Demandes de Démo',
      icon: Inbox,
      exact: false,
      badge: pendingCount > 0 ? pendingCount : null,
    },
  ]

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — fixed on desktop, slide-over drawer on mobile */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-sidebar transition-transform duration-200',
          'lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between border-b px-5">
          <Link href="/admin" prefetch={false} className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-base font-bold tracking-tight">
              ATLORYX <span className="text-primary">Admin</span>
            </span>
          </Link>
          <button
            className="rounded-md p-1 hover:bg-sidebar-accent lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge !== null && item.badge > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}

          <div className="pt-2 pb-1">
            <div className="h-px bg-border/60" />
          </div>

          {/* Switch to Agency CRM Dashboard */}
          <Link
            href="/dashboard"
            prefetch={false}
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
          >
            <ArrowLeftRight className="h-4 w-4 shrink-0 text-primary" />
            <div className="flex flex-col">
              <span>Espace Agence CRM</span>
              <span className="text-[10px] text-muted-foreground font-normal">Vue locale agence</span>
            </div>
          </Link>

          <div className="pt-2 pb-1">
            <div className="h-px bg-border/60" />
          </div>

          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 shrink-0" />
              ) : (
                <Moon className="h-4 w-4 shrink-0" />
              )}
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
          )}

          {/* Logout */}
          <form onSubmit={handleSignOut}>
            <button
              type="submit"
              disabled={isLoggingOut}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                  <span>Déconnexion...</span>
                </>
              ) : (
                <>
                  <LogOut className="h-4 w-4 shrink-0" />
                  <span>Sign Out</span>
                </>
              )}
            </button>
          </form>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0 lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-lg sm:px-6">
          <button
            className="rounded-md p-2 hover:bg-accent lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary border border-primary/20">
              <Shield className="h-3.5 w-3.5" />
              SuperAdmin Global
            </span>
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              prefetch={false}
              className="hidden sm:flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <ArrowLeftRight className="h-3.5 w-3.5 text-primary" />
              <span>Accéder au CRM</span>
            </Link>

            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{profile?.full_name || 'Super Admin'}</p>
              <p className="text-xs text-muted-foreground">{userEmail || 'superadmin@atloryx.com'}</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
              {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'SA'}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 px-4 pt-4 pb-12 sm:px-6 sm:pt-6 lg:pb-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
