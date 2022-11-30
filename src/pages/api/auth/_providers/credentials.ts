import Provider from 'next-auth/providers/credentials'
import { compareHash } from '../../../../lib/utils/hash'
import { prisma } from '../../../../server/db/client'

export const CredentialsProvider = Provider({
  name: 'Credentials',
  credentials: {
    email: { label: 'Email', type: 'email', placeholder: 'mail@mail.com' },
    password: { label: 'Password', type: 'password' },
  },
  async authorize(credentials) {
    console.log('credentials', credentials)

    if (!credentials) {
      console.error(`Something broke, credentials are missing.`)
      throw new Error('internal-server-error')
    }

    const user = await prisma.user.findUnique({
      where: {
        email: credentials?.email.toLowerCase(),
      },
      /*select: {
        id: true,
        email: true,
        emailVerified: true,
        image: true,
        name: true,
        password: true,
      },*/
    })
    if (!user) {
      throw new Error('invalid-credentials')
    }

    const isCorrectPassword = await compareHash(
      credentials.password,
      user.password ?? '',
    )
    if (!isCorrectPassword) {
      throw new Error('invalid-credentials')
    }

    console.log('=================user=======================', user)

    return user
  },
})

//const caller = appRouter.createCaller({ prisma, session: null })
//const result = await caller.user.createUser({email,password})
/*if (!user) {
      console.log('going to create')

      const caller = appRouter.createCaller({ prisma, session: null })
      console.log('going to call')
      try {
        const result = await caller.user.createUser({
          email,
          password: 'password',
        })
        console.log('try', result)
        return result
      } catch (error) {
        console.error(error)
      }

      return null
    }*/

/*if (user.password === null) return null

    if (user.password !== credentials?.password) return null*/
