import { getProperties } from '@/lib/actions/properties'
import { PropertiesClient } from './properties-client'

export const metadata = { title: 'Properties' }

export default async function PropertiesPage() {
  const properties = await getProperties()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Properties</h1>
          <p className="text-muted-foreground">
            Manage your property listings.
          </p>
        </div>
      </div>
      <PropertiesClient properties={properties} />
    </div>
  )
}
