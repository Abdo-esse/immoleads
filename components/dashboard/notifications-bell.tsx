'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  Bell,
  UserPlus,
  UserCheck,
  Calendar,
  CheckCheck,
  Info,
  Clock,
  ExternalLink,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  type NotificationItem,
  type NotificationType,
} from '@/lib/actions/notifications'
import { timeAgo } from '@/lib/utils'
import { playNotificationSound } from '@/lib/utils/audio'

const STORAGE_KEY = 'immoleads_read_notif_ids'
const SOUND_KEY = 'immoleads_sound_enabled'

function getReadIds(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

function saveReadIds(ids: Set<string>) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(ids)))
  } catch {}
}

export function NotificationsBell() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Load sound mute preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const soundPref = localStorage.getItem(SOUND_KEY)
      if (soundPref === 'false') {
        setIsMuted(true)
      }
    }
  }, [])

  // Fetch notifications and filter out already-read ones
  const fetchAndFilter = async () => {
    try {
      const res = await getNotifications()
      const readIds = getReadIds()
      // Only keep notifications that are not read and not stored as read
      const unreadList = res.notifications.filter(
        (n) => !n.is_read && !readIds.has(n.id)
      )
      setNotifications(unreadList)
      setUnreadCount(unreadList.length)
    } catch (err) {
      // Silently catch
    }
  }

  // Initial load and periodic background sync (15s)
  useEffect(() => {
    let mounted = true

    fetchAndFilter()
    const interval = setInterval(() => {
      if (mounted) fetchAndFilter()
    }, 15000)

    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [])

  // Supabase Realtime subscription
  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel('realtime_notifications_all')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
        },
        (payload) => {
          const newNotif = payload.new as NotificationItem
          if (newNotif) {
            const readIds = getReadIds()
            if (readIds.has(newNotif.id) || newNotif.is_read) return

            setNotifications((prev) => [
              newNotif,
              ...prev.filter((n) => n.id !== newNotif.id).slice(0, 19),
            ])
            setUnreadCount((count) => count + 1)
            if (!isMuted) playNotificationSound()

            toast.info(newNotif.title, {
              description: newNotif.message,
              action: newNotif.link
                ? {
                    label: 'Voir',
                    onClick: () => router.push(newNotif.link!),
                  }
                : undefined,
            })
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'leads',
        },
        (payload) => {
          const lead = payload.new as any
          if (lead) {
            const id = `live-lead-${lead.id}`
            const readIds = getReadIds()
            if (readIds.has(id)) return

            const notifItem: NotificationItem = {
              id,
              agency_id: lead.agency_id,
              user_id: lead.assigned_to || null,
              title: 'Nouveau lead reçu !',
              message: `${lead.name || 'Prospect'} (${lead.phone || ''}) — Intéressé par vos biens`,
              type: 'lead_created',
              link: `/dashboard/leads/${lead.id}`,
              is_read: false,
              created_at: lead.created_at || new Date().toISOString(),
            }

            setNotifications((prev) => {
              if (prev.some((n) => n.link === notifItem.link)) return prev
              return [notifItem, ...prev.slice(0, 19)]
            })
            setUnreadCount((count) => count + 1)
            if (!isMuted) playNotificationSound()

            toast.info('Nouveau lead reçu !', {
              description: `${lead.name} (${lead.phone})`,
              action: {
                label: 'Voir le lead',
                onClick: () => router.push(`/dashboard/leads/${lead.id}`),
              },
            })
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [router])

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Mark single notification as read & remove from view forever
  const handleNotificationClick = async (notif: NotificationItem) => {
    const readIds = getReadIds()
    readIds.add(notif.id)
    saveReadIds(readIds)

    setNotifications((prev) => prev.filter((n) => n.id !== notif.id))
    setUnreadCount((c) => Math.max(0, c - 1))
    await markNotificationAsRead(notif.id)

    setIsOpen(false)
    if (notif.link) {
      router.push(notif.link)
    }
  }

  // Mark all notifications as read & clear all from view
  const handleMarkAllRead = async () => {
    const readIds = getReadIds()
    notifications.forEach((n) => readIds.add(n.id))
    saveReadIds(readIds)

    setNotifications([])
    setUnreadCount(0)
    await markAllNotificationsAsRead()
    toast.success('Toutes les notifications ont été lues et masquées.')
  }

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case 'lead_created':
        return <UserPlus className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
      case 'lead_assigned':
        return <UserCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      case 'visit_scheduled':
        return <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
      default:
        return <Info className="h-4 w-4 text-orange-600 dark:text-orange-400" />
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        id="notifications-bell-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg border bg-background text-muted-foreground transition hover:bg-accent hover:text-foreground"
        title="Notifications"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-background animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown / Mobile Centered Modal */}
      {isOpen && (
        <>
          {/* Mobile Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm sm:hidden"
            onClick={() => setIsOpen(false)}
          />

          <div className="fixed top-16 left-3 right-3 max-w-md mx-auto z-50 sm:absolute sm:top-full sm:left-auto sm:right-0 sm:inset-x-auto sm:mt-2 sm:w-96 rounded-2xl border bg-card shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-4 py-3 bg-muted/40">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">Notifications</span>
              {unreadCount > 0 ? (
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700 dark:bg-red-950/60 dark:text-red-400">
                  {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
                </span>
              ) : (
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                  À jour
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Sound / Mute Toggle Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  const nextMuted = !isMuted
                  setIsMuted(nextMuted)
                  try {
                    localStorage.setItem(SOUND_KEY, nextMuted ? 'false' : 'true')
                  } catch {}

                  if (nextMuted) {
                    toast.info('Mode silencieux activé 🔇')
                  } else {
                    playNotificationSound()
                    toast.success('Son des notifications activé 🔔')
                  }
                }}
                className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-xs transition border ${
                  isMuted
                    ? 'border-border text-muted-foreground hover:text-foreground bg-muted/60'
                    : 'border-primary/20 text-primary bg-primary/10 hover:bg-primary/20 font-medium'
                }`}
                title={isMuted ? 'Activer le son des alertes' : 'Passer en mode silencieux'}
              >
                {isMuted ? (
                  <>
                    <VolumeX className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-[11px]">Silencieux</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="h-3.5 w-3.5 text-primary animate-pulse" />
                    <span className="text-[11px]">Son activé</span>
                  </>
                )}
              </button>

              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:text-primary transition"
                  title="Tout marquer comme lu"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  <span className="text-[11px]">Tout lire</span>
                </button>
              )}
            </div>
          </div>

          {/* List: only unread notifications are displayed */}
          <div className="max-h-80 overflow-y-auto divide-y">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground mb-2">
                  <Bell className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-xs font-semibold text-foreground">
                  Toutes les notifications sont lues !
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Les notifications déjà lues sont masquées. Vous recevrez une alerte sonore dès l&apos;arrivée d&apos;un nouveau prospect.
                </p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className="flex items-start gap-3 p-3.5 transition-colors cursor-pointer hover:bg-muted/50 bg-primary/5 dark:bg-primary/10 group"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted/80 mt-0.5">
                    {getTypeIcon(notif.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-semibold text-foreground truncate">
                        {notif.title}
                      </p>
                      <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {notif.message}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{timeAgo(notif.created_at)}</span>
                      <span className="text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 ml-auto">
                        Ouvrir <ExternalLink className="h-2.5 w-2.5" />
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </>
    )}
    </div>
  )
}
