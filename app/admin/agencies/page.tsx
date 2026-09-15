import { getAllAgencies } from '@/lib/actions/admin'
import { AgenciesView } from '@/components/admin/agencies-view'

export const metadata = {
  title: 'Gestion des Agences — ATLORYX SuperAdmin',
}

export default async function AdminAgenciesPage() {
  const agencies = await getAllAgencies()

  return <AgenciesView agencies={agencies} />
}
