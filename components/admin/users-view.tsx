'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Users,
  Plus,
  Search,
  Building2,
  Shield,
  Phone,
  Trash2,
  Edit2,
  UserCheck,
} from 'lucide-react'
import { UserModal } from '@/components/admin/user-modal'
import { UserEditModal } from '@/components/admin/user-edit-modal'
import { deleteUser } from '@/lib/actions/admin'
import type { GlobalUserWithAgency, AgencyWithCounts } from '@/lib/actions/admin'

interface UsersViewProps {
  users: GlobalUserWithAgency[]
  agencies: AgencyWithCounts[]
}

export function UsersView({ users, agencies }: UsersViewProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [agencyFilter, setAgencyFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<GlobalUserWithAgency | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const filteredUsers = users.filter((user) => {
    const term = searchTerm.toLowerCase()
    const matchesSearch =
      user.full_name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      (user.phone && user.phone.includes(term))

    const matchesAgency =
      agencyFilter === 'all' ||
      (agencyFilter === 'independent' && !user.agency_id) ||
      user.agency_id === agencyFilter

    const matchesRole =
      roleFilter === 'all' || user.role === roleFilter

    return matchesSearch && matchesAgency && matchesRole
  })

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Supprimer l'accès pour « ${name} » ? Cette action est irréversible.`)) {
      setDeletingId(id)
      try {
        await deleteUser(id)
        router.refresh()
      } finally {
        setDeletingId(null)
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Utilisateurs & Collaborateurs</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Annuaire unifié de l'ensemble des administrateurs et agents de chaque agence.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Nouvel Utilisateur</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 rounded-xl border bg-card p-3 shadow-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher par nom, email ou téléphone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-lg text-sm bg-background border text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Agency Filter */}
        <div className="flex items-center gap-2">
          <select
            value={agencyFilter}
            onChange={(e) => setAgencyFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-sm bg-background border text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
          >
            <option value="all">Toutes les agences</option>
            <option value="independent">Indépendants / SuperAdmin</option>
            {agencies.map((ag) => (
              <option key={ag.id} value={ag.id}>
                {ag.name}
              </option>
            ))}
          </select>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-sm bg-background border text-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
          >
            <option value="all">Tous les rôles</option>
            <option value="superadmin">SuperAdmin</option>
            <option value="admin">Admin Agence</option>
            <option value="agent">Agent Commercial</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-xl border bg-card shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3">Collaborateur</th>
                <th className="px-5 py-3">Agence</th>
                <th className="px-5 py-3">Rôle</th>
                <th className="px-5 py-3">Contact</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground text-xs">
                    Aucun utilisateur ne correspond aux critères.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isSuperAdmin = u.role === 'superadmin'
                  const isAdmin = u.role === 'admin'

                  return (
                    <tr
                      key={u.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      {/* Name + Email */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-bold text-xs ${
                              isSuperAdmin
                                ? 'bg-primary text-primary-foreground'
                                : isAdmin
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            {u.full_name ? u.full_name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">
                              {u.full_name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {u.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Agency */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        {u.agency ? (
                          <div className="flex items-center gap-1.5 font-medium text-foreground">
                            <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{u.agency.name}</span>
                            {u.agency.city && (
                              <span className="text-xs text-muted-foreground">({u.agency.city})</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">
                            Indépendant (SuperAdmin)
                          </span>
                        )}
                      </td>

                      {/* Role Badge */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            isSuperAdmin
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50'
                              : isAdmin
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50'
                              : 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-900/40'
                          }`}
                        >
                          {isSuperAdmin && <Shield className="h-3 w-3" />}
                          {isAdmin && <UserCheck className="h-3 w-3" />}
                          <span>
                            {isSuperAdmin
                              ? 'SuperAdmin'
                              : isAdmin
                              ? 'Admin Agence'
                              : 'Agent Commercial'}
                          </span>
                        </span>
                      </td>

                      {/* Contact */}
                      <td className="px-5 py-3.5 whitespace-nowrap text-xs text-muted-foreground">
                        {u.phone ? (
                          <div className="flex items-center gap-1.5">
                            <Phone className="h-3.5 w-3.5" />
                            <span>{u.phone}</span>
                          </div>
                        ) : (
                          <span className="italic">Non renseigné</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setEditingUser(u)}
                            title="Modifier"
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(u.id, u.full_name)}
                            disabled={deletingId === u.id}
                            title="Supprimer l'accès"
                            className="p-1.5 rounded-lg text-destructive/70 hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <UserModal
        agencies={agencies}
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      <UserEditModal
        user={editingUser}
        agencies={agencies}
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
      />
    </div>
  )
}
