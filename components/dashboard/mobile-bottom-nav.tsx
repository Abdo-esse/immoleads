'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, Kanban, CalendarCheck, MoreHorizontal, Building2, BarChart3, Settings, PhoneCall } from 'lucide-react'
import { useState } from 'react'

const mainTabs = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/dashboard/leads', label: 'Leads', icon: Users },
  { href: '/dashboard/leads/pipeline', label: 'Pipeline', icon: Kanban },
  { href: '/dashboard/visits', label: 'Visites', icon: CalendarCheck },
]

const moreTabs = [
  { href: '/dashboard/follow-ups', label: 'Follow-ups', icon: PhoneCall },
  { href: '/dashboard/properties', label: 'Biens', icon: Building2 },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export function MobileBottomNav() {
  const pathname = usePathname()
  const [showMore, setShowMore] = useState(false)

  return (
    <>
      {/* More menu overlay */}
      {showMore && (
        <div className="fixed inset-0 z-[80] lg:hidden" onClick={() => setShowMore(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="absolute bottom-[68px] left-2 right-2 rounded-2xl border bg-card p-2 shadow-2xl animate-in slide-in-from-bottom-2 duration-200">
            <div className="grid grid-cols-4 gap-1">
              {moreTabs.map((tab) => {
                const isActive = tab.href === '/dashboard'
                  ? pathname === '/dashboard'
                  : pathname.startsWith(tab.href)
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    onClick={() => setShowMore(false)}
                    className={`flex flex-col items-center gap-1 rounded-xl p-3 transition ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span className="text-[10px] font-medium">{tab.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-[70] border-t bg-background/95 backdrop-blur-lg lg:hidden safe-area-bottom">
        <div className="flex items-center justify-around px-1 py-1">
          {mainTabs.map((tab) => {
            const isActive = tab.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(tab.href) && tab.href !== '/dashboard'
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex flex-col items-center gap-0.5 rounded-xl px-3 py-2 transition-all ${
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}
              >
                <div className={`relative ${isActive ? 'scale-110' : ''} transition-transform`}>
                  <tab.icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 1.5} />
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-primary" />
                  )}
                </div>
                <span className={`text-[10px] ${isActive ? 'font-semibold' : 'font-medium'}`}>
                  {tab.label}
                </span>
              </Link>
            )
          })}

          {/* More button */}
          <button
            onClick={() => setShowMore(!showMore)}
            className={`flex flex-col items-center gap-0.5 rounded-xl px-3 py-2 transition-all ${
              showMore ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <MoreHorizontal className="h-5 w-5" strokeWidth={showMore ? 2.5 : 1.5} />
            <span className={`text-[10px] ${showMore ? 'font-semibold' : 'font-medium'}`}>Plus</span>
          </button>
        </div>
      </nav>
    </>
  )
}
