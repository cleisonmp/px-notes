import { TRPCError } from '@trpc/server'

import {
  createTagSchema,
  updateTagSchema,
} from '../../../types/schemas/zod/tag'
import { compareHash, getHash } from '../../../lib/utils/hash'

import { router, databaseProcedure } from '../trpc'

export const tagRouter = router({
  updateTag: databaseProcedure
    .input(updateTagSchema)
    .mutation(async ({ ctx, input: { title, id } }) => {
      return await ctx.prisma.tag.update({
        where: {
          id,
        },
        data: {
          title,
        },
      })
    }),
  createTag: databaseProcedure
    .input(createTagSchema)
    .mutation(async ({ ctx, input: { tags } }) => {
      const tagsToInsert = tags
        .filter((tag) => !tag.id)
        .map((value) => {
          return { title: value.label, userId: ctx.session.user.id }
        })

      const tagsToUpdate = tags
        .filter((tag) => tag.id)
        .map((value) => {
          return ctx.prisma.tag.update({
            where: {
              id: value.id,
            },
            data: {
              title: value.label,
              userId: ctx.session.user.id,
            },
          })
        })

      return await ctx.prisma.$transaction([
        ctx.prisma.tag.createMany({ data: tagsToInsert }),
        ...tagsToUpdate,
      ])
    }),
})
