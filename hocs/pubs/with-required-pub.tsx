import { ComponentType, FC, ReactElement, useEffect } from 'react'
import { usePub } from '@joshub/store/pubs'
import { useRouter } from 'next/router'

const withRequiredPub = (Component: ComponentType): FC => {
  const WithRequiredPub = (): ReactElement => {
    const { pub, isLoading } = usePub()

    const router = useRouter()
    useEffect(() => {
      if (isLoading) {
        return
      }

      if (pub !== undefined && pub !== null) {
        return
      }

      void router.push('/pubs/register')
    }, [pub, isLoading])

    return <>{pub !== undefined && pub !== null && <Component />}</>
  }

  return WithRequiredPub
}

export default withRequiredPub
