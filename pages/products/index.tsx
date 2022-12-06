import { FC, Fragment, useState } from 'react'
import ProductsTable from '@components/products/table'
import DefaultLayout from '@components/shared/layout/default'
import { Dialog, Transition } from '@headlessui/react'
import RegisterProductForm from '@components/products/form'
import { XMarkIcon, PlusIcon } from '@heroicons/react/20/solid'

const ProductsPage: FC = () => {
  const [addProductModalOpen, setAddProductModalOpen] = useState(false)

  const openAddProductModal = (): void => setAddProductModalOpen(true)
  const closeAddProductModal = (): void => setAddProductModalOpen(false)

  return (
    <DefaultLayout>
      <div className="flex flex-col mb-5">
        <div className="flex flex-row justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Productos</h1>
          <button
            onClick={openAddProductModal}
            className="inline-flex justify-center rounded-full border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-indigo-300 focus-visible:ring-offset-2">
            <PlusIcon className="-ml-1 mr-2 h-5 w-5 text-indigo-900"/>
            Crear
          </button>
        </div>
      </div>

      <ProductsTable/>

      <Transition appear show={addProductModalOpen} as={Fragment}>
        <Dialog onClose={closeAddProductModal} as="div"
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
                          Registrar producto
                        </h3>
                        <button
                          onClick={closeAddProductModal}
                          className="inline-flex justify-center rounded-full border border-transparent bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 focus:outline-none">
                          <XMarkIcon
                            className="h-5 w-5 text-red-700"
                          />
                        </button>
                      </div>
                    </div>
                  </Dialog.Title>

                  <div className="mt-2">
                    <RegisterProductForm onRegister={closeAddProductModal}/>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </DefaultLayout>
  )
}

export default ProductsPage
