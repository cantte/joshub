import { NextPage } from 'next'
import SignUpForm from '@components/auth/sign-up'
import Head from 'next/head'
import NextLink from 'next/link'
import { useSession } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const SignUpPage: NextPage = () => {
  const session = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session !== null) {
      void router.push('/dashboard')
    }
  }, [session])

  return (
    <>
      <Head>
        <title>Joshub</title>
        <meta name='description'
              content='Simplifica la administración de tu bar' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <div className='isolate bg-white min-h-screen'>
        <div
          className='absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]'>
          <svg
            className='relative left-[calc(50%-11rem)] -z-10 h-[21.1875rem] max-w-none -translate-x-1/2 rotate-[30deg] sm:left-[calc(50%-30rem)] sm:h-[42.375rem]'
            viewBox='0 0 1155 678'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              fill='url(#45de2b6b-92d5-4d68-a6a0-9b9b2abad533)'
              fillOpacity='.3'
              d='M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z'
            />
            <defs>
              <linearGradient
                id='45de2b6b-92d5-4d68-a6a0-9b9b2abad533'
                x1='1155.49'
                x2='-78.208'
                y1='.177'
                y2='474.645'
                gradientUnits='userSpaceOnUse'
              >
                <stop stopColor='#9089FC' />
                <stop offset={1} stopColor='#FF80B5' />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <main>
          <div className='max-w-xl mx-auto w-full py-32 px-4'>
            <div className='bg-white p-8 py-12 rounded-lg shadow-xl'>
              <h1 className='text-gray-900 font-bold text-3xl'>
                Crear una cuenta
              </h1>
              <p className='text-gray-600 mt-4 mb-8 leading-relaxed'>
                Crea una cuenta para poder acceder a todos los servicios de la
                plataforma.
              </p>
              <SignUpForm />

              <div className='mt-8'>
                <p className='text-gray-600'>
                  ¿Ya tienes una cuenta?{' '}
                  <NextLink
                    href='/auth/sign-in'
                    className='text-blue-500 hover:underline'
                  >
                    Inicia sesión
                  </NextLink>
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export default SignUpPage
