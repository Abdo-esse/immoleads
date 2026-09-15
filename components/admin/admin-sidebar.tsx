'use client'

import { AdminShell } from './admin-shell'

interface AdminSidebarProps {
  pendingDemosCount?: number
  currentUserName?: string
  currentUserEmail?: string
}

export function AdminSidebar({
  pendingDemosCount = 0,
  currentUserName = 'Super Admin',
  currentUserEmail = '',
}: AdminSidebarProps) {
  // Retained for backward compatibility
  return null
}
