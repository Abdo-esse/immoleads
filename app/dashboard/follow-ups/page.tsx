import { getFollowUpsList } from '@/lib/actions/leads'
import { FollowUpsClient } from './follow-ups-client'

export const metadata = { title: 'Follow-ups' }

export default async function FollowUpsPage() {
  const data = await getFollowUpsList()

  return <FollowUpsClient data={data} />
}
