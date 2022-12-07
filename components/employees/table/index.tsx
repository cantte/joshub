import React, { FC } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { Employee } from '@joshub/types/employees'
import { useQuery } from '@tanstack/react-query'
import useCurrentEmployee from '@joshub/hooks/employees/use-current-employee'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow
} from '@tremor/react'

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
      <Card>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Identificación</TableHeaderCell>
              <TableHeaderCell>Nombre</TableHeaderCell>
              <TableHeaderCell>Teléfono</TableHeaderCell>
              <TableHeaderCell>Salario</TableHeaderCell>
              <TableHeaderCell>Acciones</TableHeaderCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {employees !== undefined && employees !== null
              ? employees.map(employee => (
                <TableRow key={employee.id}>
                  <TableCell>{employee.id}</TableCell>
                  <TableCell>{employee.name} {currentEmployee?.id === employee.id ? '(Yo)' : 'o'}</TableCell>
                  <TableCell>{employee.phone}</TableCell>
                  <TableCell>$ {Intl.NumberFormat('es').format(employee.salary)}</TableCell>
                  <TableCell>
                    <button
                      className="inline-flex justify-center rounded-full border border-transparent bg-white px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50 focus:outline-none">
                      <PencilIcon className="h-5 w-5 text-indigo-700"/>
                    </button>

                    <button
                      className="inline-flex justify-center rounded-full border border-transparent bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 focus:outline-none">
                      <TrashIcon className="h-5 w-5 text-red-700"/>
                    </button>
                  </TableCell>
                </TableRow>
              ))
              : <TableRow>
                <TableCell>
                  No hay empleados
                </TableCell>
              </TableRow>}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}

export default EmployeesTable
