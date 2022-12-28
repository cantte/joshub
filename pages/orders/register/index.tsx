import { FC } from 'react'
import DefaultLayout from '@components/shared/layout/default'
import RegisterOrderForm from '@components/orders/register'
import { withRequiredAuth } from '@joshub/shared/auth/with-required-auth'
import withRequiredPub from '@joshub/hocs/pubs/with-required-pub'

const RegisterOrderPage: FC = () => {
  return (
    <DefaultLayout>
      <main>
        <div className='w-full px-4'>
          <div className='bg-white p-8 py-12 rounded-lg shadow-xl'>
            <h1 className='text-gray-900 font-bold text-3xl'>
              Registrar orden
            </h1>
            <p className='text-gray-600 mt-4 mb-8 leading-relaxed'></p>

            <RegisterOrderForm />
          </div>
        </div>
      </main>
    </DefaultLayout>
  )
}

export const getServerSideProps = withRequiredAuth

export default withRequiredPub(RegisterOrderPage)
