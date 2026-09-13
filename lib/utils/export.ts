import type { LeadWithRelations } from '@/types'

/**
 * Escapes a cell value for CSV formatting.
 */
function escapeCsvCell(value: any): string {
  if (value === null || value === undefined) return '""'
  const str = String(value).replace(/"/g, '""')
  return `"${str}"`
}

/**
 * Converts a list of leads with relations into a UTF-8 CSV string with BOM for Excel compatibility.
 */
export function exportLeadsToCsv(leads: LeadWithRelations[]): string {
  const headers = [
    'ID',
    'Nom',
    'Téléphone',
    'Email',
    'Statut',
    'Source',
    'Budget (MAD)',
    'Ville recherchée',
    'Bien associé',
    'Agent assigné',
    'Prochaine relance',
    'Date de création',
  ]

  const rows = leads.map((lead) => [
    escapeCsvCell(lead.id),
    escapeCsvCell(lead.name),
    escapeCsvCell(lead.phone),
    escapeCsvCell(lead.email || ''),
    escapeCsvCell(lead.status),
    escapeCsvCell(lead.source || ''),
    escapeCsvCell(lead.budget_min && lead.budget_max ? `${lead.budget_min}-${lead.budget_max}` : (lead.budget_min || lead.budget_max || '')),
    escapeCsvCell((lead as any).city_preference || ''),
    escapeCsvCell(lead.property?.title || ''),
    escapeCsvCell(lead.assigned_agent?.full_name || 'Non assigné'),
    escapeCsvCell(lead.next_follow_up_at ? new Date(lead.next_follow_up_at).toLocaleDateString('fr-MA') : ''),
    escapeCsvCell(new Date(lead.created_at).toLocaleDateString('fr-MA')),
  ])

  const csvContent = [
    headers.join(';'),
    ...rows.map((r) => r.join(';')),
  ].join('\r\n')

  // Prepend UTF-8 BOM so Excel opens it with correct encoding for French accents and Arabic
  return '\uFEFF' + csvContent
}

/**
 * Triggers a browser download of the CSV content.
 */
export function downloadCsv(filename: string, csvContent: string) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
