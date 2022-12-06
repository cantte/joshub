import { FC, useEffect } from 'react'
import { Auth, ThemeSupa } from '@supabase/auth-ui-react'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'

const Login: FC = () => {
  const session = useSession()
  const supabase = useSupabaseClient()
  const router = useRouter()

  useEffect(() => {
    if (session != null) {
      void router.push('/').then(() => {
      })
    }
  }, [session, router])

  return (
    <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }}/>
  )
}

export default Login
