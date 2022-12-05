import { TRPCError } from '@trpc/server'

import {
  changePasswordSchema,
  createUserSchema,
} from '../../../types/schemas/zod/user'
import { compareHash, getHash } from '../../../lib/utils/hash'

import { router, publicProcedure, databaseProcedure } from '../trpc'

export const userRouter = router({
  changePassword: databaseProcedure
    .input(changePasswordSchema)
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
    .mutation(async ({ ctx, input: { name, email, password } }) => {
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
