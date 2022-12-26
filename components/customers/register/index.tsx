import { SubmitHandler, useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { FC } from 'react'
import axios from 'axios'
import { CustomerInputs } from '@joshub/types/customers'

const RegisterCustomerForm: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<CustomerInputs>()

  const saveCustomer = async (data: CustomerInputs): Promise<void> => {
    await axios.post('/api/customers', data)
  }

  const { mutate, isLoading, error } = useMutation(saveCustomer, {
    onSuccess: () => {
      reset()
    }
  })

  const onSubmit: SubmitHandler<CustomerInputs> = data => {
    mutate(data)
  }

  return (
    <div className='mt-5'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='sm:shadow sm:rounded-md'>
          <div className='bg-white sm:px-4 py-5 sm:p-6'>
            <div className='grid grid-cols-6 gap-6'>
              <div className='col-span-6 sm:col-span-3'>
                <label
                  htmlFor='id'
                  className='block text-sm font-medium text-gray-700'
                >
                  Identificación
                </label>
                <input
                  type='text'
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                  id='id'
                  {...register('id', { required: true })}
                />

                {errors.name != null && (
                  <span className='text-red-400 text-xs block py-1'>
                    Este campo es requerido
                  </span>
                )}
              </div>

              <div className='col-span-6 sm:col-span-3'>
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

              {Boolean(error) && (
                <div
                  className='p-4 w-full col-span-6 mt-3 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800'
                  role='alert'
                >
                  Ya existe un cliente registrado con la identificación
                  ingresada.
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

export default RegisterCustomerForm
