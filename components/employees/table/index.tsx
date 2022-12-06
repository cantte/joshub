import React, { FC } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { Employee } from '@joshub/types/employees'
import { useQuery } from '@tanstack/react-query'
import useCurrentEmployee from '@joshub/hooks/employees/use-current-employee'

const EmployeesTable: FC = () => {
  const supabase = useSupabaseClient()
  const { employee: currentEmployee } = useCurrentEmployee()

  const loadEmployees = async (): Promise<Employee[] | null> => {
    const { data } = await supabase.from('employees').select()
    return data
  }

  const {
    data: employees
  } = useQuery(['employees'], loadEmployees)

  return (
    <div className="col-span-6">
      <div className="overflow-x-auto relative">
        <table
          className="w-full text-sm text-left text-gray-500">
          <thead
            className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="py-3 px-6">
              Identificación
            </th>
            <th scope="col" className="py-3 px-6">
              Nombre
            </th>
            <th scope="col" className="py-3 px-6">
              Teléfono
            </th>
            <th scope="col" className="py-3 px-6">
              Salario
            </th>
            <th scope="col" className="py-3 px-6"></th>
          </tr>
          </thead>
          <tbody>
          {
            employees?.map(employee => (
              <tr
                key={employee.id}
                className="bg-white border-b">
                <th scope="row"
                    className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap">
                  {employee.id}
                </th>
                <th scope="row">
                  {employee.name} {currentEmployee?.id === employee.id ? '(Yo)' : ''}
                </th>
                <td className="py-4 px-6">
                  {employee.phone}
                </td>
                <td className="py-4 px-6">
                  ${employee.salary}
                </td>
                <td className="py-4 px-6">
                  <button
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    Editar
                  </button>

                  <button
                    className="inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 mx-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          }
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default EmployeesTable
