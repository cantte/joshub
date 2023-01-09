import React, { FC } from 'react'
import { Product } from '@joshub/types/products'
import { FormProvider, useForm } from 'react-hook-form'
import { OrderDetailInput } from '@joshub/types/orders'
import ProductField from '@components/shared/form/product.field'
import QuantityField from '@components/shared/form/quantity.field'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const OrderDetailSchema = z
  .object({
    product: z.object({
      code: z.string(),
      quantity: z.coerce.number().optional()
    }),
    quantity: z.coerce
      .number({
        invalid_type_error: 'La cantidad es requerida'
      })
      .min(1, 'La cantidad es requerida'),
    price: z.coerce.number().min(1, 'El precio es requerido')
  })
  .refine(
    data => {
      if (data.product.quantity !== undefined) {
        return data.quantity <= data.product.quantity
      }
      return true
    },
    {
      path: ['quantity'],
      message: 'La cantidad no puede ser mayor a la cantidad disponible'
    }
  )

interface Props {
  onSubmit: (data: OrderDetailInput) => void
}

const OrderDetailForm: FC<Props> = ({ onSubmit }) => {
  const detailForm = useForm<OrderDetailInput>({
    resolver: zodResolver(OrderDetailSchema),
    defaultValues: {
      product: undefined
    }
  })
  const { register, setValue, handleSubmit } = detailForm

  const handleSelectProduct = (product: Product): void => {
    setValue('product', product)
    setValue('price', product.cold_spot_price)
  }

  return (
    <FormProvider {...detailForm}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <div className='grid grid-cols-6 gap-6'>
            <div className='col-span-6'>
              <input
                type='hidden'
                {...register('product', { required: true })}
              />
              <input
                type='hidden'
                {...register('price', {
                  required: true
                })}
              />
              <ProductField
                onSelected={product => {
                  handleSelectProduct(product)
                }}
              />
            </div>

            <div className='col-span-6'>
              <QuantityField />
            </div>

            <div className='mt-6 col-span-6'>
              <button
                type='submit'
                className='text-base w-full px-6 py-3.5 font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 border border-transparent disabled:bg-gray-100 disabled:text-gray-400'
              >
                Agregar producto
              </button>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  )
}

export default OrderDetailForm
