import { type NextPage } from 'next'
import Link from 'next/link'
import { getCsrfToken, signOut, useSession } from 'next-auth/react'

import type { SubmitErrorHandler, SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { FaEye, FaEyeSlash } from 'react-icons/fa'

import { Logo } from '../components/common/logo'
import { Input } from '../components/common/input'
import { Seo } from '../components/utils/seo'
import { trpc } from '../utils/trpc'
import { changePasswordSchema } from '../types/schemas/zod/user'
import type { FormEventHandler } from 'react'
import { useState } from 'react'

type ChangePasswordInputs = z.infer<typeof changePasswordSchema>

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
  console.log('============AuthShowcase=============')
  const { data: sessionData } = useSession()
  console.log('sessionData', sessionData)

  const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery(
    undefined, // no input
    {
      enabled: sessionData?.user !== undefined,
    },
  )
  console.log('secretMessage', secretMessage)

  const changePassword = trpc.user.changePassword.useMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordInputs>({
    resolver: zodResolver(changePasswordSchema),
  })

  const handleSignOut = () => {
    void signOut()
  }

  const handleFormWithError: SubmitErrorHandler<ChangePasswordInputs> = (
    data,
  ) => {
    console.log('form with error')
    console.log(data)
  }
  const handleFormValidated: SubmitHandler<ChangePasswordInputs> = async (
    formData,
  ) => {
    console.log('Form submitted')
    console.log(formData)

    const user = await changePassword.mutateAsync({
      ...formData,
      csrfToken: (await getCsrfToken()) ?? '',
    })
    console.log(user)
    void signOut({ callbackUrl: '/signin' })
  }

  return (
    <div className='flex flex-col items-center justify-center gap-4'>
      <p className='text-center text-2xl text-white'>
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>

      {sessionData && (
        <form
          className='flex flex-col items-center gap-4 rounded bg-app-background p-4'
          onSubmit={
            handleSubmit(
              handleFormValidated,
            ) as FormEventHandler<HTMLFormElement>
            // woraround for return type of handleSubmit
            // https://github.com/react-hook-form/react-hook-form/commit/7bfa3747f42ee648d0440c98d37be832a98805f2
          }
        >
          <Input
            iconProps={{
              hasPasswordToggle: true,
              rightIcon: <FaEye />,
              rightIconHidePass: <FaEyeSlash />,
            }}
            {...register('currentPassword')}
            helperText={errors.currentPassword?.message}
            label='Old Password'
          />
          <Input
            iconProps={{
              hasPasswordToggle: true,
              rightIcon: <FaEye />,
              rightIconHidePass: <FaEyeSlash />,
            }}
            {...register('newPassword')}
            helperText={errors.newPassword?.message}
            label='New Password'
          />
          <button
            type='submit'
            className='rounded-full bg-app-primary px-4 py-2'
          >
            Update
          </button>
        </form>
      )}
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
