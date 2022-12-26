import { FC } from 'react'
import DefaultLayout from '@components/shared/layout/default'
import { ColGrid } from '@tremor/react'
import { PlusIcon } from '@heroicons/react/20/solid'
import SalesCard from '@components/dashboard/sales'
import TotalProductsCard from '@components/dashboard/products'
import ProfitsCard from '@components/dashboard/profits'
import NextLink from 'next/link'
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

          <div>
            <NextLink href='/sales/register'>
              <button className='inline-flex justify-center mr-3 rounded-full border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-indigo-300 focus-visible:ring-offset-2'>
                <PlusIcon className='-ml-1 mr-2 h-5 w-5 text-indigo-900' />
                Registrar venta
              </button>
            </NextLink>
            <NextLink href='/orders/register'>
              <button className='inline-flex justify-center rounded-full border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-indigo-300 focus-visible:ring-offset-2'>
                <PlusIcon className='-ml-1 mr-2 h-5 w-5 text-indigo-900' />
                Registrar domicilio
              </button>
            </NextLink>
          </div>
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
