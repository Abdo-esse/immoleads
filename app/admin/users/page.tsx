import { getAllUsers, getAllAgencies } from '@/lib/actions/admin'
import { UsersView } from '@/components/admin/users-view'

export const metadata = {
  title: 'Gestion des Utilisateurs — ATLORYX SuperAdmin',
}

export default async function AdminUsersPage() {
  const [users, agencies] = await Promise.all([
    getAllUsers(),
    getAllAgencies(),
  ])

  return <UsersView users={users} agencies={agencies} />
}
