import type { FormEventHandler } from 'react'
import { useState } from 'react'

import type {
  InferGetServerSidePropsType,
  GetServerSidePropsContext,
  NextPage,
} from 'next'

import { getCsrfToken, signIn } from 'next-auth/react'
import { useRouter } from 'next/router'

import type { SubmitHandler } from 'react-hook-form'
import { FormProvider, SubmitErrorHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { FaGoogle, FaDiscord } from 'react-icons/fa'

import { getServerAuthSession } from '../server/common/get-server-auth-session'
import { trpc } from '../utils/trpc'
import { createUserSchema } from '../types/schemas/zod/user'

import type { SelectOptions } from '../components/common/select'
import { Select } from '../components/common/select'
import { createTagSchema } from '../types/schemas/zod/tag'
import { registerClass } from 'superjson'

const options: SelectOptions[] = [
  { value: 'chocolate', label: 'Chocolate', isDisabled: false },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' },
]
export type TagInputs = z.infer<typeof createTagSchema>

const CreateNote: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ csrfToken }) => {
  const router = useRouter()
  const createTag = trpc.tag.createTag.useMutation()

  const methods = useForm<TagInputs>({
    resolver: zodResolver(createTagSchema),
  })
  //const methods = useForm()

  const handleFormValidated: SubmitHandler<TagInputs> = async (formData) => {
    console.log('Form submitted')
    console.log(formData)
    const { tags } = formData
    const tag = await createTag.mutateAsync({
      tags,
      csrfToken: csrfToken ?? '',
    })
    console.log(tag)
  }

  return (
    <main className='mx-auto flex flex-col gap-4'>
      <h1>Create your notes</h1>
      <p>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Earum,
        tempore!
      </p>

      <FormProvider {...methods}>
        <form
          className='flex flex-col items-center gap-4 rounded bg-app-background p-4'
          onSubmit={
            methods.handleSubmit(
              handleFormValidated,
            ) as FormEventHandler<HTMLFormElement>
            // woraround for return type of handleSubmit
            // https://github.com/react-hook-form/react-hook-form/commit/7bfa3747f42ee648d0440c98d37be832a98805f2
          }
        >
          <Select options={options} />

          <button
            type='submit'
            className='rounded-full bg-app-primary px-4 py-2'
          >
            Update
          </button>
        </form>
      </FormProvider>
    </main>
  )
}
export default CreateNote

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const { req, res } = context

  const session = await getServerAuthSession({
    req,
    res,
  })

  if (!session) {
    return {
      redirect: {
        destination: '/signin',
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
