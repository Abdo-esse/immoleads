import { getVisits } from '@/lib/actions/visits'
import { getProperties } from '@/lib/actions/properties'
import { getLeads } from '@/lib/actions/leads'
import { getAgencyAgents } from '@/lib/actions/properties'
import { VisitsClient } from './visits-client'

export const metadata = { title: 'Visits' }

export default async function VisitsPage() {
  const [visits, properties, leads, agents] = await Promise.all([
    getVisits(),
    getProperties(),
    getLeads(),
    getAgencyAgents(),
  ])

  return (
    <VisitsClient
      visits={visits}
      properties={properties}
      leads={leads}
      agents={agents}
    />
  )
}
