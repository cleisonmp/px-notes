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
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().optional(),
    newPassword: z.string().min(8),
  })
  .refine(
    ({ currentPassword, newPassword }) => currentPassword !== newPassword,
    {
      // Refinement functions should return a falsy value to signal failure.
      message: 'New passwords must be different from current password.',
      path: ['newPassword'],
    },
  )
