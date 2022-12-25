import React, { FC } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { EmployeeInputs } from '@joshub/types/employees'
import axios from 'axios'
import { usePub } from '@joshub/store/pubs'

interface Props {
  onRegister: () => void
}

const RegisterEmployeeForm: FC<Props> = ({ onRegister }) => {
  const pub = usePub()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<EmployeeInputs>({
    defaultValues: {
      pub_id: pub?.id
    }
  })

  const saveEmployee = async (data: EmployeeInputs): Promise<void> => {
    await axios.post('/api/employees', data)
  }

  const {
    mutate: mutateEmployee,
    isLoading,
    error
  } = useMutation(saveEmployee, { onSuccess: onRegister })

  const onSubmit: SubmitHandler<EmployeeInputs> = (data: EmployeeInputs) => {
    mutateEmployee(data)
  }

  return (
    <div className='mt-5'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='sm:rounded-md'>
          <div className='bg-white px-4 py-5 pb-0'>
            <div className='grid grid-cols-6 gap-6'>
              <div className='col-span-6'>
                <label htmlFor='id'
                       className='block text-sm font-medium text-gray-700'>
                  Cédula
                </label>
                <input type='text'
                       className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                       id='id' {...register('id', { required: true })} />

                {(errors.id != null) &&
                  <span className='text-red-400 text-xs block py-1'>Este campo es requerido</span>}
              </div>

              <div className='col-span-6'>
                <label htmlFor='name'
                       className='block text-sm font-medium text-gray-700'>
                  Nombre
                </label>
                <input type='text'
                       className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                       id='name' {...register('name', { required: true })} />

                {(errors.name != null) &&
                  <span className='text-red-400 text-xs block py-1'>Este campo es requerido</span>}
              </div>

              <div className='col-span-6 sm:col-span-3'>
                <label htmlFor='phone'
                       className='block text-sm font-medium text-gray-700'>
                  Teléfono
                </label>
                <input type='text'
                       className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                       id='phone' {...register('phone', { required: true })} />

                {(errors.phone != null) &&
                  <span className='text-red-400 text-xs block py-1'>Este campo es requerido</span>}
              </div>

              <div className='col-span-6 sm:col-span-3'>
                <label htmlFor='salary'
                       className='block text-sm font-medium text-gray-700'>
                  Salario
                </label>
                <input type='number'
                       className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                       id='salary' {...register('salary', { required: true })} />

                {(errors.salary != null) &&
                  <span className='text-red-400 text-xs block py-1'>Este campo es requerido</span>}
              </div>

              <div className='col-span-6'>
                <label htmlFor='email'
                       className='block text-sm font-medium text-gray-700'>
                  Correo electrónico
                </label>
                <input type='email'
                       className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                       id='email' {...register('email', { required: true })} />

                {(errors.email != null) &&
                  <span className='text-red-400 text-xs block py-1'>Este campo es requerido</span>}
              </div>

              <div className='col-span-6'>
                <label htmlFor='password'
                       className='block text-sm font-medium text-gray-700'>
                  Contraseña
                </label>
                <input type='password'
                       className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                       id='password' {...register('password', { required: true })} />

                {(errors.password != null) &&
                  <span className='text-red-400 text-xs block py-1'>Este campo es requerido</span>}
              </div>

              {(Boolean(error)) &&
                <div
                  className='p-4 w-full col-span-6 mt-3 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800'
                  role='alert'>
                  Error al registrar el empleado, verifique los datos e intente
                  de nuevo
                </div>
              }

              <div className='pt-3 col-span-6'>
                <button type='submit'
                        disabled={isLoading}
                        className='inline-flex w-full justify-center rounded-full border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:bg-gray-200 disabled:text-gray-400'>
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

export default RegisterEmployeeForm
