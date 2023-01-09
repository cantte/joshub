import { FC, Fragment, useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import useCurrentEmployee from '@joshub/hooks/employees/use-current-employee'
import { Order, OrderDetailInput, OrderInputs } from '@joshub/types/orders'
import { useMutation } from '@tanstack/react-query'
import CustomerField from '@components/shared/form/customer.field'
import { useRouter } from 'next/router'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/20/solid'
import OrderDetailForm from '@components/orders/register/detail'
import axios from 'axios'
import { TransactionDetail } from '@joshub/types/shared'
import useTransactionDetails from '@joshub/hooks/shared/use-transaction-details'
import { usePub } from '@joshub/store/pubs'
import toast from 'react-hot-toast'
import Alert from '@components/shared/feedback/alerts'
import TransactionDetailInputCard from '@components/shared/transactions/details/card'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const RegisterOrderSchema = z.object({
  customer_id: z.string().min(1, 'Debe seleccionar un cliente'),
  employee_id: z.string().min(1, 'Debe seleccionar un empleado'),
  address: z.string().min(1, 'Debe ingresar una dirección'),
  pub_id: z.string().min(1, 'Debe seleccionar un bar')
})

const RegisterOrderForm: FC = () => {
  const { pub } = usePub()
  const {
    register,
    setValue,
    resetField,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<OrderInputs>({
    resolver: zodResolver(RegisterOrderSchema),
    defaultValues: {
      pub_id: pub?.id
    }
  })

  const { employee } = useCurrentEmployee()

  useEffect(() => {
    if (employee !== undefined) {
      setValue('employee_id', employee.id)
    }
  }, [employee])

  const saveOrder = async (orderToSave: OrderInputs): Promise<Order> => {
    const { data } = await axios.post<Order>('/api/orders', orderToSave)

    return data
  }

  const router = useRouter()
  const {
    mutate: mutateOrder,
    isLoading,
    error
  } = useMutation(saveOrder, {
    onSuccess: () => {
      toast.custom(t => (
        <Alert id={t.id} title='Domicilio registrado!' variant='success' />
      ))
      void router.push('/dashboard')
    }
  })

  const {
    details,
    addDetailModalOpen,
    total,

    addDetail,
    removeDetail,
    openAddDetailModal,
    closeAddDetailModal
  } = useTransactionDetails()

  const handleAddDetail = (detail: OrderDetailInput): void => {
    addDetail(detail)
    closeAddDetailModal()
  }

  const onSubmit: SubmitHandler<OrderInputs> = (data: OrderInputs) => {
    const orderToSave: OrderInputs = {
      ...data,
      total,
      items: details.map(detail => {
        const { product, ...rest } = detail
        return {
          ...rest,
          product_code: detail.product?.code as string,
          total: Number(detail.price) * Number(detail.quantity)
        } satisfies TransactionDetail
      })
    }
    mutateOrder(orderToSave)
  }

  return (
    <>
      <form className='space-y-10' onSubmit={handleSubmit(onSubmit)}>
        <div>
          <div className='grid grid-cols-6 gap-6'>
            <div className='col-span-6 sm:col-span-3'>
              <h3 className='text-2xl text-gray-900 mb-3'>Productos</h3>

              <div>
                <button
                  onClick={openAddDetailModal}
                  type='button'
                  className='text-sm px-5 py-2.5 text-center font-medium inline-flex text-blue-700 border-blue-700 rounded-lg hover:border-blue-800 border border-transparent'
                >
                  Agregar
                </button>

                <div className='mt-1 min-h-[20rem] overflow-auto'>
                  {details.length > 0 &&
                    details.map(detail => (
                      <TransactionDetailInputCard
                        key={`${detail.product?.code ?? ''}-${String(
                          detail.price
                        )}`}
                        detail={detail}
                        onDeleted={removeDetail}
                      />
                    ))}
                  {details.length === 0 && (
                    <div>
                      <div className='w-12 h-12 rounded-full bg-gray-100 p-2 flex items-center justify-center mx-auto mb-3.5'>
                        <svg
                          className='w-8 h-8 text-gray-500'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth='2'
                            d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                          ></path>
                        </svg>
                        <span className='sr-only'>Success</span>
                      </div>
                      <div className='text-center text-gray-500'>
                        No hay productos agregados.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className='col-span-6 sm:col-span-3'>
              <input
                type='hidden'
                {...register('customer_id', { required: true })}
              />
              <CustomerField
                onSelected={customer => {
                  resetField('customer_id', { defaultValue: customer.id })
                }}
              />

              {errors.customer_id != null && (
                <p className='text-sm text-red-600 mt-1'>
                  {errors.customer_id.message}
                </p>
              )}

              <label className='block mt-3'>
                <span className='block'>Dirección</span>
                <input
                  type='text'
                  className='block border text-lg px-4 py-3 mt-2 rounded-lg border-gray-200 focus:bg-white text-gray-900 focus:border-blue-600 focus:ring-0 outline-none w-full  disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed'
                  {...register('address')}
                  disabled={isSubmitting || isLoading}
                />
              </label>

              {errors.address != null && (
                <p className='text-sm text-red-600 mt-1'>
                  {errors.address.message}
                </p>
              )}
            </div>

            <div className='col-span-6 sm:col-span-3 sm:col-start-4'>
              <div className='w-full text-gray-500 bg-white dark:bg-gray-800 dark:text-gray-400'>
                <div className='flex'>
                  <div className='ml-3 text-sm font-normal'>
                    <h3 className='mb-2 text-2xl font-semibold text-gray-900 dark:text-white'>
                      Resumen
                    </h3>
                    <div className='text-base font-normal'>
                      Productos comprados:{' '}
                      {Intl.NumberFormat('es').format(
                        details
                          .map(detail => Number(detail.quantity))
                          .reduce((a, b) => a + b, 0)
                      )}
                    </div>
                    <div className='text-base font-normal'>
                      Total: $ {Intl.NumberFormat('es').format(total)}
                    </div>
                  </div>
                </div>
              </div>

              <div className='pt-6'>
                <button
                  type='submit'
                  disabled={isLoading}
                  className='text-base w-full px-6 py-3.5 font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 border border-transparent disabled:bg-gray-100 disabled:text-gray-400'
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>

          {Boolean(error) && (
            <div className='text-red-400 text-xs block py-1'>
              Error al guardar el domicilio
            </div>
          )}
        </div>
      </form>

      <Transition appear show={addDetailModalOpen} as={Fragment}>
        <Dialog
          onClose={closeAddDetailModal}
          as='div'
          className='relative z-50'
        >
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black bg-opacity-25' />
          </Transition.Child>

          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-4 text-center'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <Dialog.Panel className='w-full max-w-xl transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                  <Dialog.Title
                    as='h3'
                    className='text-lg font-medium leading-6 text-gray-900'
                  >
                    <div className='flex flex-col mb-5'>
                      <div className='flex flex-row justify-between'>
                        <h3 className='text-gray-900 font-bold text-2xl sm:text-3xl'>
                          Agregar producto
                        </h3>
                        <button
                          onClick={closeAddDetailModal}
                          className='inline-flex justify-center rounded-full border border-transparent bg-white px-2 py-2 text-sm font-medium text-red-700 hover:bg-red-50 focus:outline-none'
                        >
                          <XMarkIcon className='h-5 w-5 text-red-700' />
                        </button>
                      </div>
                    </div>
                  </Dialog.Title>

                  <div className='mt-2'>
                    <OrderDetailForm onSubmit={handleAddDetail} />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default RegisterOrderForm
