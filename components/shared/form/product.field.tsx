import React, { FC, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Product } from '@joshub/types/products'
import axios from 'axios'
import { usePub } from '@joshub/store/pubs'

interface Props {
  onSelected: (value: Product) => void
}

const ProductField: FC<Props> = ({ onSelected }) => {
  const [searchText, setSearchText] = useState('')
  const [search, setSearch] = useState('')

  const handleChange = (text: string): void => {
    setSearchText(text)
  }

  const loadProducts = async (pubId: string, search: string): Promise<Product[] | null> => {
    const { data } = await axios.get<Product[]>(`/api/products/search?pubId=${pubId}&search=${search}`)
    return data
  }

  const { pub } = usePub()
  const {
    data: products,
    isFetching
  } = useQuery(
    ['products', search],
    async () => await loadProducts(pub?.id ?? '', search),
    {
      refetchOnWindowFocus: false,
      enabled: pub !== undefined && search !== undefined && search !== ''
    }
  )

  const handleSelect = (product: Product): void => {
    onSelected(product)
  }

  const handleEnter = (): void => {
    setSearch(searchText)
  }

  return (
    <>
      <label className="block">
        <span className="block">Producto</span>
        <div className="relative">
          <input
            type="text"
            onChange={e => handleChange(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleEnter()
              }
            }}
            disabled={isFetching}
            className="block border text-lg px-4 py-3 mt-2 rounded-lg border-gray-200 focus:bg-white text-gray-900 focus:border-blue-600 focus:ring-0 outline-none w-full  disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
          />
          <button
            type="button"
            onClick={handleEnter}
            disabled={isFetching}
            className="absolute py-2 px-3 right-2.5 bottom-2.5 text-xs font-medium text-center inline-flex text-indigo-900 border-indigo-100 rounded-lg hover:border-indigo-200 border border-transparent"
          >
            Buscar
          </button>
        </div>

        <span className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Digite el nombre del producto y presione enter para buscar
        </span>
      </label>

      {(products != null) && products.length > 0 && (
        <div className="mt-6">
          <ul className="divide-y divide-gray-200">
            {products.map(product => (
              <li
                key={product.code}
                className="py-4 flex justify-between items-center cursor-pointer hover:bg-gray-100"
                onClick={() => handleSelect(product)}
              >
                <div className="flex items-center">
                  <div className="ml-4">
                    <div className="text-gray-900">{product.name}</div>
                  </div>
                </div>
                <div className="mr-4 flex-shrink-0">
                  <p className="text-sm text-gray-500">Cantidad
                    disponible: {product.quantity}</p>
                </div>
              </li>
            ))}
          </ul>
          <span className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Seleccione un producto para agregarlo a la lista
        </span>
        </div>
      )}

      {products != null && products.length === 0 && (
        <p className="text-gray-500 mt-6 text-center">
          No se encontraron productos.
        </p>
      )}
    </>
  )
}

export default ProductField
