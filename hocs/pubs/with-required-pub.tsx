import { ComponentType, FC, ReactElement, useEffect } from 'react'
import { usePubsStore } from '@joshub/store/pubs'
import { useUser } from '@supabase/auth-helpers-react'
import { Pub } from '@joshub/types/pubs'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'

const withRequiredPub = (Component: ComponentType): FC => {
  const WithRequiredPub = (): ReactElement => {
    const { setPub } = usePubsStore()

    const user = useUser()

    const fetchPub = async (): Promise<Pub> => {
      const { data } = await axios.get(`/api/pubs?owner=${user?.id ?? ''}`)

      return data
    }

    const { data: pub } = useQuery(['pubs', user?.id], fetchPub, {
      enabled: user !== undefined && user !== null,
      retry: false,
      refetchOnWindowFocus: false
    })

    const router = useRouter()
    useEffect(() => {
      if (pub !== undefined && pub !== null) {
        setPub(pub)
        return
      }

      void router.push('/pubs/register')
    }, [pub])

    return <>{pub !== undefined && pub !== null && <Component />}</>
  }

  return WithRequiredPub
}

export default withRequiredPub
