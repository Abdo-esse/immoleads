'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Inbox,
  Search,
  MessageSquare,
  Sparkles,
  Phone,
  MapPin,
  Building2,
  Users,
  BarChart3,
  Clock,
  Trash2,
  ChevronDown,
} from 'lucide-react'
import { DemoConversionModal } from '@/components/admin/demo-conversion-modal'
import { updateDemoRequestStatus, deleteDemoRequest } from '@/lib/actions/demo-requests'
import type { DemoRequest, DemoRequestStatus } from '@/types'

interface DemoRequestsViewProps {
  requests: DemoRequest[]
}

export function DemoRequestsView({ requests }: DemoRequestsViewProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<'ALL' | DemoRequestStatus>('ALL')
  const [convertingDemo, setConvertingDemo] = useState<DemoRequest | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const pendingCount = requests.filter((r) => r.status === 'NEW').length
  const contactedCount = requests.filter((r) => r.status === 'CONTACTED').length
  const convertedCount = requests.filter((r) => r.status === 'CONVERTED').length

  const filteredRequests = requests.filter((req) => {
    const term = searchTerm.toLowerCase()
    const matchesSearch =
      req.full_name.toLowerCase().includes(term) ||
      (req.agency_name && req.agency_name.toLowerCase().includes(term)) ||
      req.city.toLowerCase().includes(term) ||
      req.phone.includes(term)

    const matchesTab = activeTab === 'ALL' || req.status === activeTab

    return matchesSearch && matchesTab
  })

  const handleStatusChange = async (id: string, newStatus: DemoRequestStatus) => {
    setUpdatingId(id)
    try {
      await updateDemoRequestStatus(id, newStatus)
      router.refresh()
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Supprimer définitivement la demande de « ${name} » ?`)) {
      await deleteDemoRequest(id)
      router.refresh()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight">Demandes de Démonstration</h1>
            {pendingCount > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                {pendingCount} à traiter
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Prospects qualifiés ayant soumis le formulaire « Demander ma démonstration » sur la landing page.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 rounded-xl border bg-card p-3 shadow-xs">
        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'ALL'
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            Toutes ({requests.length})
          </button>
          <button
            onClick={() => setActiveTab('NEW')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'NEW'
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <span>Nouveaux</span>
            {pendingCount > 0 && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  activeTab === 'NEW'
                    ? 'bg-primary-foreground text-primary'
                    : 'bg-primary text-primary-foreground'
                }`}
              >
                {pendingCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('CONTACTED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'CONTACTED'
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            Contactés ({contactedCount})
          </button>
          <button
            onClick={() => setActiveTab('CONVERTED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'CONVERTED'
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            Convertis ({convertedCount})
          </button>
          <button
            onClick={() => setActiveTab('ARCHIVED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'ARCHIVED'
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            Archivés
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher un prospect ou ville..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg text-sm bg-background border text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <div className="rounded-xl border bg-card p-12 text-center shadow-xs">
          <Inbox className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
          <h3 className="text-base font-semibold">
            Aucune demande de démonstration
          </h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            {searchTerm
              ? 'Aucune demande ne correspond à votre filtre de recherche.'
              : 'Les nouvelles soumissions de formulaires depuis la landing page apparaîtront instantanément ici.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((req) => {
            const phoneDigits = req.phone.replace(/[^0-9]/g, '')
            const whatsappText = encodeURIComponent(
              `Bonjour ${req.full_name}, je suis le conseiller ATLORYX en charge de votre demande de démonstration pour ImmoLeads. Avez-vous un moment aujourd'hui pour faire un point rapide sur votre gestion de leads ?`
            )
            const whatsappUrl = `https://wa.me/${phoneDigits}?text=${whatsappText}`
            const dateStr = new Date(req.created_at).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })

            return (
              <div
                key={req.id}
                className="rounded-xl border bg-card p-5 sm:p-6 shadow-xs hover:border-primary/40 transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  {/* Prospect details */}
                  <div className="space-y-3 flex-1">
                    {/* Top line: Name + agency + badge */}
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-base sm:text-lg font-semibold">
                        {req.full_name}
                      </h3>
                      {req.agency_name && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground bg-muted px-2.5 py-0.5 rounded-md">
                          <Building2 className="h-3.5 w-3.5" />
                          {req.agency_name}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                        <MapPin className="h-3 w-3 text-primary" />
                        {req.city}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {dateStr}
                      </span>
                    </div>

                    {/* Metadata chips */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      {req.team_size && (
                        <div className="px-2.5 py-1 rounded-md bg-muted/40 border text-muted-foreground flex items-center gap-1.5">
                          <Users className="h-3 w-3" />
                          <span>
                            Équipe : <strong className="text-foreground">{req.team_size} pers.</strong>
                          </span>
                        </div>
                      )}
                      {req.monthly_leads && (
                        <div className="px-2.5 py-1 rounded-md bg-muted/40 border text-muted-foreground flex items-center gap-1.5">
                          <BarChart3 className="h-3 w-3" />
                          <span>
                            Volume : <strong className="text-foreground">{req.monthly_leads} leads/m</strong>
                          </span>
                        </div>
                      )}
                      {req.main_problem && (
                        <div className="px-2.5 py-1 rounded-md bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-rose-800 dark:text-rose-300 font-medium">
                          Défi : {req.main_problem}
                        </div>
                      )}
                    </div>

                    {/* Lead sources */}
                    {req.lead_sources && req.lead_sources.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-xs text-muted-foreground">Canaux actuels :</span>
                        {req.lead_sources.map((src, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/30 text-[11px] font-medium text-blue-700 dark:text-blue-300"
                          >
                            {src}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Contact Number */}
                    <div className="flex items-center gap-3 text-xs pt-1">
                      <span className="font-semibold text-foreground flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5 text-primary" />
                        {req.phone}
                      </span>
                    </div>
                  </div>

                  {/* Actions & Status Control */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-2.5 pt-4 lg:pt-0 border-t lg:border-t-0">
                    {/* Status Select */}
                    <div className="relative">
                      <select
                        value={req.status}
                        onChange={(e) => handleStatusChange(req.id, e.target.value as DemoRequestStatus)}
                        disabled={updatingId === req.id}
                        className={`text-xs font-semibold py-1.5 pl-3 pr-7 rounded-lg border appearance-none transition-colors cursor-pointer ${
                          req.status === 'NEW'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-200 border-amber-300 dark:border-amber-700'
                            : req.status === 'CONTACTED'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-200 border-blue-300 dark:border-blue-700'
                            : req.status === 'CONVERTED'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700'
                            : 'bg-muted text-muted-foreground border-border'
                        }`}
                      >
                        <option value="NEW">Statut : Nouveau</option>
                        <option value="CONTACTED">Statut : Contacté</option>
                        <option value="CONVERTED">Statut : Converti</option>
                        <option value="ARCHIVED">Statut : Archivé</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-2 h-3.5 w-3.5 pointer-events-none text-muted-foreground" />
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                      {/* WhatsApp contact */}
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium shadow-xs transition-colors"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>WhatsApp</span>
                      </a>

                      {/* 1-Click Convert */}
                      {req.status !== 'CONVERTED' && (
                        <button
                          onClick={() => setConvertingDemo(req)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-medium shadow-xs transition-colors cursor-pointer"
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>Convertir en Agence</span>
                        </button>
                      )}

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(req.id, req.full_name)}
                        title="Supprimer la demande"
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Conversion Modal */}
      <DemoConversionModal
        demo={convertingDemo}
        isOpen={!!convertingDemo}
        onClose={() => setConvertingDemo(null)}
      />
    </div>
  )
}
