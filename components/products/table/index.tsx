import React, { FC } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { Product } from '@joshub/types/products'
import { useQuery } from '@tanstack/react-query'
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline'

const ProductsTable: FC = () => {
  const supabase = useSupabaseClient()

  const loadProducts = async (): Promise<Product[] | null> => {
    const { data } = await supabase.from('products').select()
    return data
  }

  const {
    data: products
  } = useQuery(['products'], loadProducts)

  return (
    <div className="col-span-6">
      <div className="overflow-x-auto relative">
        <table
          className="w-full text-sm text-left text-gray-500">
          <thead
            className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="py-3 px-6">
              Código
            </th>
            <th scope="col" className="py-3 px-6">
              Nombre
            </th>
            <th scope="col" className="py-3 px-6">
              Cantidad
            </th>
            <th scope="col" className="py-3 px-6">
              Precio de venta punto frio
            </th>
            <th scope="col" className="py-3 px-6">
              Precio de venta estanco
            </th>
            <th scope="col" className="py-3 px-6"></th>
          </tr>
          </thead>
          <tbody>
          {
            products?.map(product => (
              <tr
                key={product?.code}
                className="bg-white border-b">
                <th scope="row"
                    className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap">
                  {product.code}
                </th>
                <th scope="row">
                  {product.name}
                </th>
                <td className="py-4 px-6">
                  {product.quantity}
                </td>
                <td className="py-4 px-6">
                  ${product.cold_spot_price}
                </td>
                <td className="py-4 px-6">
                  ${product.watertight_price}
                </td>
                <td className="py-4 px-6">
                  <button
                    className="inline-flex justify-center rounded-full border border-transparent bg-white px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50 focus:outline-none">
                    <PencilIcon className="h-5 w-5 text-indigo-700"/>
                  </button>

                  <button
                    className="inline-flex justify-center rounded-full border border-transparent bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 focus:outline-none">
                    <TrashIcon className="h-5 w-5 text-red-700"/>
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

export default ProductsTable
