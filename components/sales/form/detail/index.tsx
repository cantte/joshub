import { FC } from 'react'
import { Product } from '@joshub/types/products'
import ProductField from '@components/shared/form/product.field'
import { useForm } from 'react-hook-form'
import { SaleDetailInput } from '@joshub/types/sales'
import { RadioGroup } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/24/outline'

interface Props {
  onSubmit: (data: SaleDetailInput) => void
}

const SaleDetailForm: FC<Props> = ({ onSubmit }) => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
    handleSubmit
  } = useForm<SaleDetailInput>({
    defaultValues: {
      product: undefined
    }
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
                  required: true
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

              {Boolean(watch('product')) && (
                <div className="col-span-6 sm:col-span-6">
                  <RadioGroup value={watch('price')}
                              onChange={e => setValue('price', e)}>
                    <RadioGroup.Label
                      className="sr-only">Precio</RadioGroup.Label>
                    <div className="space-y-2">
                      <RadioGroup.Option
                        value={watch('product.cold_spot_price')}
                        className={({ active, checked }) =>
                          `${
                            active
                              ? 'ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-sky-300'
                              : ''
                          }
                  ${
                            checked ? 'bg-sky-900 bg-opacity-75 text-white' : 'bg-white'
                          }
                    relative flex cursor-pointer rounded-lg px-3 py-2 shadow-md focus:outline-none`
                        }
                      >
                        {({ checked }) => (
                          <>
                            <div
                              className="flex w-full items-center justify-between">
                              <div className="flex items-center">
                                <div className="text-sm">
                                  <RadioGroup.Label
                                    as="p"
                                    className={`font-medium  ${
                                      checked ? 'text-white' : 'text-gray-900'
                                    }`}
                                  >
                                    Precio punto frio
                                  </RadioGroup.Label>
                                  <RadioGroup.Description
                                    as="span"
                                    className={`inline ${
                                      checked ? 'text-sky-100' : 'text-gray-500'
                                    }`}
                                  >
                            <span>
                              ${Intl.NumberFormat('es').format(watch('product.cold_spot_price'))}
                            </span>
                                  </RadioGroup.Description>
                                </div>
                              </div>
                              {checked && (
                                <div className="shrink-0 text-white">
                                  <CheckIcon className="h-6 w-6"/>
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </RadioGroup.Option>

                      <RadioGroup.Option
                        value={watch('product.watertight_price')}
                        className={({ active, checked }) =>
                          `${
                            active
                              ? 'ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-sky-300'
                              : ''
                          }
                  ${
                            checked ? 'bg-sky-900 bg-opacity-75 text-white' : 'bg-white'
                          }
                    relative flex cursor-pointer rounded-lg px-3 py-2 shadow-md focus:outline-none`
                        }
                      >
                        {({ checked }) => (
                          <>
                            <div
                              className="flex w-full items-center justify-between">
                              <div className="flex items-center">
                                <div className="text-sm">
                                  <RadioGroup.Label
                                    as="p"
                                    className={`font-medium  ${
                                      checked ? 'text-white' : 'text-gray-900'
                                    }`}
                                  >
                                    Precio estanco
                                  </RadioGroup.Label>
                                  <RadioGroup.Description
                                    as="span"
                                    className={`inline ${
                                      checked ? 'text-sky-100' : 'text-gray-500'
                                    }`}
                                  >
                            <span>
                              ${Intl.NumberFormat('es').format(watch('product.watertight_price'))}
                            </span>
                                  </RadioGroup.Description>
                                </div>
                              </div>
                              {checked && (
                                <div className="shrink-0 text-white">
                                  <CheckIcon className="h-6 w-6"/>
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </RadioGroup.Option>
                    </div>
                  </RadioGroup>
                </div>)}

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

export default SaleDetailForm
