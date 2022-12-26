import { FC } from 'react'
import DefaultLayout from '@components/shared/layout/default'
import { ColGrid } from '@tremor/react'
import SalesCard from '@components/dashboard/sales'
import TotalProductsCard from '@components/dashboard/products'
import ProfitsCard from '@components/dashboard/profits'
import SalesTable from '@components/sales/table'
import OrdersTable from '@components/orders/table'
import { withRequiredAuth } from '@joshub/shared/auth/with-required-auth'
import withRequiredPub from '@joshub/hocs/pubs/with-required-pub'

const Home: FC = () => {
  return (
    <DefaultLayout>
      <div className='flex flex-col mb-10'>
        <div className='flex flex-row justify-between'>
          <h1 className='text-4xl text-gray-900'>Bienvenido</h1>
        </div>
      </div>

      <h2 className='text-2xl text-gray-700'>Reporte diario</h2>

      <div className='sm:rounded-md'>
        <div className='mb-7'>
          <div className='mt-4'>
            <ColGrid numColsSm={2} numColsLg={3} gapX='gap-x-6' gapY='gap-y-6'>
              <SalesCard />
              <ProfitsCard />
              <TotalProductsCard />
            </ColGrid>
          </div>
        </div>
      </div>

      <h2 className='text-2xl text-gray-700'>Últimas ventas</h2>
      <SalesTable />

      <h2 className='text-2xl text-gray-700 mt-7'>Últimos domicilios</h2>
      <OrdersTable />
    </DefaultLayout>
  )
}

export const getServerSideProps = withRequiredAuth

export default withRequiredPub(Home)
