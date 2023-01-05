import { FC } from 'react'
import { TransactionDetailInput } from '@joshub/types/shared'

interface Props {
  detail: TransactionDetailInput

  onDeleted: (detail: TransactionDetailInput) => void
}

const TransactionDetailInputCard: FC<Props> = ({ detail, onDeleted }) => {
  return (
    <div className='p-3 mt-2 w-full text-gray-500 bg-white rounded-lg border dark:bg-gray-800 dark:text-gray-400'>
      <div className='flex'>
        <div className='ml-3 text-sm font-normal'>
          <span className='mb-1 text-base font-semibold text-gray-900 dark:text-white'>
            {detail.product?.name}
          </span>
          <div className='text-sm font-normal'>
            Precio de venta: ${Intl.NumberFormat('es').format(detail.price)}
          </div>
          <div className='text-sm font-normal'>
            Cantidad: {Intl.NumberFormat('es').format(detail.quantity)}
          </div>
          <span className='mb-1 text-sm font-semibold text-gray-900 dark:text-white'>
            Total: $
            {Intl.NumberFormat('es').format(detail.quantity * detail.price)}
          </span>
        </div>

        <button
          type='button'
          onClick={() => { onDeleted(detail) }}
          className='ml-auto -mx-1.5 -my-1.5 bg-white text-red-400 hover:text-red-500 rounded-lg p-1.5 hover:bg-red-100 inline-flex h-8 w-8'
          aria-label='Close'
        >
          <span className='sr-only'>Close</span>
          <svg
            className='w-5 h-5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
            ></path>
          </svg>
        </button>
      </div>
    </div>
  )
}

export default TransactionDetailInputCard
