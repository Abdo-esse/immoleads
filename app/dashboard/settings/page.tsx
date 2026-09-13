import { getSettingsData } from '@/lib/actions/settings'
import { SettingsClient } from './settings-client'

export const metadata = { title: 'Settings' }

export default async function SettingsPage() {
  const data = await getSettingsData()

  return <SettingsClient data={data} />
}
