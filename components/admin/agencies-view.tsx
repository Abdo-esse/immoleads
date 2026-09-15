'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Building2,
  Plus,
  Search,
  MapPin,
  Phone,
  Mail,
  Users,
  BarChart3,
  Trash2,
  Edit2,
  MessageSquare,
} from 'lucide-react'
import { AgencyModal } from '@/components/admin/agency-modal'
import { AgencyEditModal } from '@/components/admin/agency-edit-modal'
import { deleteAgency } from '@/lib/actions/admin'
import type { AgencyWithCounts } from '@/lib/actions/admin'

interface AgenciesViewProps {
  agencies: AgencyWithCounts[]
}

export function AgenciesView({ agencies }: AgenciesViewProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingAgency, setEditingAgency] = useState<AgencyWithCounts | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const filteredAgencies = agencies.filter((agency) => {
    const term = searchTerm.toLowerCase()
    return (
      agency.name.toLowerCase().includes(term) ||
      (agency.city && agency.city.toLowerCase().includes(term)) ||
      (agency.phone && agency.phone.includes(term))
    )
  })

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'agence « ${name} » et toutes ses données associées ?`)) {
      setDeletingId(id)
      try {
        await deleteAgency(id)
        router.refresh()
      } finally {
        setDeletingId(null)
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Agences Immobilières</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Gérez l'ensemble des agences clientes hébergées sur votre plateforme.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Nouvelle Agence</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center justify-between gap-4 rounded-xl border bg-card p-3 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher par nom d'agence, ville ou numéro..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-lg text-sm bg-background border text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="text-xs font-medium text-muted-foreground whitespace-nowrap pr-2">
          {filteredAgencies.length} agence{filteredAgencies.length > 1 ? 's' : ''}
        </div>
      </div>

      {/* Agencies Cards Grid */}
      {filteredAgencies.length === 0 ? (
        <div className="rounded-xl border bg-card p-12 text-center shadow-xs">
          <Building2 className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
          <h3 className="text-base font-semibold">
            Aucune agence trouvée
          </h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            {searchTerm
              ? 'Aucun résultat ne correspond à votre recherche.'
              : 'Commencez par ajouter votre première agence en cliquant sur "Nouvelle Agence".'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setIsCreateOpen(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 shadow-xs cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Créer une agence</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAgencies.map((agency) => (
            <div
              key={agency.id}
              className="rounded-xl border bg-card p-5 shadow-xs hover:border-primary/50 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-base">
                      {agency.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-base leading-tight">
                        {agency.name}
                      </h3>
                      {agency.city && (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                          <MapPin className="h-3 w-3 text-primary" />
                          {agency.city}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingAgency(agency)}
                      title="Modifier l'agence"
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(agency.id, agency.name)}
                      disabled={deletingId === agency.id}
                      title="Supprimer l'agence"
                      className="p-1.5 rounded-lg text-destructive/70 hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Contact info */}
                <div className="mt-4 space-y-1.5 text-xs text-muted-foreground pt-3 border-t">
                  {agency.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5" />
                      <span>{agency.phone}</span>
                    </div>
                  )}
                  {agency.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5" />
                      <span className="truncate">{agency.email}</span>
                    </div>
                  )}
                  {agency.adminUser && (
                    <div className="flex items-center gap-2">
                      <Users className="h-3.5 w-3.5" />
                      <span>
                        Admin : <strong className="text-foreground">{agency.adminUser.full_name}</strong>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats Footer */}
              <div className="mt-5 pt-3 border-t flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1 font-medium text-foreground">
                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                    {agency.userCount} agent{agency.userCount > 1 ? 's' : ''}
                  </span>
                  <span className="flex items-center gap-1 font-medium text-foreground">
                    <BarChart3 className="h-3.5 w-3.5 text-muted-foreground" />
                    {agency.leadCount} lead{agency.leadCount > 1 ? 's' : ''}
                  </span>
                </div>

                {agency.whatsapp_number && (
                  <a
                    href={`https://wa.me/${agency.whatsapp_number.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Contacter sur WhatsApp"
                    className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>WhatsApp</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <AgencyModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      <AgencyEditModal
        agency={editingAgency}
        isOpen={!!editingAgency}
        onClose={() => setEditingAgency(null)}
      />
    </div>
  )
}
