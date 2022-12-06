import { z } from 'zod'

export const csrfTokenSchema = z.object({
  csrfToken: z.string(),
})
export type csrfTokenInputType = z.infer<typeof csrfTokenSchema>

export const createTagSchema = z.object({
  tags: z.array(
    z.object({
      id: z.string().optional(),
      value: z.union([z.string(), z.number()]),
      label: z.string(),
    }),
  ),
})

export const updateTagSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
})
