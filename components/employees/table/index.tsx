import React, { FC, Fragment, useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { Employee } from '@joshub/types/employees'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
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
import { Dialog, Transition } from '@headlessui/react'

const EmployeesTable: FC = () => {
  const supabase = useSupabaseClient()
  const { employee: currentEmployee } = useCurrentEmployee()

  const loadEmployees = async (): Promise<Employee[] | null> => {
    const { data } = await supabase.from('employees').select().is('deleted_at', null)
    return data
  }

  const {
    data: employees
  } = useQuery(['employees'], loadEmployees)
  const queryClient = useQueryClient()

  const [isOpeningDeleteModal, setIsOpeningDeleteModal] = useState(false)
  const openDeleteModal = (): void => setIsOpeningDeleteModal(true)
  const closeDeleteModal = (): void => {
    setIsOpeningDeleteModal(false)
    void queryClient.refetchQueries(['employees'])
  }
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null)

  const deleteEmployee = async (id: string): Promise<void> => {
    await supabase.from('employees').update({ deleted_at: new Date() }).eq('id', id)
  }

  const { mutate } = useMutation(deleteEmployee, { onSuccess: closeDeleteModal })

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
                  <TableCell>{employee.name} {currentEmployee?.id === employee.id ? '(Yo)' : ''}</TableCell>
                  <TableCell>{employee.phone}</TableCell>
                  <TableCell>$ {Intl.NumberFormat('es').format(employee.salary)}</TableCell>
                  <TableCell>
                    <button
                      className="inline-flex justify-center rounded-full border border-transparent bg-white px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50 focus:outline-none">
                      <PencilIcon className="h-5 w-5 text-indigo-700"/>
                    </button>

                    <button
                      onClick={() => {
                        setEmployeeToDelete(employee)
                        openDeleteModal()
                      }}
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

      <Transition appear show={isOpeningDeleteModal} as={Fragment}>
        <Dialog onClose={closeDeleteModal} as="div" className="relative z-10">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25"/>
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div
              className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    <div className="flex flex-col mb-5">
                      <div className="flex flex-row justify-between">
                        <h3
                          className="text-xl font-semibold text-gray-900">
                          ¿Estás seguro que deseas eliminar este empleado?
                        </h3>
                      </div>
                    </div>
                  </Dialog.Title>

                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Esta seguro que desea eliminar al
                      empleado{' '}
                      <span className="font-bold text-gray-700 inline">
                        {employeeToDelete?.name}
                      </span>{' '}
                      Esta acción no se puede deshacer.
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={() => {
                        if (employeeToDelete !== null) {
                          mutate(employeeToDelete.id)
                        }
                      }}
                    >
                      Si, eliminar
                    </button>

                    <button
                      type="button"
                      className="inline-flex ml-3 justify-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                      onClick={closeDeleteModal}
                    >
                      No, cancelar
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}

export default EmployeesTable
