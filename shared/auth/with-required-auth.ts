import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

export const withRequiredAuth: GetServerSideProps<{}> = async (
  context: GetServerSidePropsContext
) => {
  const supabase = createServerSupabaseClient(context)
  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (session == null) {
    return {
      redirect: {
        destination: '/auth/sign-in',
        permanent: false
      }
    }
  }

  return {
    props: {
      initialSession: session
    }
  }
}
