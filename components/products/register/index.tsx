import { SubmitHandler, useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { FC } from 'react'
import axios from 'axios'
import { usePub } from '@joshub/store/pubs'

interface Inputs {
  code: string
  name: string
  quantity: number
  cost: number
  watertight_price: number
  cold_spot_price: number
  pub_id: string
}

interface Props {
  onRegister: () => void
}

const RegisterProductForm: FC<Props> = ({ onRegister }) => {
  const pub = usePub()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<Inputs>({
    defaultValues: {
      pub_id: pub?.id
    }
  })

  const saveProduct = async (data: Inputs): Promise<void> => {
    await axios.post('/api/products', data)
  }

  const { mutate, isLoading, error } = useMutation(saveProduct, {
    onSuccess: onRegister
  })

  const onSubmit: SubmitHandler<Inputs> = data => {
    mutate(data)
  }

  return (
    <div className='mt-5'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='sm:rounded-md'>
          <div className='bg-white py-5 pb-0'>
            <div className='grid grid-cols-6 gap-6'>
              <div className='col-span-6'>
                <label
                  htmlFor='code'
                  className='block text-sm font-medium text-gray-700'
                >
                  Código
                </label>
                <input
                  type='text'
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                  id='code'
                  {...register('code', { required: true })}
                />

                {errors.code != null && (
                  <span className='text-red-400 text-xs block py-1'>
                    Este campo es requerido
                  </span>
                )}
              </div>

              <div className='col-span-6'>
                <label
                  htmlFor='name'
                  className='block text-sm font-medium text-gray-700'
                >
                  Nombre
                </label>
                <input
                  type='text'
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                  id='name'
                  {...register('name', { required: true })}
                />

                {errors.name != null && (
                  <span className='text-red-400 text-xs block py-1'>
                    Este campo es requerido
                  </span>
                )}
              </div>

              <div className='col-span-6 sm:col-span-3'>
                <label
                  htmlFor='quantity'
                  className='block text-sm font-medium text-gray-700'
                >
                  Cantidad
                </label>
                <input
                  type='number'
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                  id='quantity'
                  {...register('quantity', { required: true })}
                />

                {errors.quantity != null && (
                  <span className='text-red-400 text-xs block py-1'>
                    Este campo es requerido
                  </span>
                )}
              </div>

              <div className='col-span-6 sm:col-span-3'>
                <label
                  htmlFor='cost'
                  className='block text-sm font-medium text-gray-700'
                >
                  Costo
                </label>
                <input
                  type='number'
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                  id='cost'
                  {...register('cost', { required: true })}
                />

                {errors.cost != null && (
                  <span className='text-red-400 text-xs block py-1'>
                    Este campo es requerido
                  </span>
                )}
              </div>

              <div className='col-span-6 sm:col-span-3'>
                <label
                  htmlFor='watertight_price'
                  className='block text-sm font-medium text-gray-700'
                >
                  Precio estanco
                </label>
                <input
                  type='number'
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                  id='watertight_price'
                  {...register('watertight_price', { required: true })}
                />

                {errors.watertight_price != null && (
                  <span className='text-red-400 text-xs block py-1'>
                    Este campo es requerido
                  </span>
                )}
              </div>

              <div className='col-span-6 sm:col-span-3'>
                <label
                  htmlFor='cold_spot_price'
                  className='block text-sm font-medium text-gray-700'
                >
                  Precio punto frio
                </label>
                <input
                  type='number'
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                  id='cold_spot_price'
                  {...register('cold_spot_price', { required: true })}
                />

                {errors.cold_spot_price != null && (
                  <span className='text-red-400 text-xs block py-1'>
                    Este campo es requerido
                  </span>
                )}
              </div>

              {Boolean(error) && (
                <div
                  className='p-4 w-full col-span-6 mt-3 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800'
                  role='alert'
                >
                  Error al registrar el producto, verifique los datos e intente
                  de nuevo
                </div>
              )}

              <div className='py-3 col-span-6'>
                <button
                  type='submit'
                  disabled={isLoading}
                  className='inline-flex w-full justify-center rounded-full border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:bg-gray-200 disabled:text-gray-400'
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default RegisterProductForm
