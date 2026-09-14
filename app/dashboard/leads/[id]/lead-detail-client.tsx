'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  ArrowLeft,
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  Calendar,
  CalendarCheck,
  Clock,
  User,
  Send,
  Building2,
  Sparkles,
  X,
} from 'lucide-react'
import { updateLeadStatus, assignLead, scheduleFollowUp, addLeadNote } from '@/lib/actions/leads'
import { createVisit } from '@/lib/actions/visits'
import { LEAD_STATUS_CONFIG, LEAD_TIMELINES, LOST_REASONS, ACTIVITY_ACTIONS } from '@/lib/constants'
import { formatPrice, formatPhone, timeAgo, getInitials } from '@/lib/utils'
import { cn } from 'cn'
import { LeadPropertyMatches } from '@/components/dashboard/lead-property-matches'
import { LeadSlaBadge } from '@/components/dashboard/lead-sla-badge'
import { ActivityTimeline } from '@/components/dashboard/activity-timeline'
import { WhatsAppChatPanel } from '@/components/dashboard/whatsapp-chat-panel'
import type { MatchResult } from '@/lib/utils/matching'
import type { LeadWithRelations } from '@/types'

interface Props {
  lead: LeadWithRelations
  notes: any[]
  activities: any[]
  agents: { id: string; full_name: string; role: string }[]
  matchedProperties?: MatchResult[]
}

export function LeadDetailClient({ lead, notes, activities, agents, matchedProperties = [] }: Props) {
  const router = useRouter()
  const [mobileTab, setMobileTab] = useState<'info' | 'matches' | 'activity' | 'notes'>('info')
  const [noteContent, setNoteContent] = useState('')
  const [submittingNote, setSubmittingNote] = useState(false)
  const [changingStatus, setChangingStatus] = useState(false)

  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false)

  const statusCfg = LEAD_STATUS_CONFIG[lead.status]

  async function handleStatusChange(newStatus: string, lostReason?: string) {
    setChangingStatus(true)
    const result = await updateLeadStatus(lead.id, newStatus, lostReason)
    setChangingStatus(false)
    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success(`Status updated to ${LEAD_STATUS_CONFIG[newStatus as keyof typeof LEAD_STATUS_CONFIG]?.label}`)
      router.refresh()
    }
  }

  async function handleAssign(agentId: string) {
    const result = await assignLead(lead.id, agentId)
    if (result.error) toast.error(result.error)
    else { toast.success('Agent assigned'); router.refresh() }
  }

  async function handleFollowUp(date: string) {
    const result = await scheduleFollowUp(lead.id, new Date(date).toISOString())
    if (result?.error) toast.error(result.error)
    else { toast.success('Follow-up scheduled'); router.refresh() }
  }

  async function handleAddNote() {
    if (!noteContent.trim()) return
    setSubmittingNote(true)
    const result = await addLeadNote(lead.id, noteContent.trim())
    setSubmittingNote(false)
    if (result.error) toast.error(result.error)
    else { setNoteContent(''); toast.success('Note added'); router.refresh() }
  }

  const [showVisitForm, setShowVisitForm] = useState(false)
  const [schedulingVisit, setSchedulingVisit] = useState(false)

  async function handleScheduleVisit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSchedulingVisit(true)
    const form = new FormData(e.currentTarget)
    const result = await createVisit({
      lead_id: lead.id,
      property_id: lead.property?.id || null,
      agent_id: lead.assigned_agent?.id || null,
      visit_date: form.get('visit_date') as string,
      visit_time: form.get('visit_time') as string,
    })
    setSchedulingVisit(false)
    if (result.error) toast.error(result.error)
    else { setShowVisitForm(false); toast.success('Visit scheduled'); router.refresh() }
  }


  return (
    <div className="space-y-6">
      {/* Back button + header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/leads"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">{lead.name}</h1>
            <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusCfg.bgClass} ${statusCfg.textClass}`}>
              {statusCfg.label}
            </span>
            <LeadSlaBadge
              createdAt={lead.created_at}
              status={lead.status}
              lastContactedAt={lead.last_contacted_at}
            />
          </div>
          <p className="text-sm text-muted-foreground">{formatPhone(lead.phone)}</p>
        </div>
      </div>

      {/* Mobile Tabs Switcher (visible on screens < lg) */}
      <div className="flex lg:hidden overflow-x-auto gap-1 bg-muted/40 p-1.5 rounded-xl border border-border/50">
        <button
          type="button"
          onClick={() => setMobileTab('info')}
          className={cn(
            'flex-1 min-w-[75px] py-2 text-xs font-semibold rounded-lg transition text-center',
            mobileTab === 'info'
              ? 'bg-background shadow-sm text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          Infos
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('matches')}
          className={cn(
            'flex-1 min-w-[75px] py-2 text-xs font-semibold rounded-lg transition text-center',
            mobileTab === 'matches'
              ? 'bg-background shadow-sm text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          Biens {matchedProperties.length > 0 && `(${matchedProperties.length})`}
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('activity')}
          className={cn(
            'flex-1 min-w-[75px] py-2 text-xs font-semibold rounded-lg transition text-center',
            mobileTab === 'activity'
              ? 'bg-background shadow-sm text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          Activité {activities.length > 0 && `(${activities.length})`}
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('notes')}
          className={cn(
            'flex-1 min-w-[75px] py-2 text-xs font-semibold rounded-lg transition text-center',
            mobileTab === 'notes'
              ? 'bg-background shadow-sm text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          Notes {notes.length > 0 && `(${notes.length})`}
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column — Lead Info + Property + Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Info Card */}
          <div className={cn('rounded-xl border bg-card p-6', mobileTab === 'info' ? 'block' : 'hidden lg:block')}>
            <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoRow icon={Phone} label="Phone" value={formatPhone(lead.phone)} />
              <InfoRow icon={Mail} label="Email" value={lead.email || '—'} />
              <InfoRow icon={MapPin} label="City" value={lead.city || '—'} />
              <InfoRow icon={Calendar} label="Timeline" value={
                LEAD_TIMELINES.find(t => t.value === lead.timeline)?.label || lead.timeline || '—'
              } />
              <InfoRow icon={Building2} label="Budget" value={
                lead.budget_min && lead.budget_max
                  ? `${formatPrice(lead.budget_min)} — ${formatPrice(lead.budget_max)}`
                  : lead.budget_min ? `From ${formatPrice(lead.budget_min)}`
                  : lead.budget_max ? `Up to ${formatPrice(lead.budget_max)}`
                  : '—'
              } />
              <InfoRow icon={Clock} label="Created" value={timeAgo(lead.created_at)} />
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setShowWhatsAppModal(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-green-700"
              >
                <MessageSquare className="h-4 w-4" /> WhatsApp
              </button>
              <a
                href={`tel:${lead.phone}`}
                className="inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium hover:bg-accent"
              >
                <Phone className="h-4 w-4" /> Call
              </a>
              {lead.email && (
                <a
                  href={`mailto:${lead.email}`}
                  className="inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium hover:bg-accent"
                >
                  <Mail className="h-4 w-4" /> Email
                </a>
              )}
            </div>
          </div>

          {/* Property Card */}
          {lead.property && (
            <div className={cn('rounded-xl border bg-card p-6', mobileTab === 'info' ? 'block' : 'hidden lg:block')}>
              <h2 className="text-lg font-semibold mb-3">Interested Property</h2>
              <Link
                href={`/properties/${lead.property.slug}`}
                className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-accent"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{lead.property.title}</p>
                  <p className="text-sm text-muted-foreground">{lead.property.city} · {formatPrice(lead.property.price)}</p>
                </div>
              </Link>
            </div>
          )}

          {/* Matched Properties Section */}
          <div className={cn(mobileTab === 'matches' ? 'block' : 'hidden lg:block')}>
            <LeadPropertyMatches matches={matchedProperties} lead={lead} />
          </div>

          {/* Schedule Visit */}
          <div className={cn('rounded-xl border bg-card p-6', mobileTab === 'notes' ? 'block' : 'hidden lg:block')}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Schedule Visit</h2>
              <button
                type="button"
                onClick={() => setShowVisitForm(!showVisitForm)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
              >
                <CalendarCheck className="h-3.5 w-3.5" />
                {showVisitForm ? 'Cancel' : 'Plan a Visit'}
              </button>
            </div>
            {showVisitForm && (
              <form onSubmit={handleScheduleVisit} className="space-y-3 mt-3 rounded-lg border bg-muted/30 p-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Date *</label>
                    <input
                      name="visit_date"
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="flex h-9 w-full rounded-lg border bg-background px-3 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Time *</label>
                    <input
                      name="visit_time"
                      type="time"
                      required
                      className="flex h-9 w-full rounded-lg border bg-background px-3 text-sm"
                    />
                  </div>
                </div>
                {lead.property && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span>{lead.property.title} — {lead.property.city}</span>
                  </p>
                )}
                <button
                  type="submit"
                  disabled={schedulingVisit}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {schedulingVisit ? 'Scheduling...' : 'Confirm Visit'}
                </button>
              </form>
            )}
          </div>

          {/* Status Change */}
          <div className={cn('rounded-xl border bg-card p-6', mobileTab === 'info' ? 'block' : 'hidden lg:block')}>
            <h2 className="text-lg font-semibold mb-3">Change Status</h2>
            <div className="flex flex-wrap gap-2">
              {Object.entries(LEAD_STATUS_CONFIG).map(([key, cfg]) => (
                <button
                  key={key}
                  type="button"
                  disabled={lead.status === key || changingStatus}
                  onClick={() => {
                    if (key === 'LOST') {
                      const reason = prompt('Raison de perte:\n1. Budget inadapté\n2. Pas intéressé\n3. Sans réponse\n4. Acheté ailleurs\n5. Projet reporté\n6. Autre')
                      const reasons = ['budget_mismatch', 'not_interested', 'no_response', 'bought_elsewhere', 'postponed', 'other']
                      const idx = parseInt(reason || '0') - 1
                      if (idx >= 0 && idx < reasons.length) handleStatusChange(key, reasons[idx])
                    } else {
                      handleStatusChange(key)
                    }
                  }}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium border transition-all ${
                    lead.status === key
                      ? `${cfg.bgClass} ${cfg.textClass} ring-2 ring-offset-2 ring-offset-background`
                      : 'hover:bg-accent disabled:opacity-50'
                  }`}
                >
                  {cfg.label}
                </button>
              ))}
            </div>
          </div>

          {/* Assign Agent */}
          <div className={cn('rounded-xl border bg-card p-6', mobileTab === 'info' ? 'block' : 'hidden lg:block')}>
            <h2 className="text-lg font-semibold mb-3">Assigned Agent</h2>
            {lead.assigned_agent ? (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {getInitials(lead.assigned_agent.full_name)}
                </div>
                <div>
                  <p className="font-medium">{lead.assigned_agent.full_name}</p>
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById('reassign-select') as HTMLSelectElement
                      if (el) el.classList.toggle('hidden')
                    }}
                    className="text-xs text-primary hover:underline"
                  >
                    Reassign
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mb-2">No agent assigned</p>
            )}
            <select
              id="reassign-select"
              onChange={(e) => handleAssign(e.target.value)}
              className={`mt-2 h-9 w-full rounded-lg border bg-background px-3 text-sm ${lead.assigned_agent ? 'hidden' : ''}`}
              defaultValue=""
            >
              <option value="" disabled>Select agent...</option>
              {agents.map((a) => (
                <option key={a.id} value={a.id}>{a.full_name} ({a.role})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Column — Notes + Activities + Follow-up */}
        <div className="space-y-6">
          {/* Schedule Follow-up */}
          <div className={cn('rounded-xl border bg-card p-5', mobileTab === 'info' ? 'block' : 'hidden lg:block')}>
            <h3 className="text-sm font-semibold mb-3">Next Follow-up</h3>
            {lead.next_follow_up_at && (
              <p className="text-sm mb-2 flex items-center gap-1.5">
                <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span>
                  {new Date(lead.next_follow_up_at).toLocaleDateString('fr-FR', {
                    weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
                  })}
                </span>
              </p>
            )}
            <input
              type="datetime-local"
              onChange={(e) => e.target.value && handleFollowUp(e.target.value)}
              className="flex h-9 w-full rounded-lg border bg-background px-3 text-sm"
            />
          </div>

          {/* Add Note */}
          <div className={cn('rounded-xl border bg-card p-5', mobileTab === 'notes' ? 'block' : 'hidden lg:block')}>
            <h3 className="text-sm font-semibold mb-3">Add Note</h3>
            <div className="space-y-2">
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Write a note..."
                rows={3}
                className="flex w-full rounded-lg border bg-background px-3 py-2 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <button
                type="button"
                onClick={handleAddNote}
                disabled={!noteContent.trim() || submittingNote}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" />
                {submittingNote ? 'Saving...' : 'Add Note'}
              </button>
            </div>
          </div>

          {/* Notes List */}
          {notes.length > 0 && (
            <div className={cn('rounded-xl border bg-card p-5', mobileTab === 'notes' ? 'block' : 'hidden lg:block')}>
              <h3 className="text-sm font-semibold mb-3">Notes ({notes.length})</h3>
              <div className="space-y-3">
                {notes.map((note: any) => (
                  <div key={note.id} className="rounded-lg bg-muted/50 p-3">
                    <p className="text-sm">{note.content}</p>
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{note.author?.full_name || 'Agent'}</span>
                      <span>·</span>
                      <span>{timeAgo(note.created_at)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activity Timeline */}
          <div className={cn('rounded-xl border bg-card p-5', mobileTab === 'activity' ? 'block' : 'hidden lg:block')}>
            <h3 className="text-sm font-semibold mb-3">Activity Timeline</h3>
            <ActivityTimeline activities={activities} />
          </div>
        </div>
      </div>

      {/* WhatsApp Chat & Template Panel Modal */}
      {showWhatsAppModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-hidden rounded-2xl border bg-card shadow-2xl animate-in zoom-in-95 duration-200">
            <WhatsAppChatPanel
              leadId={lead.id}
              leadName={lead.name}
              leadPhone={lead.phone}
              propertyTitle={lead.property?.title}
              onClose={() => setShowWhatsAppModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  )
}
