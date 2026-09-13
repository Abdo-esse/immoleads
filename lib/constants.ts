// ═══════════════════════════════════════════
// Lead Statuses
// ═══════════════════════════════════════════

export const LEAD_STATUSES = [
  'NEW',
  'CONTACTED',
  'QUALIFIED',
  'VISIT_SCHEDULED',
  'NEGOTIATION',
  'WON',
  'LOST',
] as const

export const LEAD_STATUS_CONFIG: Record<
  (typeof LEAD_STATUSES)[number],
  { label: string; color: string; bgClass: string; textClass: string }
> = {
  NEW: {
    label: 'New',
    color: '#3b82f6',
    bgClass: 'bg-blue-100 dark:bg-blue-900/30',
    textClass: 'text-blue-700 dark:text-blue-400',
  },
  CONTACTED: {
    label: 'Contacted',
    color: '#eab308',
    bgClass: 'bg-yellow-100 dark:bg-yellow-900/30',
    textClass: 'text-yellow-700 dark:text-yellow-400',
  },
  QUALIFIED: {
    label: 'Qualified',
    color: '#8b5cf6',
    bgClass: 'bg-purple-100 dark:bg-purple-900/30',
    textClass: 'text-purple-700 dark:text-purple-400',
  },
  VISIT_SCHEDULED: {
    label: 'Visit Scheduled',
    color: '#22c55e',
    bgClass: 'bg-green-100 dark:bg-green-900/30',
    textClass: 'text-green-700 dark:text-green-400',
  },
  NEGOTIATION: {
    label: 'Negotiation',
    color: '#f97316',
    bgClass: 'bg-orange-100 dark:bg-orange-900/30',
    textClass: 'text-orange-700 dark:text-orange-400',
  },
  WON: {
    label: 'Won',
    color: '#10b981',
    bgClass: 'bg-emerald-100 dark:bg-emerald-900/30',
    textClass: 'text-emerald-700 dark:text-emerald-400',
  },
  LOST: {
    label: 'Lost',
    color: '#ef4444',
    bgClass: 'bg-red-100 dark:bg-red-900/30',
    textClass: 'text-red-700 dark:text-red-400',
  },
}

// Kanban-visible statuses (LOST is handled separately)
export const KANBAN_STATUSES = LEAD_STATUSES.filter((s) => s !== 'LOST')

// ═══════════════════════════════════════════
// Lost Reasons
// ═══════════════════════════════════════════

export const LOST_REASONS = [
  { value: 'budget_mismatch', label: 'الميزانية غير مناسبة', labelFr: 'Budget inadapté' },
  { value: 'not_interested', label: 'العقار ما عجبوش', labelFr: 'Pas intéressé' },
  { value: 'no_response', label: 'ما كيجاوبش', labelFr: 'Sans réponse' },
  { value: 'bought_elsewhere', label: 'اشترى من جهة أخرى', labelFr: 'Acheté ailleurs' },
  { value: 'postponed', label: 'المشروع تأجل', labelFr: 'Projet reporté' },
  { value: 'other', label: 'سبب آخر', labelFr: 'Autre raison' },
] as const

// ═══════════════════════════════════════════
// Property Types
// ═══════════════════════════════════════════

export const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Appartement', labelAr: 'شقة' },
  { value: 'villa', label: 'Villa', labelAr: 'فيلا' },
  { value: 'studio', label: 'Studio', labelAr: 'ستوديو' },
  { value: 'riad', label: 'Riad', labelAr: 'رياض' },
  { value: 'terrain', label: 'Terrain', labelAr: 'أرض' },
  { value: 'commercial', label: 'Commercial', labelAr: 'محل تجاري' },
] as const

export const TRANSACTION_TYPES = [
  { value: 'sale', label: 'Vente', labelAr: 'شراء' },
  { value: 'rent', label: 'Location', labelAr: 'كراء' },
] as const

export const PROPERTY_STATUSES = [
  { value: 'active', label: 'Active' },
  { value: 'draft', label: 'Draft' },
  { value: 'sold', label: 'Sold' },
  { value: 'rented', label: 'Rented' },
] as const

// ═══════════════════════════════════════════
// Moroccan Cities
// ═══════════════════════════════════════════

export const CITIES = [
  'Casablanca',
  'Rabat',
  'Marrakech',
  'Tanger',
  'Agadir',
  'Fès',
  'Meknès',
  'Oujda',
  'Kénitra',
  'Tétouan',
  'Salé',
  'Mohammedia',
  'El Jadida',
  'Essaouira',
] as const

// ═══════════════════════════════════════════
// Lead Sources
// ═══════════════════════════════════════════

export const LEAD_SOURCES = [
  { value: 'website', label: 'Website', icon: 'Globe' },
  { value: 'facebook', label: 'Facebook', icon: 'Facebook' },
  { value: 'instagram', label: 'Instagram', icon: 'Instagram' },
  { value: 'google', label: 'Google Ads', icon: 'Search' },
  { value: 'referral', label: 'Referral', icon: 'Users' },
  { value: 'other', label: 'Other', icon: 'MoreHorizontal' },
] as const

// ═══════════════════════════════════════════
// Lead Timelines
// ═══════════════════════════════════════════

export const LEAD_TIMELINES = [
  { value: 'immediate', label: 'Immédiat', labelAr: 'فورا' },
  { value: '1-3months', label: '1 à 3 mois', labelAr: '1 - 3 أشهر' },
  { value: '3-6months', label: '3 à 6 mois', labelAr: '3 - 6 أشهر' },
  { value: '6months+', label: 'Plus de 6 mois', labelAr: 'أكثر من 6 أشهر' },
] as const

// ═══════════════════════════════════════════
// Visit Statuses
// ═══════════════════════════════════════════

export const VISIT_STATUSES = [
  { value: 'SCHEDULED', label: 'Scheduled', color: 'blue' },
  { value: 'COMPLETED', label: 'Completed', color: 'green' },
  { value: 'CANCELLED', label: 'Cancelled', color: 'gray' },
  { value: 'NO_SHOW', label: 'No Show', color: 'red' },
] as const

// ═══════════════════════════════════════════
// Activity Action Types
// ═══════════════════════════════════════════

export const ACTIVITY_ACTIONS = {
  lead_created: 'Lead created',
  agent_assigned: 'Agent assigned',
  status_changed: 'Status changed',
  note_added: 'Note added',
  visit_scheduled: 'Visit scheduled',
  visit_completed: 'Visit completed',
  whatsapp_sent: 'WhatsApp sent',
  follow_up_scheduled: 'Follow-up scheduled',
  follow_up_completed: 'Follow-up completed',
} as const

// ═══════════════════════════════════════════
// Budget Ranges (for form display)
// ═══════════════════════════════════════════

export const BUDGET_RANGES = [
  { min: 0, max: 500000, label: 'Moins de 500,000 DH' },
  { min: 500000, max: 1000000, label: '500,000 - 1,000,000 DH' },
  { min: 1000000, max: 2000000, label: '1,000,000 - 2,000,000 DH' },
  { min: 2000000, max: 3500000, label: '2,000,000 - 3,500,000 DH' },
  { min: 3500000, max: 5000000, label: '3,500,000 - 5,000,000 DH' },
  { min: 5000000, max: 99999999, label: 'Plus de 5,000,000 DH' },
] as const
