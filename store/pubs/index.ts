import create from 'zustand'
import { Pub } from '@joshub/types/pubs'

interface PubsState {
  pub?: Pub

  setPub: (pub: Pub) => void
}

export const usePubsStore = create<PubsState>((set) => ({
  setPub: (pub) => set({ pub })
}))

type UsePub = () => Pub | undefined

export const usePub: UsePub = () => {
  const { pub } = usePubsStore()

  return pub
}
