'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Search, Phone, MessageSquare, Eye, UserPlus, Filter, X, Download, Upload, CheckSquare, Square, Trash2, AlertTriangle } from 'lucide-react'
import { updateLeadStatus, assignLead } from '@/lib/actions/leads'
import { bulkAssignLeads, bulkUpdateStatus, bulkDeleteLeads } from '@/lib/actions/bulk'
import { LEAD_STATUS_CONFIG, LEAD_SOURCES } from '@/lib/constants'
import { formatPhone, timeAgo } from '@/lib/utils'
import { buildWhatsAppUrl, buildCRMOutreachMessage } from '@/lib/whatsapp'
import { exportLeadsToCsv, downloadCsv } from '@/lib/utils/export'
import { LeadImportDialog } from './lead-import-dialog'
import { LeadSlaBadge } from '@/components/dashboard/lead-sla-badge'
import { DuplicateDetector } from '@/components/dashboard/duplicate-detector'
import { cn } from 'cn'
import type { LeadWithRelations } from '@/types'

interface Props {
  leads: LeadWithRelations[]
  agents: { id: string; full_name: string; role: string }[]
}

export function LeadsClient({ leads, agents }: Props) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sourceFilter, setSourceFilter] = useState('')
  const [assignFilter, setAssignFilter] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [bulkLoading, setBulkLoading] = useState(false)
  const [showDuplicates, setShowDuplicates] = useState(false)
  const [bulkAgent, setBulkAgent] = useState('')
  const [bulkStatus, setBulkStatusVal] = useState('')

  const filtered = leads.filter((lead) => {
    if (search) {
      const q = search.toLowerCase()
      const matches =
        lead.name.toLowerCase().includes(q) ||
        lead.phone.includes(q) ||
        lead.email?.toLowerCase().includes(q)
      if (!matches) return false
    }
    if (statusFilter && lead.status !== statusFilter) return false
    if (sourceFilter && lead.source !== sourceFilter) return false
    if (assignFilter) {
      if (assignFilter === 'unassigned' && lead.assigned_to) return false
      if (assignFilter !== 'unassigned' && lead.assigned_to !== assignFilter) return false
    }
    return true
  })

  const hasFilters = statusFilter || sourceFilter || assignFilter

  async function handleAssign(leadId: string, agentId: string) {
    const result = await assignLead(leadId, agentId)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Lead assigned')
      router.refresh()
    }
  }

  const handleExportCsv = () => {
    if (filtered.length === 0) {
      toast.error('Aucun lead à exporter.')
      return
    }
    const csvData = exportLeadsToCsv(filtered)
    const dateStr = new Date().toISOString().split('T')[0]
    downloadCsv(`immoleads_leads_${dateStr}.csv`, csvData)
    toast.success(`${filtered.length} lead${filtered.length > 1 ? 's exportés' : ' exporté'} avec succès !`)
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filtered.map((l) => l.id)))
    }
  }

  const handleBulkAssign = async () => {
    if (!bulkAgent || selectedIds.size === 0) return
    setBulkLoading(true)
    const result = await bulkAssignLeads([...selectedIds], bulkAgent)
    if (result.error) toast.error(result.error)
    else { toast.success(`${result.count} leads assignés`); setSelectedIds(new Set()); router.refresh() }
    setBulkLoading(false)
  }

  const handleBulkStatus = async () => {
    if (!bulkStatus || selectedIds.size === 0) return
    setBulkLoading(true)
    const result = await bulkUpdateStatus([...selectedIds], bulkStatus)
    if (result.error) toast.error(result.error)
    else { toast.success(`${result.count} leads mis à jour`); setSelectedIds(new Set()); router.refresh() }
    setBulkLoading(false)
  }

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return
    if (!confirm(`Supprimer ${selectedIds.size} lead(s) ? Cette action est irréversible.`)) return
    setBulkLoading(true)
    const result = await bulkDeleteLeads([...selectedIds])
    if (result.error) toast.error(result.error)
    else { toast.success(`${result.count} leads supprimés`); setSelectedIds(new Set()); router.refresh() }
    setBulkLoading(false)
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, phone, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex h-10 w-full rounded-lg border bg-background pl-9 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex h-10 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors hover:bg-accent ${hasFilters ? 'border-primary text-primary' : ''}`}
          >
            <Filter className="h-4 w-4" />
            Filters {hasFilters && `(${[statusFilter, sourceFilter, assignFilter].filter(Boolean).length})`}
          </button>
          <button
            onClick={() => setShowImportDialog(true)}
            className="inline-flex h-10 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors hover:bg-accent"
            title="Importer des leads depuis un fichier CSV"
          >
            <Upload className="h-4 w-4" />
            Importer CSV
          </button>
          <button
            onClick={handleExportCsv}
            className="inline-flex h-10 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors hover:bg-accent"
            title="Exporter les leads filtrés en CSV"
          >
            <Download className="h-4 w-4" />
            Exporter CSV
          </button>
          <Link
            href="/dashboard/leads/pipeline"
            prefetch={false}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Pipeline View
          </Link>
          <button
            onClick={() => setShowDuplicates(true)}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-amber-300 dark:border-amber-700 px-3 text-sm font-medium text-amber-600 transition-colors hover:bg-amber-50 dark:hover:bg-amber-900/20"
          >
            <AlertTriangle className="h-4 w-4" />
            Doublons
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">Filters</span>
            {hasFilters && (
              <button
                onClick={() => { setStatusFilter(''); setSourceFilter(''); setAssignFilter('') }}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" /> Clear all
              </button>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 rounded-lg border bg-background px-3 text-sm"
            >
              <option value="">All Statuses</option>
              {Object.entries(LEAD_STATUS_CONFIG).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="h-9 rounded-lg border bg-background px-3 text-sm"
            >
              <option value="">All Sources</option>
              {LEAD_SOURCES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <select
              value={assignFilter}
              onChange={(e) => setAssignFilter(e.target.value)}
              className="h-9 rounded-lg border bg-background px-3 text-sm"
            >
              <option value="">All Agents</option>
              <option value="unassigned">Unassigned</option>
              {agents.map((a) => (
                <option key={a.id} value={a.id}>{a.full_name}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Showing {filtered.length} of {leads.length} leads
        {selectedIds.size > 0 && (
          <span className="ml-2 font-medium text-primary">({selectedIds.size} sélectionnés)</span>
        )}
      </p>

      {/* Bulk Actions Floating Bar */}
      {selectedIds.size > 0 && (
        <div className="sticky bottom-20 lg:bottom-4 z-20 mx-auto w-full max-w-2xl animate-in slide-in-from-bottom-4 duration-200">
          <div className="rounded-2xl border bg-card p-3 shadow-2xl">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-sm font-semibold text-primary">{selectedIds.size} sélectionnés</span>
              <span className="text-muted-foreground">|</span>
              <select
                value={bulkAgent}
                onChange={(e) => setBulkAgent(e.target.value)}
                className="h-8 rounded-lg border bg-background px-2 text-xs"
              >
                <option value="">Assigner à...</option>
                {agents.map((a) => <option key={a.id} value={a.id}>{a.full_name}</option>)}
              </select>
              <button onClick={handleBulkAssign} disabled={!bulkAgent || bulkLoading} className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground disabled:opacity-50">
                Assigner
              </button>
              <span className="text-muted-foreground">|</span>
              <select
                value={bulkStatus}
                onChange={(e) => setBulkStatusVal(e.target.value)}
                className="h-8 rounded-lg border bg-background px-2 text-xs"
              >
                <option value="">Statut...</option>
                {Object.entries(LEAD_STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
              <button onClick={handleBulkStatus} disabled={!bulkStatus || bulkLoading} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">
                Appliquer
              </button>
              <span className="text-muted-foreground">|</span>
              <button onClick={handleBulkDelete} disabled={bulkLoading} className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50">
                <Trash2 className="h-3 w-3 inline mr-1" />Supprimer
              </button>
              <button onClick={() => setSelectedIds(new Set())} className="text-xs text-muted-foreground hover:text-foreground ml-1">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16">
          <p className="text-lg font-medium">No leads found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {leads.length === 0 ? 'Leads from your public forms will appear here.' : 'Try adjusting your search or filters.'}
          </p>
        </div>
      ) : (
        <>
          {/* Mobile Card View (< sm screens) */}
          <div className="block sm:hidden space-y-3">
            {filtered.map((lead) => {
              const statusCfg = LEAD_STATUS_CONFIG[lead.status]
              const isSelected = selectedIds.has(lead.id)
              const waUrl = buildWhatsAppUrl(
                lead.phone,
                buildCRMOutreachMessage(lead.name, lead.property?.title)
              )
              return (
                <div
                  key={lead.id}
                  className={cn(
                    'rounded-xl border bg-card p-4 shadow-sm transition-all',
                    isSelected ? 'ring-2 ring-primary bg-primary/5' : 'hover:border-primary/50'
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <button
                        type="button"
                        onClick={() => toggleSelect(lead.id)}
                        className="text-muted-foreground hover:text-foreground shrink-0"
                      >
                        {isSelected ? (
                          <CheckSquare className="h-5 w-5 text-primary" />
                        ) : (
                          <Square className="h-5 w-5" />
                        )}
                      </button>
                      <Link href={`/dashboard/leads/${lead.id}`} className="font-semibold text-base truncate hover:underline">
                        {lead.name}
                      </Link>
                    </div>
                    <span className={`inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusCfg.bgClass} ${statusCfg.textClass}`}>
                      {statusCfg.label}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center gap-2 flex-wrap text-xs text-muted-foreground">
                    <LeadSlaBadge
                      createdAt={lead.created_at}
                      status={lead.status}
                      lastContactedAt={lead.last_contacted_at}
                      compact
                    />
                    <span>•</span>
                    <span>{formatPhone(lead.phone)}</span>
                    <span>•</span>
                    <span>{timeAgo(lead.created_at)}</span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs border-t pt-2.5">
                    <div className="text-muted-foreground truncate max-w-[180px]">
                      {lead.property ? (
                        <span className="font-medium text-foreground">🏠 {lead.property.title}</span>
                      ) : lead.city ? (
                        <span>📍 {lead.city}</span>
                      ) : (
                        <span className="capitalize">{lead.source || 'Prospect'}</span>
                      )}
                    </div>
                    <div className="text-muted-foreground">
                      {lead.assigned_agent ? (
                        <span className="font-medium text-foreground">👤 {lead.assigned_agent.full_name}</span>
                      ) : (
                        <span className="text-amber-600 dark:text-amber-400 font-medium">Non assigné</span>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 pt-3 grid grid-cols-3 gap-2 border-t">
                    <a
                      href={`tel:${lead.phone}`}
                      className="flex items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-semibold hover:bg-accent text-foreground transition"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      Appel
                    </a>
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 rounded-lg bg-green-600 text-white py-2 text-xs font-semibold shadow-sm hover:bg-green-700 transition"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      WhatsApp
                    </a>
                    <Link
                      href={`/dashboard/leads/${lead.id}`}
                      className="flex items-center justify-center gap-1.5 rounded-lg bg-primary text-primary-foreground py-2 text-xs font-semibold shadow-sm hover:bg-primary/90 transition"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Détails
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Desktop/Tablet Table */}
          <div className="hidden sm:block overflow-hidden rounded-xl border">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-3 py-3 text-left">
                      <button onClick={toggleAll} className="text-muted-foreground hover:text-foreground">
                        {selectedIds.size === filtered.length && filtered.length > 0
                          ? <CheckSquare className="h-4 w-4 text-primary" />
                          : <Square className="h-4 w-4" />
                        }
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left font-medium">Lead</th>
                    <th className="px-4 py-3 text-left font-medium hidden sm:table-cell">Status</th>
                    <th className="px-4 py-3 text-left font-medium hidden sm:table-cell">SLA</th>
                    <th className="px-4 py-3 text-left font-medium hidden md:table-cell">Source</th>
                    <th className="px-4 py-3 text-left font-medium hidden lg:table-cell">Property</th>
                    <th className="px-4 py-3 text-left font-medium hidden lg:table-cell">Agent</th>
                    <th className="px-4 py-3 text-left font-medium hidden xl:table-cell">Created</th>
                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((lead) => {
                    const statusCfg = LEAD_STATUS_CONFIG[lead.status]
                    const waUrl = buildWhatsAppUrl(
                      '212669808310',
                      buildCRMOutreachMessage(lead.name, lead.property?.title)
                    )
                    return (
                      <tr key={lead.id} className={`border-b transition-colors hover:bg-muted/30 ${selectedIds.has(lead.id) ? 'bg-primary/5' : ''}`}>
                        <td className="px-3 py-3">
                          <button onClick={() => toggleSelect(lead.id)} className="text-muted-foreground hover:text-foreground">
                            {selectedIds.has(lead.id)
                              ? <CheckSquare className="h-4 w-4 text-primary" />
                              : <Square className="h-4 w-4" />
                            }
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <Link href={`/dashboard/leads/${lead.id}`} className="hover:underline">
                            <p className="font-medium">{lead.name}</p>
                            <p className="text-xs text-muted-foreground">{formatPhone(lead.phone)}</p>
                          </Link>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusCfg.bgClass} ${statusCfg.textClass}`}>
                            {statusCfg.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <LeadSlaBadge
                            createdAt={lead.created_at}
                            status={lead.status}
                            lastContactedAt={lead.last_contacted_at}
                            compact
                          />
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className="text-xs capitalize">{lead.source || '—'}</span>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          {lead.property ? (
                            <span className="text-xs truncate max-w-[150px] block">{lead.property.title}</span>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          {lead.assigned_agent ? (
                            <span className="text-xs">{lead.assigned_agent.full_name}</span>
                          ) : (
                            <select
                              onChange={(e) => handleAssign(lead.id, e.target.value)}
                              className="h-7 rounded border bg-background px-2 text-xs"
                              defaultValue=""
                            >
                              <option value="" disabled>Assign...</option>
                              {agents.map((a) => (
                                <option key={a.id} value={a.id}>{a.full_name}</option>
                              ))}
                            </select>
                          )}
                        </td>
                        <td className="px-4 py-3 hidden xl:table-cell">
                          <span className="text-xs text-muted-foreground">{timeAgo(lead.created_at)}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              href={`/dashboard/leads/${lead.id}`}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent"
                              title="View details"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Link>
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                              title="WhatsApp"
                            >
                              <MessageSquare className="h-3.5 w-3.5" />
                            </a>
                            <a
                              href={`tel:${lead.phone}`}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent"
                              title="Call"
                            >
                              <Phone className="h-3.5 w-3.5" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* CSV Import Dialog */}
      <LeadImportDialog
        open={showImportDialog}
        onClose={() => setShowImportDialog(false)}
      />

      {/* Duplicate Detector Modal */}
      {showDuplicates && (
        <DuplicateDetector onClose={() => setShowDuplicates(false)} />
      )}
    </div>
  )
}
