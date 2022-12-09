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
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<OrderDetailInput>({
    defaultValues: {
      product: undefined
    },
    reValidateMode: 'onChange'
  })

  const handleSelectProduct = (product: Product): void => {
    setValue('product', product)
    setValue('price', product.cold_spot_price)
  }

  return (
    <div className="mt-5">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="sm:rounded-md">
          <div className="bg-white px-4">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6">
                <input
                  type="hidden" {...register('product', { required: true })} />
                <input type="hidden" {...register('price', {
                  required: true,
                  max: watch('product.cold_spot_price')
                })} />
                <ProductField
                  onSelected={product => handleSelectProduct(product)}/>
              </div>

              <div className="col-span-6">
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

                {watch('product.quantity') !== undefined && errors.quantity?.message === undefined &&
                  <span className="text-gray-400 text-xs block py-1">Cantidad máxima: {watch('product.quantity')}</span>}

                {errors.quantity?.message !== undefined &&
                  <span className="text-red-500 text-xs block py-1">
                    {errors.quantity.message}
                  </span>
                }
              </div>

              <div className="col-span-6 pt-5">
                <button type="submit"
                        className="inline-flex w-full justify-center rounded-full border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:bg-gray-200 disabled:text-gray-400">
                  Agregar producto
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default OrderDetailForm
