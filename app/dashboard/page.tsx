import { getDashboardData } from '@/lib/actions/dashboard'
import { RealtimeDashboard } from '@/components/dashboard/realtime-dashboard'

export const metadata = { title: 'Dashboard' }
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function DashboardPage() {
  const { kpis, recentLeads, followUps } = await getDashboardData()

  return (
    <RealtimeDashboard
      initialKpis={kpis}
      initialRecentLeads={recentLeads}
      initialFollowUps={followUps}
    />
  )
}
