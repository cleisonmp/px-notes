import type { FormEventHandler } from 'react'

import type {
  InferGetServerSidePropsType,
  GetServerSidePropsContext,
  NextPage,
} from 'next'

import { getCsrfToken, signIn } from 'next-auth/react'
import { useRouter } from 'next/router'

import type { SubmitErrorHandler, SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { FaGoogle, FaDiscord } from 'react-icons/fa'

import { getServerAuthSession } from '../server/common/get-server-auth-session'
import { trpc } from '../utils/trpc'
import { createUserSchema } from '../types/schemas/zod/user'

const LoginInputsSchema = createUserSchema
  .extend({
    confirmPassword: z.string().min(8),
  })
  .refine(({ confirmPassword, password }) => confirmPassword === password, {
    // Refinement functions should return a falsy value to signal failure.
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })

export type LoginInputs = z.infer<typeof LoginInputsSchema>

const SignUp: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ csrfToken }) => {
  const router = useRouter()
  const createUser = trpc.user.createUser.useMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>({
    resolver: zodResolver(LoginInputsSchema),
  })

  const handleFormWithError: SubmitErrorHandler<LoginInputs> = (data) => {
    console.log('form with error')
    console.log(data)
  }
  const handleFormValidated: SubmitHandler<LoginInputs> = async (formData) => {
    console.log('Form submitted')
    console.log(formData)
    const { name, email, password } = formData
    const user = await createUser.mutateAsync({
      name,
      email,
      password,
      csrfToken: csrfToken ?? '',
    })
    console.log(user)
    console.log(csrfToken)

    const res = await signIn('credentials', {
      ...formData,
      redirect: false,
    })
    console.log(res)
    if (res?.ok) {
      await router.push('/')
    } else {
      alert(res?.error)
    }
  }

  return (
    <main className='mx-auto flex flex-col gap-4'>
      <h1>Create your account</h1>
      <p>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Earum,
        tempore!
      </p>
      <form
        action=''
        onSubmit={
          handleSubmit(
            handleFormValidated,
            handleFormWithError,
          ) as FormEventHandler<HTMLFormElement>
          // woraround for return type of handleSubmit
          // https://github.com/react-hook-form/react-hook-form/commit/7bfa3747f42ee648d0440c98d37be832a98805f2
        }
        className='flex flex-col gap-2 border p-4'
      >
        <input
          defaultValue={csrfToken}
          type='hidden'
          hidden
          {...register('csrfToken')}
        />
        <label htmlFor=''>
          Name:
          <input type='text' {...register('name')} />
        </label>
        {errors.name && <p role='alert'>{errors.name?.message}</p>}
        <label htmlFor=''>
          Email:
          <input type='email' {...register('email')} />
        </label>
        {errors.email && <p role='alert'>{errors.email?.message}</p>}
        <label htmlFor=''>
          Password:
          <input type='password' {...register('password')} />
        </label>
        {errors.password && <p role='alert'>{errors.password?.message}</p>}
        <label htmlFor=''>
          Confirm Password:
          <input type='password' {...register('confirmPassword')} />
        </label>
        {errors.confirmPassword && (
          <p role='alert'>{errors.confirmPassword?.message}</p>
        )}
        <button type='submit' className='rounded-full bg-app-primary px-4 py-2'>
          Create
        </button>
      </form>

      <button className='flex items-center gap-2'>
        Sign UP with Discord <FaDiscord />
      </button>
      <button className='flex items-center gap-2'>
        Sign UP with Google <FaGoogle />
      </button>
    </main>
  )
}
export default SignUp

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const { req, res } = context

  const session = await getServerAuthSession({
    req,
    res,
  })

  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  }
}
