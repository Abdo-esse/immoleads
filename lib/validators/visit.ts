import { z } from 'zod'
import { pgUuidRegex } from './lead'

export const visitSchema = z.object({
  lead_id: z.string().regex(pgUuidRegex, 'Lead is required'),
  property_id: z.string().regex(pgUuidRegex, 'Property is required').optional().nullable(),
  agent_id: z.string().regex(pgUuidRegex, 'Agent is required').optional().nullable(),
  visit_date: z.string().min(1, 'Date is required'),
  visit_time: z.string().min(1, 'Time is required'),
  notes: z.string().optional(),
})

export type VisitFormValues = z.infer<typeof visitSchema>

export const visitStatusSchema = z.object({
  status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW']),
  notes: z.string().optional(),
})

export type VisitStatusValues = z.infer<typeof visitStatusSchema>
