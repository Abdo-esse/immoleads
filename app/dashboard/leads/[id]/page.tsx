import { notFound } from 'next/navigation'
import { getLeadById, getLeadNotes, getLeadActivities } from '@/lib/actions/leads'
import { getAgencyAgents } from '@/lib/actions/properties'
import { getMatchingProperties } from '@/lib/actions/matching'
import { LeadDetailClient } from './lead-detail-client'

export const metadata = { title: 'Lead Detail' }

interface Props {
  params: Promise<{ id: string }>
}

export default async function LeadDetailPage({ params }: Props) {
  const { id } = await params
  const [lead, notes, activities, agents] = await Promise.all([
    getLeadById(id),
    getLeadNotes(id),
    getLeadActivities(id),
    getAgencyAgents(),
  ])

  if (!lead) notFound()

  // Fetch matching properties for this lead
  const matchedProperties = await getMatchingProperties(lead)

  return (
    <LeadDetailClient
      lead={lead}
      notes={notes}
      activities={activities}
      agents={agents}
      matchedProperties={matchedProperties}
    />
  )
}
