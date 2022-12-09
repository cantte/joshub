import React, { FC, Fragment, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useMutation } from '@tanstack/react-query'
import CustomerField from '@components/shared/form/customer.field'
import SaleDetailForm from '@components/sales/form/detail'
import { SaleDetail, SaleDetailInput } from '@joshub/types/sales'
import useCurrentEmployee from '@joshub/hooks/employees/use-current-employee'
import { useRouter } from 'next/router'
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
import { XMarkIcon } from '@heroicons/react/20/solid'

interface SalesInputs {
  id?: number
  customer_id: string
  employee_id: string
  total: number
}

const RegisterSaleForm: FC = () => {
  const {
    register,
    setValue,
    handleSubmit,
    watch
  } = useForm<SalesInputs>()
  const supabase = useSupabaseClient()

  const { employee } = useCurrentEmployee()

  useEffect(() => {
    if (employee !== undefined) {
      setValue('employee_id', employee.id)
    }
  }, [employee])

  const saveSale = async (data: SalesInputs): Promise<SalesInputs> => {
    const { data: result } = await supabase.from('sales').insert(data).select()
    return result !== null ? result[0] : undefined
  }

  const saveDetails = async (data: SaleDetail[]): Promise<void> => {
    await supabase.from('sales_detail').insert(data)
  }

  const {
    mutate: mutateSale,
    isLoading,
    error,
    data: sale
  } = useMutation(saveSale)

  const router = useRouter()
  const { mutate: mutateSaleDetails } = useMutation(saveDetails, {
    onSuccess: () => {
      void router.push('/')
    }
  })

  const onSubmit: SubmitHandler<SalesInputs> = (data: SalesInputs) => {
    mutateSale(data)
  }

  useEffect(() => {
    if (sale !== undefined) {
      const details = detailsAdded.map(detail => {
        const { product, ...rest } = detail
        return {
          ...rest,
          sale_id: sale.id as number,
          product_code: detail.product?.code as string,
          total: Number(detail.price) * Number(detail.quantity)
        } satisfies SaleDetail
      })

      mutateSaleDetails(details)
    }
  }, [sale])

  const [detailsAdded, setDetailsAdded] = useState<SaleDetailInput[]>([])
  useEffect(() => {
    setValue('total', detailsAdded
      .map(item => Number(item.price) * Number(item.quantity))
      .reduce((accumulator, currentValue) =>
        accumulator + currentValue, 0))
  }, [detailsAdded])

  const [addDetailFormOpen, setAddDetailFormOpen] = useState(false)
  const openAddDetailForm = (): void => setAddDetailFormOpen(true)
  const closeAddDetailForm = (): void => setAddDetailFormOpen(false)

  const handleAddDetail = (detail: SaleDetailInput): void => {
    const exists = detailsAdded.find(d => d.product?.code === detail.product?.code && d.price === Number(detail.price))
    if (exists === undefined) {
      setDetailsAdded([...detailsAdded, detail])
    } else {
      const newDetails = detailsAdded.map(d => {
        if (d.product?.code === detail.product?.code) {
          return { ...d, quantity: Number(d.quantity) + Number(detail.quantity) }
        }
        return d
      })
      setDetailsAdded(newDetails)
    }

    closeAddDetailForm()
  }

  return (
    <div className="mt-5">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="overflow-hidden shadow sm:rounded-md">
          <div className="bg-white px-4 py-5 sm:p-6">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-6">
                <input
                  type="hidden" {...register('customer_id', { required: true })}/>
                <CustomerField
                  onSelected={customer => setValue('customer_id', customer.id)}/>
              </div>

              <div className="col-span-6">
                <button onClick={openAddDetailForm}
                        className="inline-flex justify-center rounded-full border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:bg-gray-200 disabled:text-gray-400">
                  Agregar producto
                </button>

                <Transition appear show={addDetailFormOpen} as={Fragment}>
                  <Dialog onClose={closeAddDetailForm} as="div"
                          className="relative z-10">
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
                                    Agregar producto
                                  </h3>
                                  <button
                                    onClick={closeAddDetailForm}
                                    className="inline-flex justify-center rounded-full border border-transparent bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 focus:outline-none">
                                    <XMarkIcon
                                      className="h-5 w-5 text-red-700"
                                    />
                                  </button>
                                </div>
                              </div>
                            </Dialog.Title>

                            <div className="mt-2">
                              <SaleDetailForm
                                onSubmit={handleAddDetail}/>
                            </div>
                          </Dialog.Panel>
                        </Transition.Child>
                      </div>
                    </div>
                  </Dialog>
                </Transition>
              </div>

              <div className="col-span-6">
                <div className="overflow-x-auto relative">
                  <Card>
                    <h3 className="text-xl">Productos añadidos</h3>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableHeaderCell>Nombre</TableHeaderCell>
                          <TableHeaderCell>Precio de venta</TableHeaderCell>
                          <TableHeaderCell>Cantidad</TableHeaderCell>
                          <TableHeaderCell>Total</TableHeaderCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {detailsAdded.length > 0
                          ? (
                              detailsAdded.map((detail) => (
                              <TableRow key={detail.product?.code}>
                                <TableCell>
                                  {detail.product?.name}
                                </TableCell>
                                <TableCell>
                                  $ {Intl.NumberFormat('es').format(detail.product?.cold_spot_price as number)}
                                </TableCell>
                                <TableCell>
                                  {Intl.NumberFormat('es').format(detail.quantity)}
                                </TableCell>
                                <TableCell>
                                  $ {Intl.NumberFormat('es').format(detail.quantity * detail.price)}
                                </TableCell>
                              </TableRow>
                              ))
                            )
                          : (<TableCell>
                            No ha agregado ningún producto
                          </TableCell>)}
                      </TableBody>
                    </Table>
                  </Card>
                </div>
              </div>

              <div className="col-span-6 sm:col-span-3">
                <p
                  className="text-2xl">Total:
                  $ {Intl.NumberFormat('es').format(watch('total'))}</p>
              </div>
            </div>

            <div className="py-5">
              <button type="submit"
                      disabled={isLoading}
                      className="inline-flex w-full justify-center rounded-full border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:bg-gray-200 disabled:text-gray-400">
                Guardar
              </button>
            </div>

            {(Boolean(error)) &&
              <div className="text-red-400 text-xs block py-1">
                Error al guardar la venta
              </div>}
          </div>
        </div>
      </form>
    </div>
  )
}

export default RegisterSaleForm
