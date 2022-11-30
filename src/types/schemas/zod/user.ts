import { z } from 'zod'

export const createUserSchema = z.object({
  name: z.string().min(1),
  email: z
    .string()
    .email()
    .transform((email) => email.toLowerCase()),
  password: z.string().min(8),
  csrfToken: z.string(),
})
