import React, { FC, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useMutation } from '@tanstack/react-query'
import CustomerField from '@components/shared/form/customer.field'
import SaleDetailForm from '@components/sales/form/detail'
import { SaleDetail, SaleDetailInput } from '@joshub/types/sales'
import useCurrentEmployee from '@joshub/hooks/employees/use-current-employee'
import { useRouter } from 'next/router'

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

  const [detailsAdded, setDetailsAdded] = useState<SaleDetailInput[]>([])

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
          total: +detail.price * +detail.quantity
        } satisfies SaleDetail
      })

      mutateSaleDetails(details)
    }
  }, [sale])

  const handleAddDetail = (detail: SaleDetailInput): void => {
    const exists = detailsAdded.find(d => d.product?.code === detail.product?.code && d.price === detail.price)
    if (exists === undefined) {
      setDetailsAdded([...detailsAdded, detail])
    } else {
      const newDetails = detailsAdded.map(d => {
        if (d.product?.code === detail.product?.code) {
          return { ...d, quantity: +d.quantity + +detail.quantity }
        }
        return d
      })
      setDetailsAdded(newDetails)
    }
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
                <SaleDetailForm
                  onSubmit={handleAddDetail}/>
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
                            ${detail.price}
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

export default RegisterSaleForm
