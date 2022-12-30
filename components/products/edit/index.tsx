import React, { FC } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Product } from '@joshub/types/products'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import toast from 'react-hot-toast'
import Alert from '@components/shared/feedback/alerts'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const EditProductSchema = z.object({
  code: z.string().min(1, 'El código es requerido'),
  name: z.string().min(1, 'El nombre es requerido'),
  quantity: z.coerce.number().min(1, 'La cantidad es requerida'),
  cost: z.coerce.number().min(1, 'El costo es requerido'),
  watertight_price: z.coerce.number().min(1, 'El precio es requerido'),
  cold_spot_price: z.coerce.number().min(1, 'El precio es requerido')
})

interface Props {
  onUpdate: () => void

  product: Product
}

const EditProductForm: FC<Props> = ({
  onUpdate,
  product
}) => {
  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting
    }
  } = useForm<Product>({
    resolver: zodResolver(EditProductSchema),
    defaultValues: product
  })

  const updateProduct = async (data: Product): Promise<void> => {
    await axios.put(`/api/products/${product.code}`, data)
  }

  const {
    mutate,
    isLoading,
    error
  } = useMutation(updateProduct, {
    onSuccess: () => {
      toast.custom(t => (
        <Alert id={t.id} title="Producto actualizado!" variant="info"/>
      ))
      onUpdate()
    }
  })

  const onSubmit: SubmitHandler<Product> = data => {
    mutate(data)
  }

  return (
    <form className="space-y-10" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <div className="grid grid-cols-6 gap-6">
          <div className="col-span-6">
            <label className="block">
              <span className="block">Código</span>
              <input
                type="text"
                className="block border text-lg px-4 py-2 mt-2 rounded-lg border-gray-200 focus:bg-white text-gray-900 focus:border-blue-600 focus:ring-0 outline-none w-full  disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                {...register('code')}
                disabled={true}
              />
            </label>

            {errors.code != null && (
              <p className="text-sm text-red-600 mt-1">{errors.code.message}</p>
            )}
          </div>

          <div className="col-span-6">
            <label className="block">
              <span className="block">Nombre</span>
              <input
                type="text"
                className="block border text-lg px-4 py-2 mt-2 rounded-lg border-gray-200 focus:bg-white text-gray-900 focus:border-blue-600 focus:ring-0 outline-none w-full  disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                {...register('name')}
                disabled={isSubmitting || isLoading}
              />
            </label>

            {errors.name != null && (
              <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="col-span-6 sm:col-span-3">
            <label className="block">
              <span className="block">Cantidad</span>
              <input
                type="number"
                className="block border text-lg px-4 py-2 mt-2 rounded-lg border-gray-200 focus:bg-white text-gray-900 focus:border-blue-600 focus:ring-0 outline-none w-full  disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                {...register('quantity')}
                disabled={isSubmitting || isLoading}
              />
            </label>

            {errors.quantity != null && (
              <p className="text-sm text-red-600 mt-1">
                {errors.quantity.message}
              </p>
            )}
          </div>

          <div className="col-span-6 sm:col-span-3">
            <label className="block">
              <span className="block">Costo</span>
              <div className="relative">
                <div
                  className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500">$</span>
                </div>
                <input
                  type="number"
                  placeholder="0.00"
                  className="block border text-lg px-4 py-2 pl-7 mt-2 rounded-lg border-gray-200 focus:bg-white text-gray-900 focus:border-blue-600 focus:ring-0 outline-none w-full  disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                  {...register('cost')}
                  disabled={isSubmitting || isLoading}
                />
              </div>
            </label>

            {errors.cost != null && (
              <p className="text-sm text-red-600 mt-1">{errors.cost.message}</p>
            )}
          </div>

          <div className="col-span-6 sm:col-span-3">
            <label className="block">
              <span className="block">Precio estanco</span>
              <div className="relative">
                <div
                  className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500">$</span>
                </div>
                <input
                  type="number"
                  placeholder="0.00"
                  className="block border text-lg px-4 py-2 pl-7 mt-2 rounded-lg border-gray-200 focus:bg-white text-gray-900 focus:border-blue-600 focus:ring-0 outline-none w-full  disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                  {...register('watertight_price')}
                  disabled={isSubmitting || isLoading}
                />
              </div>
            </label>

            {errors.watertight_price != null && (
              <p className="text-sm text-red-600 mt-1">
                {errors.watertight_price.message}
              </p>
            )}
          </div>

          <div className="col-span-6 sm:col-span-3">
            <label className="block">
              <span className="block">Precio punto frio</span>
              <div className="relative">
                <div
                  className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500">$</span>
                </div>

                <input
                  type="number"
                  placeholder="0.00"
                  className="block border text-lg px-4 py-2 pl-7 mt-2 rounded-lg border-gray-200 focus:bg-white text-gray-900 focus:border-blue-600 focus:ring-0 outline-none w-full  disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                  {...register('cold_spot_price')}
                  disabled={isSubmitting || isLoading}
                />
              </div>
            </label>

            {errors.cold_spot_price != null && (
              <p className="text-sm text-red-600 mt-1">
                {errors.cold_spot_price.message}
              </p>
            )}
          </div>

          {Boolean(error) && (
            <div
              className="p-4 w-full col-span-6 mt-3 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
              role="alert"
            >
              Error al acrualizar el producto, verifique los datos e intente
              de nuevo
            </div>
          )}

          <div className="mt-6 col-span-6">
            <button
              type="submit"
              disabled={isLoading}
              className="text-base w-full px-6 py-3.5 font-medium text-center text-indigo-900 bg-indigo-100 rounded-full hover:bg-indigo-200 border border-transparent disabled:bg-gray-100 disabled:text-gray-400"
            >
              Actualizar
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default EditProductForm
