import { FC } from 'react'
import DefaultLayout from '@components/shared/layout/default'
import RegisterCustomerForm from '@components/customers/register'
import { withRequiredAuth } from '@joshub/shared/auth/with-required-auth'
import withRequiredPub from '@joshub/hocs/pubs/with-required-pub'

const RegisterClientPage: FC = () => {
  return (
    <DefaultLayout>
      <div className='max-w-xl mx-auto w-full px-4'>
        <div className='bg-white p-8 py-12 rounded-lg shadow-xl'>
          <h1 className='text-gray-900 font-bold text-3xl'>
            Registrar cliente
          </h1>
          <p className='text-gray-600 mt-4 mb-8 leading-relaxed'></p>

          <RegisterCustomerForm />
        </div>
      </div>
    </DefaultLayout>
  )
}

export const getServerSideProps = withRequiredAuth

export default withRequiredPub(RegisterClientPage)
