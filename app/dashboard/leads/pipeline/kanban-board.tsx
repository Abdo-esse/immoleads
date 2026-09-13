'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from '@hello-pangea/dnd'
import { Phone, MessageSquare, User, X } from 'lucide-react'
import { updateLeadStatus } from '@/lib/actions/leads'
import { LEAD_STATUS_CONFIG, KANBAN_STATUSES, LOST_REASONS } from '@/lib/constants'
import { formatPhone, timeAgo } from '@/lib/utils'
import { buildWhatsAppUrl, buildCRMOutreachMessage } from '@/lib/whatsapp'
import type { LeadWithRelations } from '@/types'

interface Props {
  leads: LeadWithRelations[]
}

export function KanbanBoard({ leads }: Props) {
  const router = useRouter()
  const [optimisticLeads, setOptimisticLeads] = useState(leads)
  const [showLostModal, setShowLostModal] = useState<string | null>(null)
  const [showLost, setShowLost] = useState(false)

  // Group leads by status
  const columns = KANBAN_STATUSES.map((status) => ({
    id: status,
    ...LEAD_STATUS_CONFIG[status],
    leads: optimisticLeads.filter((l) => l.status === status),
  }))

  const lostLeads = optimisticLeads.filter((l) => l.status === 'LOST')

  const handleDragEnd = useCallback(
    async (result: DropResult) => {
      const { draggableId, destination, source } = result
      if (!destination) return
      if (destination.droppableId === source.droppableId && destination.index === source.index) return

      const newStatus = destination.droppableId

      // If dropping into LOST, show modal for reason
      if (newStatus === 'LOST') {
        setShowLostModal(draggableId)
        return
      }

      // Optimistic update
      setOptimisticLeads((prev) =>
        prev.map((l) =>
          l.id === draggableId ? { ...l, status: newStatus as any } : l
        )
      )

      const result2 = await updateLeadStatus(draggableId, newStatus)
      if (result2?.error) {
        toast.error(result2.error)
        setOptimisticLeads(leads)
      } else {
        toast.success(`Lead moved to ${LEAD_STATUS_CONFIG[newStatus as keyof typeof LEAD_STATUS_CONFIG]?.label}`)
        router.refresh()
      }
    },
    [leads, router]
  )

  const handleLostConfirm = async (reason: string) => {
    if (!showLostModal) return

    const leadId = showLostModal
    setShowLostModal(null)

    setOptimisticLeads((prev) =>
      prev.map((l) =>
        l.id === leadId ? { ...l, status: 'LOST' as const, lost_reason: reason as any } : l
      )
    )

    const result = await updateLeadStatus(leadId, 'LOST', reason)
    if (result?.error) {
      toast.error(result.error)
      setOptimisticLeads(leads)
    } else {
      toast.success('Lead marked as lost')
      router.refresh()
    }
  }

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-6" style={{ minHeight: 'calc(100vh - 240px)' }}>
          {columns.map((col) => (
            <Droppable key={col.id} droppableId={col.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex w-72 shrink-0 flex-col rounded-xl border transition-colors ${
                    snapshot.isDraggingOver ? 'bg-accent/50 border-primary/50' : 'bg-muted/30'
                  }`}
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: col.color }}
                      />
                      <span className="text-sm font-semibold">{col.label}</span>
                    </div>
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1.5 text-[10px] font-medium">
                      {col.leads.length}
                    </span>
                  </div>

                  {/* Cards */}
                  <div className="flex-1 space-y-2 p-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 340px)' }}>
                    {col.leads.map((lead, index) => (
                      <Draggable key={lead.id} draggableId={lead.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`rounded-lg border bg-card p-3 shadow-sm transition-shadow ${
                              snapshot.isDragging ? 'shadow-lg ring-2 ring-primary/30 rotate-2' : 'hover:shadow-md'
                            }`}
                          >
                            <Link href={`/dashboard/leads/${lead.id}`}>
                              <p className="text-sm font-medium truncate">{lead.name}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{formatPhone(lead.phone)}</p>
                            </Link>

                            {/* Property tag */}
                            {lead.property && (
                              <div className="mt-2">
                                <span className="inline-block rounded bg-accent px-1.5 py-0.5 text-[10px] truncate max-w-full">
                                  {lead.property.title}
                                </span>
                              </div>
                            )}

                            {/* Footer */}
                            <div className="mt-2.5 flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                {lead.assigned_agent ? (
                                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[8px] font-semibold text-primary" title={lead.assigned_agent.full_name}>
                                    {lead.assigned_agent.full_name.split(' ').map(w => w[0]).join('').toUpperCase()}
                                  </div>
                                ) : (
                                  <User className="h-4 w-4 text-muted-foreground/50" />
                                )}
                                <span className="text-[10px] text-muted-foreground">
                                  {timeAgo(lead.created_at)}
                                </span>
                              </div>
                              <div className="flex gap-0.5">
                                <a
                                  href={buildWhatsAppUrl('212669808310', buildCRMOutreachMessage(lead.name, lead.property?.title))}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex h-6 w-6 items-center justify-center rounded text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MessageSquare className="h-3 w-3" />
                                </a>
                                <a
                                  href={`tel:${lead.phone}`}
                                  className="inline-flex h-6 w-6 items-center justify-center rounded hover:bg-accent"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Phone className="h-3 w-3" />
                                </a>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}

          {/* LOST Column (droppable) */}
          <Droppable droppableId="LOST">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`flex w-72 shrink-0 flex-col rounded-xl border transition-colors ${
                  snapshot.isDraggingOver ? 'bg-red-50 dark:bg-red-900/20 border-red-400' : 'bg-muted/30'
                }`}
              >
                <div className="flex items-center justify-between px-4 py-3 border-b">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
                    <span className="text-sm font-semibold">Lost</span>
                  </div>
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 px-1.5 text-[10px] font-medium text-red-700 dark:text-red-400">
                    {lostLeads.length}
                  </span>
                </div>
                <div className="flex-1 space-y-2 p-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 340px)' }}>
                  {showLost ? (
                    lostLeads.map((lead, index) => (
                      <div key={lead.id} className="rounded-lg border bg-card p-3 opacity-60">
                        <p className="text-sm font-medium truncate">{lead.name}</p>
                        <p className="text-xs text-muted-foreground">{lead.lost_reason || 'Lost'}</p>
                      </div>
                    ))
                  ) : lostLeads.length > 0 ? (
                    <button
                      onClick={() => setShowLost(true)}
                      className="w-full rounded-lg border border-dashed p-3 text-xs text-muted-foreground hover:bg-accent"
                    >
                      Show {lostLeads.length} lost lead{lostLeads.length > 1 ? 's' : ''}
                    </button>
                  ) : (
                    <p className="p-3 text-xs text-center text-muted-foreground">Drop leads here to mark as lost</p>
                  )}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>

      {/* Lost Reason Modal */}
      {showLostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowLostModal(null)}>
          <div className="w-full max-w-sm rounded-xl bg-card border shadow-xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Reason for Loss</h3>
              <button onClick={() => setShowLostModal(null)} className="rounded-md p-1 hover:bg-accent">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2">
              {LOST_REASONS.map((reason) => (
                <button
                  key={reason.value}
                  onClick={() => handleLostConfirm(reason.value)}
                  className="flex w-full items-center gap-3 rounded-lg border p-3 text-sm transition-colors hover:bg-accent"
                >
                  <span className="flex-1 text-left">{reason.labelFr}</span>
                  <span className="text-xs text-muted-foreground">{reason.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
