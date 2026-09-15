import { Database } from './database'

// ═══════════════════════════════════════════
// Table Row Types (convenience aliases)
// ═══════════════════════════════════════════
export type Agency = Database['public']['Tables']['agencies']['Row']
export type AgencyInsert = Database['public']['Tables']['agencies']['Insert']
export type AgencyUpdate = Database['public']['Tables']['agencies']['Update']

export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type Property = Database['public']['Tables']['properties']['Row']
export type PropertyInsert = Database['public']['Tables']['properties']['Insert']
export type PropertyUpdate = Database['public']['Tables']['properties']['Update']

export type Lead = Database['public']['Tables']['leads']['Row']
export type LeadInsert = Database['public']['Tables']['leads']['Insert']
export type LeadUpdate = Database['public']['Tables']['leads']['Update']

export type LeadNote = Database['public']['Tables']['lead_notes']['Row']
export type LeadNoteInsert = Database['public']['Tables']['lead_notes']['Insert']

export type Visit = Database['public']['Tables']['visits']['Row']
export type VisitInsert = Database['public']['Tables']['visits']['Insert']
export type VisitUpdate = Database['public']['Tables']['visits']['Update']

export type LeadActivity = Database['public']['Tables']['lead_activities']['Row']
export type LeadActivityInsert = Database['public']['Tables']['lead_activities']['Insert']

export type DemoRequest = Database['public']['Tables']['demo_requests']['Row']
export type DemoRequestInsert = Database['public']['Tables']['demo_requests']['Insert']
export type DemoRequestUpdate = Database['public']['Tables']['demo_requests']['Update']

// ═══════════════════════════════════════════
// Enum Types
// ═══════════════════════════════════════════
export type LeadStatus = Lead['status']
export type LostReason = NonNullable<Lead['lost_reason']>
export type PropertyType = Property['type']
export type PropertyStatus = Property['status']
export type TransactionType = Property['transaction_type']
export type VisitStatus = Visit['status']
export type UserRole = Profile['role']
export type DemoRequestStatus = DemoRequest['status']
export type LeadTimeline = NonNullable<Lead['timeline']>
export type LeadSource = NonNullable<Lead['source']>

// ═══════════════════════════════════════════
// Joined / Extended Types (used in components)
// ═══════════════════════════════════════════

/** Lead with related property and assigned agent info */
export type LeadWithRelations = Lead & {
  property: Pick<Property, 'id' | 'title' | 'slug' | 'city' | 'price'> | null
  assigned_agent: Pick<Profile, 'id' | 'full_name' | 'avatar_url'> | null
}

/** Property with assigned agent info */
export type PropertyWithAgent = Property & {
  assigned_agent: Pick<Profile, 'id' | 'full_name' | 'avatar_url'> | null
}

/** Visit with lead, property, and agent info */
export type VisitWithRelations = Visit & {
  lead: Pick<Lead, 'id' | 'name' | 'phone'> | null
  property: Pick<Property, 'id' | 'title' | 'slug' | 'city'> | null
  agent: Pick<Profile, 'id' | 'full_name'> | null
}

/** Lead note with author info */
export type LeadNoteWithAuthor = LeadNote & {
  author: Pick<Profile, 'id' | 'full_name' | 'avatar_url'> | null
}

/** Activity with user info */
export type LeadActivityWithUser = LeadActivity & {
  user: Pick<Profile, 'id' | 'full_name'> | null
}

// ═══════════════════════════════════════════
// Dashboard / Analytics Types
// ═══════════════════════════════════════════

export interface DashboardKPIs {
  newLeadsToday: number
  followUpsDue: number
  qualifiedThisWeek: number
  visitsScheduled: number
}

export interface ConversionMetrics {
  leadToQualifiedPct: number
  qualifiedToVisitPct: number
}

export interface SourceBreakdown {
  source: string
  leadCount: number
  qualifiedCount: number
}

// ═══════════════════════════════════════════
// Kanban Types
// ═══════════════════════════════════════════

export interface KanbanColumn {
  id: LeadStatus
  title: string
  leads: LeadWithRelations[]
}
