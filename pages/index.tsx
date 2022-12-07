import { FC } from 'react'
import DefaultLayout from '@components/shared/layout/default'
import { ColGrid } from '@tremor/react'
import { PlusIcon } from '@heroicons/react/20/solid'
import SalesCard from '@components/dashboard/sales'
import TotalProductsCard from '@components/dashboard/products'
import ProfitsCard from '@components/dashboard/profits'

const Home: FC = () => {
  return (
    <DefaultLayout>
      <div className="flex flex-col mb-5">
        <div className="flex flex-row justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Panel de
            control</h1>

          <div>
            <button
              className="inline-flex justify-center mr-3 rounded-full border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-indigo-300 focus-visible:ring-offset-2">
              <PlusIcon className="-ml-1 mr-2 h-5 w-5 text-indigo-900"/>
              Registrar venta
            </button>
            <button
              className="inline-flex justify-center rounded-full border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-indigo-300 focus-visible:ring-offset-2">
              <PlusIcon className="-ml-1 mr-2 h-5 w-5 text-indigo-900"/>
              Registrar domicilio
            </button>
          </div>
        </div>
      </div>

      <div className="sm:rounded-md">
        <div className="bg-white px-4 py-5 sm:p-6">
          <div className="mt-4">
            <ColGrid numColsSm={2} numColsLg={3} gapX="gap-x-6" gapY="gap-y-6">
              <SalesCard/>
              <ProfitsCard/>
              <TotalProductsCard/>
            </ColGrid>
          </div>
        </div>
      </div>
    </DefaultLayout>
  )
}

export default Home
