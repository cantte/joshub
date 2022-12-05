import { FC } from 'react'
import { Auth, ThemeSupa } from '@supabase/auth-ui-react'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'

const LoginPage: FC = () => {
  const session = useSession()
  const supabase = useSupabaseClient()

  return (
    <div>
      {(session == null)
        ? (
          <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }}/>
          )
        : (
          <div>
            <h1>Logged in!</h1>
            <button onClick={async () => await supabase.auth.signOut()}>Sign
              out
            </button>
          </div>
          )}
    </div>
  )
}

export default LoginPage
