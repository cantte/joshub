import React, { FC, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import useCurrentEmployee from '@joshub/hooks/employees/use-current-employee'
import { OrderDetail, OrderDetailInput } from '@joshub/types/orders'
import { useMutation } from '@tanstack/react-query'
import CustomerField from '@components/shared/form/customer.field'
import OrderDetailForm from '@components/orders/form/detail'
import { useRouter } from 'next/router'

interface OrderInputs {
  id?: number
  customer_id: string
  employee_id: string
  address: string
  total: number
}

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

  const [detailsAdded, setDetailsAdded] = useState<OrderDetailInput[]>([])

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
          total: +detail.price * +detail.quantity
        } satisfies OrderDetail
      })

      mutateOrderDetails(details)
    }
  }, [order])

  const handleAddDetail = (detail: OrderDetailInput): void => {
    const exists = detailsAdded.find(d => d.product?.code === detail.product?.code)
    if (exists === undefined) {
      setDetailsAdded([...detailsAdded, detail])
      return
    }

    const newDetails = detailsAdded.map(d => {
      if (d.product?.code === detail.product?.code) {
        return { ...d, quantity: +d.quantity + +detail.quantity }
      }
      return d
    })

    setDetailsAdded(newDetails)
  }

  useEffect(() => {
    setValue('total', detailsAdded
      .map(item => +item.price * +item.quantity)
      .reduce((accumulator, currentValue) =>
        accumulator + currentValue, 0))
  }, [detailsAdded])

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
                <OrderDetailForm onSubmit={handleAddDetail}/>
              </div>

              <div className="col-span-6">
                <div className="overflow-x-auto relative">
                  <table
                    className="w-full text-sm text-left text-gray-500">
                    <thead
                      className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3 px-6">
                        Nombre
                      </th>
                      <th scope="col" className="py-3 px-6">
                        Precio de venta
                      </th>
                      <th scope="col" className="py-3 px-6">
                        Cantidad
                      </th>
                      <th scope="col" className="py-3 px-6">
                        Total
                      </th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                      detailsAdded.map(detail => (
                        <tr
                          key={detail.product?.code}
                          className="bg-white border-b">
                          <th scope="row"
                              className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap">
                            {detail.product?.name}
                          </th>
                          <td className="py-4 px-6">
                            ${detail.product?.cold_spot_price}
                          </td>
                          <td className="py-4 px-6">
                            {detail.quantity}
                          </td>
                          <td className="py-4 px-6">
                            {detail.quantity * detail.price}
                          </td>
                        </tr>
                      ))
                    }
                    </tbody>
                  </table>
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
                      className="inline-flex justify-center mr-3 w-full rounded-full border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-indigo-300 focus-visible:ring-offset-2">
                Guardar
              </button>
            </div>

            {(Boolean(error)) &&
              <div className="text-red-400 text-xs block py-1">
                Error al guardar el empleado
              </div>}
          </div>
        </div>
      </form>
    </div>
  )
}

export default RegisterOrderForm
