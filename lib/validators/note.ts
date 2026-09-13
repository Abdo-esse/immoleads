import { z } from 'zod'
import { pgUuidRegex } from './lead'

export const noteSchema = z.object({
  lead_id: z.string().regex(pgUuidRegex, 'Lead is required'),
  content: z.string().min(1, 'Note content is required').max(2000, 'Note is too long'),
})

export type NoteFormValues = z.infer<typeof noteSchema>
