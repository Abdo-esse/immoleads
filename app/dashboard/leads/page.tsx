import { getLeads } from '@/lib/actions/leads'
import { getAgencyAgents } from '@/lib/actions/properties'
import { LeadsClient } from './leads-client'

export const metadata = { title: 'Leads' }

export default async function LeadsPage() {
  const [leads, agents] = await Promise.all([
    getLeads(),
    getAgencyAgents(),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
        <p className="text-muted-foreground">
          {leads.length} lead{leads.length !== 1 ? 's' : ''} in your pipeline.
        </p>
      </div>
      <LeadsClient leads={leads} agents={agents} />
    </div>
  )
}
