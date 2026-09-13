'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { cn } from 'cn'
import { signOut } from '@/lib/actions/auth'
import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarCheck,
  PhoneCall,
  BarChart3,
  Settings,
  LogOut,
  Kanban,
  Menu,
  X,
  Moon,
  Sun,
  Search,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { NotificationsBell } from '@/components/dashboard/notifications-bell'
import { CommandPalette } from '@/components/dashboard/command-palette'
import { MobileBottomNav } from '@/components/dashboard/mobile-bottom-nav'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/leads', label: 'Leads', icon: Users },
  { href: '/dashboard/leads/pipeline', label: 'Pipeline', icon: Kanban },
  { href: '/dashboard/properties', label: 'Properties', icon: Building2 },
  { href: '/dashboard/visits', label: 'Visits', icon: CalendarCheck },
  { href: '/dashboard/follow-ups', label: 'Follow-ups', icon: PhoneCall },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="flex min-h-screen">
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
          <Link href="/dashboard" prefetch={false} className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Building2 className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-base font-bold tracking-tight">
              Immo<span className="text-primary">Leads</span>
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
            const isActive =
              item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            )
          })}

          {/* Séparateur discret sous Settings */}
          <div className="pt-2 pb-1">
            <div className="h-px bg-border/60" />
          </div>

          {/* Theme Toggle placé directement sous Settings */}
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

          {/* Logout placé immédiatement sous Settings sans scroller */}
          <form action={signOut}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              Sign Out
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
          {/* Search shortcut */}
          <button
            onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
            className="hidden sm:flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Rechercher...</span>
            <kbd className="rounded border bg-muted px-1.5 py-0.5 text-[10px]">Ctrl+K</kbd>
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <NotificationsBell />
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">ImmoMaroc Agency</p>
              <p className="text-xs text-muted-foreground">CRM Dashboard</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
              IM
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 px-4 pt-4 pb-12 sm:px-6 sm:pt-6 lg:pb-8">
          {children}
          {/* Espace réservé garanti à la fin du scroll pour la bottom nav sur mobile */}
          <div
            style={{ height: '120px', minHeight: '120px', width: '100%' }}
            className="lg:hidden shrink-0"
            aria-hidden="true"
          />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Global Command Palette */}
      <CommandPalette />
    </div>
  )
}
