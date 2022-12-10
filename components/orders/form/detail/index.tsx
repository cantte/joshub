import React, { FC } from 'react'
import { Product } from '@joshub/types/products'
import { FormProvider, useForm } from 'react-hook-form'
import { OrderDetailInput } from '@joshub/types/orders'
import ProductField from '@components/shared/form/product.field'
import QuantityField from '@components/shared/form/quantity.field'

interface Props {
  onSubmit: (data: OrderDetailInput) => void
}

const OrderDetailForm: FC<Props> = ({ onSubmit }) => {
  const detailForm = useForm<OrderDetailInput>({
    defaultValues: {
      product: undefined
    }
  })
  const {
    register,
    setValue,
    handleSubmit
  } = detailForm

  const handleSelectProduct = (product: Product): void => {
    setValue('product', product)
    setValue('price', product.cold_spot_price)
  }

  return (
    <div className="mt-5">
      <FormProvider {...detailForm}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="sm:rounded-md">
            <div className="bg-white px-4">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6">
                  <input
                    type="hidden" {...register('product', { required: true })} />
                  <input type="hidden" {...register('price', {
                    required: true
                  })} />
                  <ProductField
                    onSelected={product => handleSelectProduct(product)}/>
                </div>

                <div className="col-span-6">
                  <QuantityField/>
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
      </FormProvider>
    </div>
  )
}

export default OrderDetailForm
