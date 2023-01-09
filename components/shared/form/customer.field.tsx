import { FC, useState } from 'react'
import { Customer } from '@joshub/types/customers'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

interface Props {
  onSelected: (value: Customer) => void
}

const CustomerField: FC<Props> = ({ onSelected }) => {
  const [search, setSearch] = useState('')
  const [customerId, setCustomerId] = useState<string>('')

  const handleChange = (text: string): void => {
    setSearch(text)
  }

  const {
    isFetching,
    error,
    data: customer
  } = useQuery<Customer>(
    ['customer', customerId],
    async () => {
      const { data } = await axios.get<Customer>(`/api/customers/${customerId}`)
      return data
    },
    {
      enabled: customerId !== undefined && customerId !== '',
      retry: false,
      refetchOnWindowFocus: false,
      onSuccess: customer => {
        onSelected(customer)
      }
    }
  )

  const handleEnter = (): void => {
    setCustomerId(search)
  }

  return (
    <>
      <label className='block'>
        <span className='block'>Identificación del cliente</span>
        <div className='relative'>
          <input
            type='text'
            onChange={e => {
              handleChange(e.target.value)
            }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleEnter()
              }
            }}
            disabled={isFetching}
            className='block border text-lg px-4 py-3 mt-2 rounded-lg border-gray-200 focus:bg-white text-gray-900 focus:border-blue-600 focus:ring-0 outline-none w-full  disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed'
          />
          <button
            type='button'
            onClick={handleEnter}
            disabled={isFetching}
            className='absolute py-2 px-3 right-2.5 bottom-2.5 text-xs font-medium text-center inline-flex text-blue-900 border-blue-100 rounded-lg hover:border-blue-200 border border-transparent'
          >
            Buscar
          </button>
        </div>
      </label>
      {error != null && (
        <p className='text-sm text-red-600 mt-1'>
          No se encontró ningún cliente con esa identificación
        </p>
      )}

      {customer != null && (
        <div className='p-4 mt-3 w-full text-gray-500 bg-white rounded-lg border dark:bg-gray-800 dark:text-gray-400'>
          <div className='flex'>
            <div className='inline-flex flex-shrink-0 justify-center items-center w-8 h-8 text-blue-500 bg-blue-100 rounded-lg dark:text-blue-300 dark:bg-blue-900'>
              <svg
                className='w-6 h-6'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                ></path>
              </svg>
              <span className='sr-only'>Refresh icon</span>
            </div>
            <div className='ml-3 text-sm font-normal'>
              <span className='mb-1 text-sm font-semibold text-gray-900 dark:text-white'>
                {customer.id}
              </span>
              <div className='text-sm font-normal'>{customer.name}</div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default CustomerField
