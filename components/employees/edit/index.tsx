import { type Employee } from '@joshub/types/employees'
import React, { type FC } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import toast from 'react-hot-toast'
import Alert from '@components/shared/feedback/alerts'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const EditEmployeeSchema = z.object({
  id: z.string().min(1, 'La identificación es requerida'),
  name: z.string().min(1, 'El nombre es requerido'),
  phone: z.string().min(1, 'El teléfono es requerido'),
  salary: z.coerce.number().min(1, 'El salario es requerido')
})

interface Props {
  onUpdated: () => void

  employee: Employee
}

const EditEmployeeForm: FC<Props> = ({ onUpdated, employee }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<Employee>({
    resolver: zodResolver(EditEmployeeSchema),
    defaultValues: employee
  })

  const updateEmployee = async (data: Employee): Promise<void> => {
    await axios.put(`/api/employees/${employee.id}`, data)
  }

  const { mutate, isLoading, error } = useMutation(updateEmployee, {
    onSuccess: () => {
      toast.custom(t => (
        <Alert id={t.id} title='Empleado actualizado!' variant='info' />
      ))
      onUpdated()
    }
  })

  const onSubmit: SubmitHandler<Employee> = (data: Employee) => {
    mutate(data)
  }

  return (
    <form className='space-y-10' onSubmit={handleSubmit(onSubmit)}>
      <div>
        <div className='grid grid-cols-6 gap-4'>
          <div className='col-span-6'>
            <label className='block'>
              <span className='block'>Identificación</span>
              <input
                type='text'
                className='block border text-lg px-4 py-2 mt-2 rounded-lg border-gray-200 focus:bg-white text-gray-900 focus:border-blue-600 focus:ring-0 outline-none w-full  disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed'
                {...register('id')}
                disabled={true}
              />
            </label>

            {errors.id != null && (
              <p className='text-sm text-red-600 mt-1'>{errors.id.message}</p>
            )}
          </div>

          <div className='col-span-6'>
            <label className='block'>
              <span className='block'>Nombre</span>
              <input
                type='text'
                className='block border text-lg px-4 py-2 mt-2 rounded-lg border-gray-200 focus:bg-white text-gray-900 focus:border-blue-600 focus:ring-0 outline-none w-full  disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed'
                {...register('name')}
                disabled={isSubmitting || isLoading}
              />
            </label>

            {errors.name != null && (
              <p className='text-sm text-red-600 mt-1'>{errors.name.message}</p>
            )}
          </div>

          <div className='col-span-6 sm:col-span-3'>
            <label className='block'>
              <span className='block'>Teléfono</span>
              <input
                type='text'
                className='block border text-lg px-4 py-2 mt-2 rounded-lg border-gray-200 focus:bg-white text-gray-900 focus:border-blue-600 focus:ring-0 outline-none w-full  disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed'
                {...register('phone')}
                disabled={isSubmitting || isLoading}
              />
            </label>

            {errors.phone != null && (
              <p className='text-sm text-red-600 mt-1'>
                {errors.phone.message}
              </p>
            )}
          </div>

          <div className='col-span-6 sm:col-span-3'>
            <label className='block'>
              <span className='block'>Salario</span>
              <input
                type='number'
                className='block border text-lg px-4 py-2 mt-2 rounded-lg border-gray-200 focus:bg-white text-gray-900 focus:border-blue-600 focus:ring-0 outline-none w-full  disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed'
                {...register('salary')}
                disabled={isSubmitting || isLoading}
              />
            </label>

            {errors.salary != null && (
              <p className='text-sm text-red-600 mt-1'>
                {errors.salary.message}
              </p>
            )}
          </div>

          {Boolean(error) && (
            <div
              className='p-4 w-full col-span-6 mt-3 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800'
              role='alert'
            >
              Error al actualizar el empleado, verifique los datos e intente de
              nuevo
            </div>
          )}

          <div className='mt-6 col-span-6'>
            <button
              type='submit'
              disabled={isLoading || isSubmitting}
              className='text-base w-full px-6 py-3.5 font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 border border-transparent disabled:bg-gray-100 disabled:text-gray-400'
            >
              Editar
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default EditEmployeeForm
