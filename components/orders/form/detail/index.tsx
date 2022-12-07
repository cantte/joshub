import React, { FC } from 'react'
import { Product } from '@joshub/types/products'
import { useForm } from 'react-hook-form'
import { OrderDetailInput } from '@joshub/types/orders'
import ProductField from '@components/shared/form/product.field'

interface Props {
  onSubmit: (data: OrderDetailInput) => void
}

const OrderDetailForm: FC<Props> = ({ onSubmit }) => {
  const {
    register,
    setValue,
    getValues,
    resetField,
    watch,
    formState: { isValid }
  } = useForm<OrderDetailInput>()

  const handleSelectProduct = (product: Product): void => {
    setValue('product', product)
    setValue('price', product.cold_spot_price)
  }

  const handleOnSubmit = (): void => {
    if (isValid) {
      const values = getValues()
      onSubmit(values)

      resetField('quantity')
    }
  }

  return (
    <div className="mt-5">
      <div className="shadow sm:rounded-md">
        <div className="bg-white px-4 py-5 sm:p-6">
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-span-3">
              <input type="hidden" {...register('product', { required: true })} />
              <input type="hidden" {...register('price', {
                required: true,
                max: watch('product.cold_spot_price')
              })} />
              <ProductField
                onSelected={product => handleSelectProduct(product)}/>
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="quantity"
                     className="block text-sm font-medium text-gray-700">
                Cantidad
              </label>
              <input type="number"
                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                     id="quantity" {...register('quantity', {
                       required: true,
                       max: watch('product.quantity')
                     })}/>

              {watch('product.quantity') !== undefined &&
                <span className="text-gray-400 text-xs block py-1">Cantidad máxima: {watch('product.quantity')}</span>}
            </div>

            <div className="col-span-6">
              <button type="button"
                      onClick={handleOnSubmit}
                      className="inline-flex justify-center mr-3 rounded-full border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-indigo-300 focus-visible:ring-offset-2">
                Agregar producto
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetailForm
