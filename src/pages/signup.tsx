import type { NextPage } from 'next'

const SignUp: NextPage = () => {
  return (
    <main className='mx-auto flex flex-col gap-4'>
      <h1>Create your account</h1>
      <p>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Earum,
        tempore!
      </p>
      <form className='flex flex-col gap-2 border p-4'>
        <label htmlFor=''>
          Email:
          <input type='text' placeholder='mail@mail.com' />
        </label>
        <label htmlFor=''>
          Password:
          <input type='password' />
        </label>
        <label htmlFor=''>
          Confirm Password:
          <input type='password' />
        </label>
        <button type='submit' className='rounded-full bg-app-primary px-4 py-2'>
          Create
        </button>
      </form>
      <button>Sign UP with Discord</button>
      <button>Sign UP with GitHub</button>
    </main>
  )
}
export default SignUp
