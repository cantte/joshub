import '../styles/globals.css'
import '@tremor/react/dist/esm/tremor.css'

import type { AppProps, AppType } from 'next/app'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

const App: AppType = ({ Component, pageProps }: AppProps) => {
  const [supabase] = useState(() => createBrowserSupabaseClient())
  return (
    <SessionContextProvider supabaseClient={supabase}
                            initialSession={pageProps.initialSession}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </SessionContextProvider>
  )
}

export default App
