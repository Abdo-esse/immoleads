import { requireSuperAdmin } from '@/lib/actions/auth'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { AdminShell } from '@/components/admin/admin-shell'

export const metadata = {
  title: 'ATLORYX SuperAdmin — Gestion Plateforme ImmoLeads',
  description: 'Portail centralisé de gestion multi-agences et des demandes de démonstration ATLORYX ImmoLeads.',
}

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { profile, user } = await requireSuperAdmin()

  // Get count of pending demo requests for the sidebar badge
  const { count: pendingCount } = await supabaseAdmin
    .from('demo_requests')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'NEW')

  return (
    <AdminShell
      pendingCount={pendingCount || 0}
      profile={profile}
      userEmail={user.email}
    >
      {children}
    </AdminShell>
  )
}
