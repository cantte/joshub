import { type FC } from 'react'
import axios, { type AxiosError } from 'axios'
import { type SingleSale } from '@joshub/types/sales'
import { useQuery } from '@tanstack/react-query'
import TransactionDetailInputCard from '@components/shared/transactions/details/card'

interface Props {
  id: string
}

const SaleView: FC<Props> = ({ id }) => {
  const loadSale = async (): Promise<SingleSale> => {
    const { data } = await axios.get<SingleSale>(`/api/sales/${id}`)
    return data
  }

  const {
    data: sale,
    isLoading,
    error
  } = useQuery<SingleSale, AxiosError>(['sale', id], loadSale)

  return (
    <>
      {isLoading && <p>Loading...</p>}
      {Boolean(error) && <p>Error: {error?.message}</p>}
      {sale != null && (
        <div className='grid grid-cols-6 gap-6'>
          <div className='col-span-6 sm:col-span-3'>
            <h3 className='text-2xl text-gray-900 mb-3'>Productos</h3>

            <div>
              <ul>
                {sale.items.map(item => (
                  <TransactionDetailInputCard
                    key={`${item.product?.code ?? ''}-${String(item.price)}`}
                    detail={item}
                  />
                ))}
              </ul>
            </div>
          </div>

          <div className='col-span-6 sm:col-span-3'>
            <h3 className='text-2xl text-gray-900 mb-3'>Detalles</h3>

            <div className='p-3 mt-2 w-full text-gray-500 bg-white rounded-lg border dark:bg-gray-800 dark:text-gray-400'>
              <div className='ml-3 text-sm font-normal'>
                <span className='mb-1 text-base font-semibold text-gray-900 dark:text-white'>
                  Cliente
                </span>
                <div className='text-sm font-normal'>{sale.customer.name}</div>
              </div>
            </div>

            <div className='p-3 mt-2 w-full text-gray-500 bg-white rounded-lg border dark:bg-gray-800 dark:text-gray-400'>
              <div className='ml-3 text-sm font-normal'>
                <span className='mb-1 text-base font-semibold text-gray-900 dark:text-white'>
                  Empleado
                </span>
                <div className='text-sm font-normal'>{sale.employee.name}</div>
              </div>
            </div>
          </div>

          <div className='col-span-6 sm:col-span-3 sm:col-start-4'>
            <h3 className='mb-2 text-2xl font-semibold text-gray-900 dark:text-white'>
              Resumen
            </h3>

            <div className='flex justify-between'>
              <p className='text-gray-600 dark:text-gray-400'>
                Fecha de creación
              </p>
              <p className='text-gray-600 dark:text-gray-400'>
                {Intl.DateTimeFormat('es').format(new Date(sale.created_at))}
              </p>
            </div>

            <div className='flex justify-between'>
              <p className='text-gray-600 dark:text-gray-400'>
                Productos comprados
              </p>
              <p className='text-gray-600 dark:text-gray-400'>
                {Intl.NumberFormat('es').format(
                  sale.items.reduce((acc, item) => acc + item.quantity, 0)
                )}
              </p>
            </div>

            <div className='flex justify-between'>
              <p className='text-gray-600 dark:text-gray-400'>Total</p>
              <p className='text-gray-600 dark:text-gray-400'>
                ${Intl.NumberFormat('es').format(sale.total)}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default SaleView
