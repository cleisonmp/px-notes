import { TRPCError } from '@trpc/server'
import { getCsrfToken } from 'next-auth/react'
import { z } from 'zod'

import { createUserSchema } from '../../../types/schemas/zod/user'
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
          ({ currentPassword, newPassword }) => currentPassword !== newPassword,
          {
            // Refinement functions should return a falsy value to signal failure.
            message: 'New passwords must be different from current password.',
            path: ['newPassword'],
          },
        ),
    )
    .mutation(
      async ({ ctx, input: { newPassword, currentPassword: oldPassword } }) => {
        const currentPasswordFromDatabase = (
          await ctx.prisma.user.findUnique({
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
    .input(createUserSchema)
    .mutation(async ({ ctx, input: { name, email, password, csrfToken } }) => {
      const serverCsrfToken = await getCsrfToken({ req: ctx.req })

      if (csrfToken !== serverCsrfToken) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'WRONG_TOKEN',
        })
      }
      const userAlreadyExists = await ctx.prisma.user.findUnique({
        where: {
          email,
        },
        select: {
          id: true,
        },
      })

      if (userAlreadyExists) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'USER_ALREADY_EXISTS',
        })
      }

      return await ctx.prisma.user.create({
        data: {
          name,
          email,
          password: await getHash(password),
        },
      })
    }),
})
