import { z } from 'zod'

// Moroccan phone: 06/07 + 8 digits or +212 6/7 + 8 digits
const moroccanPhoneRegex = /^(\+212|0)(6|7)\d{8}$/

// PostgreSQL UUID regex (supports both standard v4 and deterministic seed UUIDs)
export const pgUuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/

/**
 * Full lead schema (used by API route for validation).
 * Accepts both property-context (4 fields) and general (7 fields) submissions.
 */
export const leadSchema = z.object({
  name: z.string().min(2, 'الاسم مطلوب'),
  phone: z
    .string()
    .min(1, 'رقم الهاتف مطلوب')
    .regex(moroccanPhoneRegex, 'رقم الهاتف غير صالح (06/07xxxxxxxx)'),
  email: z.string().email('البريد الإلكتروني غير صالح').optional().or(z.literal('')),
  budget_min: z.coerce.number().min(0).optional().nullable(),
  budget_max: z.coerce.number().min(0).optional().nullable(),
  city: z.string().optional().nullable(),
  property_type: z.string().optional().nullable(),
  transaction_type: z.enum(['sale', 'rent']).optional().nullable(),
  timeline: z.enum(['immediate', '1-3months', '3-6months', '6months+']).optional().nullable(),
  source: z.enum(['website', 'facebook', 'instagram', 'google', 'referral', 'other']).default('website'),

  // Context fields (set by the system, not user input)
  property_id: z.string().regex(pgUuidRegex, 'Identifiant propriété invalide').optional().nullable(),
  agency_id: z.string().regex(pgUuidRegex, 'Identifiant agence requis'),

  // UTM tracking
  utm_source: z.string().optional().nullable(),
  utm_campaign: z.string().optional().nullable(),
  utm_content: z.string().optional().nullable(),
  referrer: z.string().optional().nullable(),
})

export type LeadFormValues = z.infer<typeof leadSchema>

/**
 * Public form schema — what the visitor fills out.
 * Lighter than the full leadSchema (no agency_id, no UTMs — those are injected server-side).
 */
export const publicLeadFormSchema = z.object({
  name: z.string().min(2, 'الاسم مطلوب'),
  phone: z
    .string()
    .min(1, 'رقم الهاتف مطلوب')
    .regex(moroccanPhoneRegex, 'رقم الهاتف غير صالح'),
  budget_min: z.coerce.number().min(0, 'الميزانية مطلوبة'),
  budget_max: z.coerce.number().min(0, 'الميزانية مطلوبة'),
  timeline: z.enum(['immediate', '1-3months', '3-6months', '6months+'], {
    message: 'اختر المدة',
  }),
  // These are only required when no propertyId is provided
  city: z.string().optional(),
  property_type: z.string().optional(),
  transaction_type: z.enum(['sale', 'rent']).optional(),
})

export type PublicLeadFormValues = z.infer<typeof publicLeadFormSchema>
