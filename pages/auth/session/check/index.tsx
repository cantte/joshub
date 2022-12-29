import { NextPage } from 'next'
import useCurrentEmployee from '@joshub/hooks/employees/use-current-employee'
import Head from 'next/head'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { withRequiredAuth } from '@joshub/shared/auth/with-required-auth'
import { usePubsStore } from '@joshub/store/pubs'
import { Pub } from '@joshub/types/pubs'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

const SessionCheckPage: NextPage = () => {
  const { employee, isLoading: isLoadingEmployee } = useCurrentEmployee()
  const { setPub } = usePubsStore()

  const fetchPub = async (pubId: string): Promise<Pub> => {
    const { data } = await axios.get(`/api/pubs/${pubId}`)
    return data
  }

  const { data: pub, isFetching: isLoadingPub } = useQuery(
    ['pub', employee?.pub_id],
    async () => await fetchPub(employee?.pub_id ?? ''),
    {
      enabled: employee !== undefined && employee !== null,
      retry: false
    }
  )

  const router = useRouter()
  useEffect(() => {
    if (isLoadingEmployee || isLoadingPub) {
      return
    }

    if (
      employee !== undefined &&
      employee !== null &&
      pub !== undefined &&
      pub !== null
    ) {
      setPub(pub)
    }
    void router.push('/dashboard')
  }, [employee, isLoadingEmployee, isLoadingPub])

  return (
    <>
      <Head>
        <title>Joshub</title>
        <meta
          name='description'
          content='Simplifica la administración de tu bar'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <div className='isolate bg-white min-h-screen'>
        <div className='absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]'>
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
          <div className='mx-auto max-w-screen-xl py-32 lg:px-12'>
            <div>
              <h1 className='text-4xl font-bold tracking-tight sm:text-center sm:text-6xl'>
                Estamos verificando tu sesión...
              </h1>

              <p className='mt-6 text-xl text-gray-500 sm:text-center sm:text-2xl'>
                Si no eres redirigido en unos segundos, por favor, intenta
                recargar la página.
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export const getServerSideProps = withRequiredAuth

export default SessionCheckPage
