import type { NextApiRequest, NextApiResponse } from 'next'
import NextAuth, { type NextAuthOptions } from 'next-auth'
import { encode, decode } from 'next-auth/jwt'
import DiscordProvider from 'next-auth/providers/discord'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'

import { randomUUID } from 'crypto'
import Cookies from 'cookies'

import { env } from '../../../env/server.mjs'
import { prisma } from '../../../server/db/client'

import { CredentialsProvider } from './_providers/credentials'

const COOKIE_NAME = 'next-auth.session-token'

//based of => https://branche.online/next-auth-credentials-provider-with-the-database-session-strategy/
export const prepareNextAuthWithCredentials = (
  req: NextApiRequest,
  res: NextApiResponse,
): [NextApiRequest, NextApiResponse, NextAuthOptions] => {
  //): [req: NextApiRequest, res: NextApiResponse, authOptions: NextAuthOptions] {

  const isCredentialsMode =
    req.query.nextauth?.includes('callback') &&
    req.query.nextauth.includes('credentials') &&
    req.method === 'POST'

  const adapter = PrismaAdapter(prisma)

  const authOptions: NextAuthOptions = {
    adapter: adapter,
    callbacks: {
      session({ session, user }) {
        if (session.user) {
          console.log(
            'if (session.user)',
            'session.user.id=' + session.user.id,
            'user.id=' + user.id,
          )

          session.user.id = user.id
        }
        return session
      },
      async signIn({ user, account, profile, email, credentials }) {
        console.log('signIN Params', user, account, profile, email, credentials)
        console.log('req.query.nextauth=', req.query.nextauth)

        // Check if this sign in callback is being called in the credentials authentication flow.
        // If so, use the next-auth adapter to create a session entry in the database
        // (SignIn is called after authorize so we can safely assume the user is valid and already authenticated).
        if (isCredentialsMode) {
          if (user) {
            const sessionToken = randomUUID()
            const sessionMaxAge = 60 * 60 * 24 * 30 //30Days
            const sessionExpiry = new Date(Date.now() + sessionMaxAge * 1000)

            await adapter.createSession({
              sessionToken: sessionToken,
              userId: user.id,
              expires: sessionExpiry,
            })

            const cookies = new Cookies(req, res)

            cookies.set(COOKIE_NAME, sessionToken, {
              expires: sessionExpiry,
            })
          }
        }

        return true
      },
    },
    jwt: {
      // Customize the JWT encode and decode functions to overwrite the default behavior of storing the JWT token in the session cookie when using credentials providers.
      //Instead we will store the session token reference to the session in the database.
      encode: async ({ token, secret, maxAge }) => {
        if (isCredentialsMode) {
          const cookies = new Cookies(req, res)
          const cookie = cookies.get(COOKIE_NAME)

          if (cookie) return cookie
          else return ''
        }
        // Revert to default behavior when not in the credentials provider callback flow
        return encode({ token, secret, maxAge })
      },
      decode: async ({ token, secret }) => {
        if (isCredentialsMode) {
          return null
        }

        // Revert to default behavior when not in the credentials provider callback flow
        return decode({ token, secret })
      },
    },
    secret: env.NEXTAUTH_SECRET,
    debug: true, //TODO remove debug mode
    providers: [
      CredentialsProvider,
      DiscordProvider({
        clientId: env.DISCORD_CLIENT_ID,
        clientSecret: env.DISCORD_CLIENT_SECRET,
      }),
      GoogleProvider({
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      }),
      // GithubProvider({
      //   clientId: env.GITHUB_CLIENT_ID,
      //   clientSecret: env.GITHUB_CLIENT_SECRET,
      // }),
    ],
  }

  return [req, res, authOptions]
}

// NextAuth Advanced initialization
// https://next-auth.js.org/configuration/initialization#advanced-initialization
const NextAuthHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  return await NextAuth(...prepareNextAuthWithCredentials(req, res))
}

export default NextAuthHandler
