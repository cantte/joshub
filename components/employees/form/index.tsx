import React, { FC, useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useMutation } from '@tanstack/react-query'
import { UserResponse } from '@supabase/supabase-js'
import { Employee, EmployeeInputs } from '@joshub/types/employees'

interface Props {
  onRegister: () => void
}

const RegisterEmployeeForm: FC<Props> = ({ onRegister }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm<EmployeeInputs>()
  const supabase = useSupabaseClient()

  const saveEmployee = async (data: Employee): Promise<void> => {
    await supabase.from('employees').insert(data)
  }

  const createUser = async (data: EmployeeInputs): Promise<UserResponse> => {
    return await supabase.auth.admin.createUser({
      email: data.email,
      password: data.password
    })
  }

  const { mutate: mutateEmployee, isLoading, error } = useMutation(saveEmployee, { onSuccess: onRegister })
  const {
    mutate: mutateUser,
    isLoading: isLoadingUser,
    isSuccess,
    data
  } = useMutation(createUser)

  const onSubmit: SubmitHandler<EmployeeInputs> = (data: EmployeeInputs) => {
    mutateUser(data)
  }

  useEffect(() => {
    if (isSuccess && data != null && data.data.user != null) {
      const { email, password, ...rest } = getValues()
      const employee = {
        ...rest,
        salary: parseFloat(String(rest.salary)),
        user_id: data.data.user.id
      }

      mutateEmployee(employee)
    }
  }, [isSuccess, data])

  return (
    <div className="mt-5">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="sm:rounded-md">
          <div className="bg-white px-4 py-5 pb-0">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="id"
                       className="block text-sm font-medium text-gray-700">
                  Cédula
                </label>
                <input type="text"
                       className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                       id="id" {...register('id', { required: true })} />

                {(errors.id != null) &&
                  <span className="text-red-400 text-xs block py-1">Este campo es requerido</span>}
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="name"
                       className="block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <input type="text"
                       className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                       id="name" {...register('name', { required: true })} />

                {(errors.name != null) &&
                  <span className="text-red-400 text-xs block py-1">Este campo es requerido</span>}
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="phone"
                       className="block text-sm font-medium text-gray-700">
                  Teléfono
                </label>
                <input type="text"
                       className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                       id="phone" {...register('phone', { required: true })} />

                {(errors.phone != null) &&
                  <span className="text-red-400 text-xs block py-1">Este campo es requerido</span>}
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="salary"
                       className="block text-sm font-medium text-gray-700">
                  Salario
                </label>
                <input type="number"
                       className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                       id="salary" {...register('salary', { required: true })} />

                {(errors.salary != null) &&
                  <span className="text-red-400 text-xs block py-1">Este campo es requerido</span>}
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="email"
                       className="block text-sm font-medium text-gray-700">
                  Correo electrónico
                </label>
                <input type="email"
                       className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                       id="email" {...register('email', { required: true })} />

                {(errors.email != null) &&
                  <span className="text-red-400 text-xs block py-1">Este campo es requerido</span>}
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="password"
                       className="block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <input type="password"
                       className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                       id="password" {...register('password', { required: true })} />

                {(errors.password != null) &&
                  <span className="text-red-400 text-xs block py-1">Este campo es requerido</span>}
              </div>

              <div className="py-3">
                <button type="submit"
                        disabled={isLoading || isLoadingUser}
                        className="inline-flex justify-center rounded-full border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2">
                  Guardar
                </button>
              </div>

              {(Boolean(error)) &&
                <div className="text-red-400 text-xs block py-1">
                  Error al guardar el empleado
                </div>}
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default RegisterEmployeeForm
