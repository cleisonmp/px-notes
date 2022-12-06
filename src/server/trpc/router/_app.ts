import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { router } from '../trpc'
import { authRouter } from './auth'
import { exampleRouter } from './example'
import { tagRouter } from './tag'
import { userRouter } from './user'

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  tag: tagRouter,
  user: userRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
export type AppRouterInputs = inferRouterInputs<AppRouter>
export type AppRouterOutputs = inferRouterOutputs<AppRouter>

//example usage
//type CreateUserInputs = AppRouterInputs['user']['createUser']
