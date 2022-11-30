import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { compareHash, getHash } from '../../../lib/utils/hash'

import { router, publicProcedure, protectedProcedure } from '../trpc'

export const userRouter = router({
  changePassword: protectedProcedure
    .input(
      z
        .object({
          currentPassword: z.string().optional(),
          newPassword: z.string().min(8),
        })
        .refine(
          ({ currentPassword, newPassword }) => currentPassword === newPassword,
          {
            message: 'New passwords must be different from current password.',
            path: ['newPassword'],
          },
        ),
    )
    .mutation(
      async ({ ctx, input: { newPassword, currentPassword: oldPassword } }) => {
        const currentPasswordFromDatabase = (
          await ctx.prisma.user.findFirst({
            where: {
              id: ctx.session.user.id,
            },
            select: {
              password: true,
            },
          })
        )?.password

        // if user already has a password validate it
        // accounts from providers don't have a password at the start
        if (currentPasswordFromDatabase) {
          const isCorrectPassword = await compareHash(
            oldPassword ?? '',
            currentPasswordFromDatabase,
          )
          if (!isCorrectPassword) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'WRONG_PASSWORD',
            })
          }

          if (oldPassword === currentPasswordFromDatabase) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'NEW_PASSWORD_EQUALS_OLD',
            })
          }
        }

        return await ctx.prisma.user.update({
          where: {
            id: ctx.session.user.id,
          },
          data: {
            password: await getHash(newPassword),
          },
        })
      },
    ),
  createUser: publicProcedure
    .input(
      z.object({
        email: z
          .string()
          .email()
          .transform((email) => email.toLowerCase()),
        password: z.string().min(8),
      }),
    )
    .mutation(async ({ ctx, input: { email, password } }) => {
      return await ctx.prisma.user.create({
        data: {
          email,
          password: await getHash(password),
        },
      })
    }),
})
