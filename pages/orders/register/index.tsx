import { FC } from 'react'
import DefaultLayout from '@components/shared/layout/default'
import RegisterOrderForm from '@components/orders/register'
import { withRequiredAuth } from '@joshub/shared/auth/with-required-auth'
import withRequiredPub from '@joshub/hocs/pubs/with-required-pub'

const RegisterOrderPage: FC = () => {
  return (
    <DefaultLayout>
      <div className='flex flex-col mb-5'>
        <div className='flex flex-row justify-between'>
          <h1 className='text-2xl font-semibold text-gray-900'>
            Registrar domicilio
          </h1>
        </div>
      </div>

      <RegisterOrderForm />
    </DefaultLayout>
  )
}

export const getServerSideProps = withRequiredAuth

export default withRequiredPub(RegisterOrderPage)
