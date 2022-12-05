import { getCsrfToken } from 'next-auth/react'
import superjson from 'superjson'
import { z } from 'zod'
import { initTRPC, TRPCError } from '@trpc/server'
import { type Context } from './context'

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape
  },
})

export const router = t.router

/**
 * Unprotected procedure
 **/
export const publicProcedure = t.procedure

/**
 * Reusable middleware to ensure
 * users are logged in
 */
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx?.session || !ctx.session.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  })
})

/**
 * Protected procedure
 **/
export const protectedProcedure = t.procedure.use(isAuthed)

/**
 * Database procedures helpers
 **/
const csrfTokenSchema = z.object({
  csrfToken: z.string(),
})
type csrfTokenInputType = z.infer<typeof csrfTokenSchema>

const hasCsrfToken = t.middleware(async ({ ctx, next, input }) => {
  const { csrfToken } = input as csrfTokenInputType

  const serverCsrfToken = await getCsrfToken({ req: ctx.req })

  if (csrfToken !== serverCsrfToken) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'WRONG_TOKEN',
    })
  }

  return next({
    ctx,
  })
})

/**
 * Database procedures require auth and csrfToken
 * @example  csrfToken: await getCsrfToken()
 **/
export const databaseProcedure = t.procedure
  .input(csrfTokenSchema)
  .use(hasCsrfToken)
  .use(isAuthed)
