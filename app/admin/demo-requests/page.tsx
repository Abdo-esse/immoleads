import { getDemoRequests } from '@/lib/actions/demo-requests'
import { DemoRequestsView } from '@/components/admin/demo-requests-view'

export const metadata = {
  title: 'Demandes de Démonstration — ATLORYX SuperAdmin',
}

export default async function AdminDemoRequestsPage() {
  const requests = await getDemoRequests()

  return <DemoRequestsView requests={requests} />
}
