import type { NextPage } from 'next'

const SignIn: NextPage = () => {
  return (
    <main className='mx-auto flex flex-col gap-4'>
      <h1>Sign in to your account</h1>
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
        <button type='submit' className='rounded-full bg-app-primary px-4 py-2'>
          Login
        </button>
      </form>
      <button>Sign In with Discord</button>
      <button>Sign In with GitHub</button>
      <p>
        Don&apos;t have an account yet? <a href='$'>SignUp</a>
      </p>
    </main>
  )
}
export default SignIn
