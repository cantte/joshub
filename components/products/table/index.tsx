import React, { FC, Fragment, useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { Product } from '@joshub/types/products'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow
} from '@tremor/react'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/20/solid'
import EditProductForm from '@components/products/edit'

const ProductsTable: FC = () => {
  const supabase = useSupabaseClient()

  const loadProducts = async (): Promise<Product[] | null> => {
    const { data } = await supabase.from('products').select().is('deleted_at', null)
    return data
  }

  const {
    data: products
  } = useQuery(['products'], loadProducts)
  const queryClient = useQueryClient()

  const [isOpeningDeleteModal, setIsOpeningDeleteModal] = useState(false)
  const openDeleteModal = (): void => setIsOpeningDeleteModal(true)
  const closeDeleteModal = (): void => {
    setIsOpeningDeleteModal(false)
    void queryClient.refetchQueries(['products'])
  }

  const [productToDelete, setProductToDelete] = useState<Product | null>(null)

  const deleteProduct = async (code: string): Promise<void> => {
    await supabase.from('products').update({ deleted_at: new Date() }).eq('code', code)
  }

  const { mutate } = useMutation(deleteProduct, { onSuccess: closeDeleteModal })

  const [isOpeningEditModal, setIsOpeningEditModal] = useState(false)
  const openEditModal = (): void => setIsOpeningEditModal(true)
  const closeEditModal = (): void => {
    setIsOpeningEditModal(false)
    void queryClient.refetchQueries(['products'])
  }

  const [productToEdit, setProductToEdit] = useState<Product | null>(null)

  return (
    <div className="col-span-6">
      <Card>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Código</TableHeaderCell>
              <TableHeaderCell>Nombre</TableHeaderCell>
              <TableHeaderCell>Cantidad</TableHeaderCell>
              <TableHeaderCell>Costo</TableHeaderCell>
              <TableHeaderCell>Precio de venta punto frío</TableHeaderCell>
              <TableHeaderCell>Precio de venta estanco</TableHeaderCell>
              <TableHeaderCell>Acciones</TableHeaderCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {products !== undefined && products !== null
              ? products.map((product) => (
                <TableRow key={product.code}>
                  <TableCell>{product.code}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{Intl.NumberFormat('es').format(product.quantity)}</TableCell>
                  <TableCell>$ {Intl.NumberFormat('es').format(product.cost)}</TableCell>
                  <TableCell>$ {Intl.NumberFormat('es').format(product.cold_spot_price)}</TableCell>
                  <TableCell>$ {Intl.NumberFormat('es').format(product.watertight_price)}</TableCell>
                  <TableCell>
                    <button
                      onClick={() => {
                        setProductToEdit(product)
                        openEditModal()
                      }}
                      className="inline-flex justify-center rounded-full border border-transparent bg-white px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50 focus:outline-none">
                      <PencilIcon className="h-5 w-5 text-indigo-700"/>
                    </button>

                    <button
                      onClick={() => {
                        setProductToDelete(product)
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
                  No hay productos
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
                          ¿Estás seguro que deseas eliminar este producto?
                        </h3>
                      </div>
                    </div>
                  </Dialog.Title>

                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Esta seguro que desea eliminar el producto{' '}
                      <span className="font-bold text-gray-700 inline">
                        {productToDelete?.name}
                      </span>{' '}
                      Esta acción no se puede deshacer.
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={() => {
                        if (productToDelete !== null) {
                          mutate(productToDelete.code)
                        }
                      }}
                    >
                      Si, eliminar
                    </button>

                    <button
                      type="button"
                      className="inline-flex ml-3 justify-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                      onClick={() => setIsOpeningDeleteModal(false)}
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

      <Transition appear show={isOpeningEditModal} as={Fragment}>
        <Dialog onClose={closeEditModal} as="div"
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
                          Actualizar producto
                        </h3>
                        <button
                          onClick={() => setIsOpeningEditModal(false)}
                          className="inline-flex justify-center rounded-full border border-transparent bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 focus:outline-none">
                          <XMarkIcon
                            className="h-5 w-5 text-red-700"
                          />
                        </button>
                      </div>
                    </div>
                  </Dialog.Title>

                  <div className="mt-2">
                    {productToEdit !== null &&
                      <EditProductForm onUpdate={closeEditModal}
                                       product={productToEdit}/>
                    }
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

export default ProductsTable
