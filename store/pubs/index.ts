import create from 'zustand'
import { Pub } from '@joshub/types/pubs'
import { useUser } from '@supabase/auth-helpers-react'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'

interface PubsState {
  pub?: Pub

  setPub: (pub: Pub) => void
}

export const usePubsStore = create<PubsState>(set => ({
  setPub: pub => set({ pub })
}))

interface UsePubReturn {
  pub?: Pub
  isLoading: boolean
}
type UsePub = () => UsePubReturn

export const usePub: UsePub = () => {
  const { pub, setPub } = usePubsStore()
  const user = useUser()

  const fetchPub = async (): Promise<Pub> => {
    const { data } = await axios.get(`/api/pubs?owner=${user?.id ?? ''}`)

    return data
  }

  const { data: fetchedPub, isFetching } = useQuery(
    ['pubs', user?.id],
    fetchPub,
    {
      enabled: user !== undefined && user !== null && pub === undefined,
      retry: false,
      refetchOnWindowFocus: false
    }
  )

  useEffect(() => {
    if (fetchedPub !== undefined) {
      setPub(fetchedPub)
    }
  }, [fetchedPub])

  return {
    pub: pub ?? fetchedPub,
    isLoading: isFetching
  }
}
