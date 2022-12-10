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
      <label htmlFor="quantity"
             className="block text-sm font-medium text-gray-700">
        Cantidad
      </label>
      <input type="number"
             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
             id="quantity" {...register('quantity', {
               required: {
                 value: true,
                 message: 'La cantidad es requerida'
               },
               max: {
                 value: watch('product.quantity'),
                 message: 'La cantidad no puede ser mayor a la existencia'
               },
               min: {
                 value: 1,
                 message: 'La cantidad no puede ser menor a 1'
               },
               pattern: {
                 value: /^[0-9]+$/i,
                 message: 'Solo se permiten números'
               }
             })}/>

      {watch('product')?.quantity !== undefined && errors.quantity?.message === undefined &&
        <span
          className="text-gray-400 text-xs block py-1">Cantidad máxima: {watch('product.quantity')}</span>}

      {errors.quantity?.message !== undefined &&
        <span className="text-red-500 text-xs block py-1">
                    {errors.quantity.message}
                  </span>
      }
    </>
  )
}

export default QuantityField
