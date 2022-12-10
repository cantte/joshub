import React, { FC, Fragment, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import useCurrentEmployee from '@joshub/hooks/employees/use-current-employee'
import {
  OrderDetail,
  OrderDetailInput,
  OrderInputs
} from '@joshub/types/orders'
import { useMutation } from '@tanstack/react-query'
import CustomerField from '@components/shared/form/customer.field'
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
import OrderDetailForm from '@components/orders/form/detail'

const RegisterOrderForm: FC = () => {
  const {
    register,
    setValue,
    handleSubmit,
    watch
  } = useForm<OrderInputs>()
  const supabase = useSupabaseClient()

  const { employee } = useCurrentEmployee()

  useEffect(() => {
    if (employee !== undefined) {
      setValue('employee_id', employee.id)
    }
  }, [employee])

  const saveOrder = async (data: OrderInputs): Promise<OrderInputs> => {
    const { data: result } = await supabase.from('orders').insert(data).select()

    return result !== null ? result[0] : undefined
  }

  const saveDetails = async (data: OrderDetail[]): Promise<void> => {
    await supabase.from('orders_detail').insert(data)
  }

  const {
    mutate: mutateOrder,
    isLoading,
    error,
    data: order
  } = useMutation(saveOrder)

  const router = useRouter()
  const { mutate: mutateOrderDetails } = useMutation(saveDetails, {
    onSuccess: () => {
      void router.push('/')
    }
  })

  const onSubmit: SubmitHandler<OrderInputs> = (data: OrderInputs) => {
    mutateOrder(data)
  }

  useEffect(() => {
    if (order !== undefined) {
      const details = detailsAdded.map(detail => {
        const { product, ...rest } = detail
        return {
          ...rest,
          order_id: order.id as number,
          product_code: detail.product?.code as string,
          total: Number(detail.price) * Number(detail.quantity)
        } satisfies OrderDetail
      })

      mutateOrderDetails(details)
    }
  }, [order])

  const [detailsAdded, setDetailsAdded] = useState<OrderDetailInput[]>([])
  useEffect(() => {
    setValue('total', detailsAdded
      .map(item => Number(item.price) * Number(item.quantity))
      .reduce((accumulator, currentValue) =>
        accumulator + currentValue, 0))
  }, [detailsAdded])

  const [addDetailFormOpen, setAddDetailFormOpen] = useState(false)
  const openAddDetailForm = (): void => setAddDetailFormOpen(true)
  const closeAddDetailForm = (): void => setAddDetailFormOpen(false)

  const handleAddDetail = (detail: OrderDetailInput): void => {
    closeAddDetailForm()

    const exists = detailsAdded.find(d => d.product?.code === detail.product?.code)
    if (exists === undefined) {
      setDetailsAdded([...detailsAdded, detail])
      return
    }

    const newDetails = detailsAdded.map(d => {
      if (d.product?.code === detail.product?.code) {
        return { ...d, quantity: Number(d.quantity) + Number(detail.quantity) }
      }
      return d
    })

    setDetailsAdded(newDetails)
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
                <label htmlFor="address"
                       className="block text-sm font-medium text-gray-700">
                  Dirección
                </label>
                <input type="text"
                       className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                       id="id" {...register('address', { required: true })} />
              </div>

              <div className="col-span-6">
                <button onClick={openAddDetailForm}
                        type="button"
                        className="inline-flex justify-center rounded-full border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:bg-gray-200 disabled:text-gray-400">
                  Agregar producto
                </button>
              </div>

              <div className="col-span-6">
                <div className="overflow-x-auto relative">
                  <Card>
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
                                  $ {Intl.NumberFormat('es').format(detail.price)}
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
                Error al guardar el domicilio
              </div>}
          </div>
        </div>
      </form>

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
            leaveTo="opacity-0">
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
                leaveTo="opacity-0 scale-95">
                <Dialog.Panel
                  className="w-full max-w-xl transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
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
                    <OrderDetailForm onSubmit={handleAddDetail}/>
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

export default RegisterOrderForm
