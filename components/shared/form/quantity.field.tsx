import { FC } from 'react'
import { useFormContext } from 'react-hook-form'
import { TransactionDetailInput } from '@joshub/types/shared'

const QuantityField: FC = () => {
  const {
    register,
    watch,
    formState: { errors }
  } = useFormContext<TransactionDetailInput>()

  return (
    <>
      <label className="block">
        <span className="block">Cantidad</span>
        <input
          type="number"
          disabled={watch('product')?.quantity === undefined || watch('product')?.quantity === null}
          className="block border text-lg px-4 py-3 mt-2 rounded-lg border-gray-200 focus:bg-white text-gray-900 focus:border-blue-600 focus:ring-0 outline-none w-full  disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
          {...register('quantity')}
        />

        {watch('product')?.quantity !== undefined && (
            <span className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Cantidad máxima: {watch('product.quantity')}
            </span>
        )}

        {errors.quantity != null && (
          <p className="text-sm text-red-600 mt-1">{errors.quantity.message}</p>
        )}
      </label>
    </>
  )
}

export default QuantityField
