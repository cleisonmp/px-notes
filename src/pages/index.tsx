import { type NextPage } from 'next'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'

import { FaEye, FaEyeSlash } from 'react-icons/fa'

import { trpc } from '../utils/trpc'
import { Logo } from '../components/common/logo'
import { Input } from '../components/common/input'
import { Seo } from '../components/utils/seo'

const Home: NextPage = () => {
  const hello = trpc.example.hello.useQuery({ text: 'from tRPC' })

  return (
    <>
      <Seo />
      <main className='flex min-h-screen flex-col justify-center'>
        <div className='container mx-auto flex flex-col items-center justify-center gap-12 bg-black px-4 py-16'>
          <div className='flex flex-col items-center gap-2'>
            <Logo />
            <p className='mt-10 text-2xl text-white'>
              {hello.data ? hello.data.greeting : 'Loading tRPC query...'}
            </p>
            <AuthShowcase />
          </div>
        </div>
      </main>
    </>
  )
}

export default Home

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession()
  console.log('sessionData', sessionData)

  const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery(
    undefined, // no input
    {
      enabled: sessionData?.user !== undefined,
    },
  )
  console.log('secretMessage', secretMessage)

  const handleSignOut = () => {
    void signOut()
  }
  return (
    <div className='flex flex-col items-center justify-center gap-4'>
      <p className='text-center text-2xl text-white'>
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <div className='bg-app-background p-4'>
        <Input
          iconProps={{
            hasPasswordToggle: true,
            rightIcon: <FaEye />,
            rightIconHidePass: <FaEyeSlash />,
          }}
          name='password'
          label='Password'
        />
      </div>
      {sessionData ? (
        <button
          className='rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20'
          onClick={handleSignOut}
        >
          Sign out
        </button>
      ) : (
        <Link
          className='rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20'
          href='/signin'
        >
          Sign in
        </Link>
      )}
    </div>
  )
}
