import { z } from 'zod'
import { pgUuidRegex } from './lead'

export const propertySchema = z.object({
  title: z.string().min(3, 'Le titre doit contenir au moins 3 caractères'),
  description: z.string().optional(),
  price: z.coerce.number().positive('Le prix doit être supérieur à 0'),
  city: z.string().min(1, 'La ville est requise'),
  district: z.string().optional(),
  type: z.enum(['apartment', 'villa', 'studio', 'riad', 'terrain', 'commercial'], {
    message: 'Type de bien invalide',
  }),
  transaction_type: z.enum(['sale', 'rent'], {
    message: 'Type de transaction invalide',
  }),
  bedrooms: z.coerce.number().int().min(0).optional().nullable(),
  bathrooms: z.coerce.number().int().min(0).optional().nullable(),
  area: z.coerce.number().positive().optional().nullable(),
  status: z.enum(['active', 'draft', 'sold', 'rented']).default('draft'),
  assigned_agent_id: z.string().regex(pgUuidRegex, 'Agent invalide').optional().nullable(),
  images: z.array(z.string().url()).default([]),
  features: z.any().optional().nullable(),
})

export type PropertyFormValues = z.infer<typeof propertySchema>
