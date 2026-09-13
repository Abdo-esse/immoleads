import { getLeads } from '@/lib/actions/leads'
import { KanbanBoard } from './kanban-board'

export const metadata = { title: 'Pipeline' }

export default async function PipelinePage() {
  const leads = await getLeads()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pipeline</h1>
        <p className="text-muted-foreground">
          Drag and drop leads across stages to update their status.
        </p>
      </div>
      <KanbanBoard leads={leads} />
    </div>
  )
}
