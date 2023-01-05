import { FC } from 'react'
import { Product } from '@joshub/types/products'
import ProductField from '@components/shared/form/product.field'
import { FormProvider, useForm } from 'react-hook-form'
import { SaleDetailInput } from '@joshub/types/sales'
import QuantityField from '@components/shared/form/quantity.field'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const SaleDetailSchema = z
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
  onSubmit: (data: SaleDetailInput) => void
}

const SaleDetailForm: FC<Props> = ({ onSubmit }) => {
  const detailForm = useForm<SaleDetailInput>({
    resolver: zodResolver(SaleDetailSchema),
    defaultValues: {
      product: undefined
    }
  })
  const { register, setValue, watch, handleSubmit } = detailForm

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
                onSelected={product => { handleSelectProduct(product) }}
              />
            </div>

            <div className='col-span-6'>
              <QuantityField />
            </div>

            {Boolean(watch('product')) && (
              <div className='col-span-6'>
                <fieldset className='grid gap-6 md:grid-cols-2'>
                  <legend className='sr-only'>Precios</legend>

                  <div className='flex items-center pl-4 rounded border border-gray-200 dark:border-gray-700'>
                    <input
                      type='radio'
                      value={watch('product.cold_spot_price')}
                      checked={
                        watch('price') === watch('product.cold_spot_price')
                      }
                      className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                      onChange={event => { setValue('price', Number(event.target.value)) }
                      }
                    />
                    <label className='py-4 ml-2 w-full text-sm font-medium text-gray-900 dark:text-gray-300'>
                      Precio punto frio: $
                      {Intl.NumberFormat('es').format(
                        watch('product.cold_spot_price')
                      )}
                    </label>
                  </div>

                  <div className='flex items-center pl-4 rounded border border-gray-200 dark:border-gray-700'>
                    <input
                      type='radio'
                      value={watch('product.watertight_price')}
                      checked={
                        watch('price') === watch('product.watertight_price')
                      }
                      className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                      onChange={event => { setValue('price', Number(event.target.value)) }
                      }
                    />
                    <label className='py-4 ml-2 w-full text-sm font-medium text-gray-900 dark:text-gray-300'>
                      Precio estanco: $
                      {Intl.NumberFormat('es').format(
                        watch('product.watertight_price')
                      )}
                    </label>
                  </div>
                </fieldset>
              </div>
            )}

            <div className='col-span-6 pt-5'>
              <button
                type='submit'
                className='text-base w-full px-6 py-3.5 font-medium text-center text-indigo-900 bg-indigo-100 rounded-full hover:bg-indigo-200 border border-transparent disabled:bg-gray-100 disabled:text-gray-400'
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

export default SaleDetailForm
