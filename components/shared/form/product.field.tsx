import React, { FC, Fragment, useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useQuery } from '@tanstack/react-query'
import { Combobox, Transition } from '@headlessui/react'
import { Product } from '@joshub/types/products'

interface Props {
  onSelected: (value: Product) => void
}

const ProductField: FC<Props> = ({ onSelected }) => {
  const supabase = useSupabaseClient()

  const loadProducts = async (): Promise<Product[] | null> => {
    const { data } = await supabase.from('products').select()
    return data
  }

  const {
    data: products
  } = useQuery(['products'], loadProducts)

  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Product | undefined>(undefined)

  const filteredProducts = query === ''
    ? products
    : products?.filter((product) => product.name.toLowerCase()
      .replace(/\s+/g, '')
      .includes(query.toLowerCase().replace(/\s+/g, '')))

  const handleSelect = (product: Product): void => {
    setSelected(product)
    onSelected(product)
  }

  return (
    <Combobox value={selected} onChange={handleSelect}>
      <div className="relative mt-1">
        <div
          className="relative w-full">
          <Combobox.Label
            className="block text-sm font-medium text-gray-700">Producto</Combobox.Label>
          <Combobox.Input
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            onChange={(e) => setQuery(e.target.value)}
            displayValue={(product: Product) => product === undefined ? '' : `${String(product.name)}, ${String(product.cold_spot_price)}`}
          />
        </div>
      </div>

      <Transition
        as={Fragment}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        afterLeave={() => setQuery('')}>
        <Combobox.Options
          className="absolute mt-1 rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {filteredProducts?.map((product) => (
            <Combobox.Option key={product.code} value={product}
                             className="ui-active:bg-blue-500 ui-active:text-white ui-not-active:bg-white ui-not-active:text-gray-800 py-2 px-3"
            >
              {product.name}, {product.cold_spot_price}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Transition>
    </Combobox>
  )
}

export default ProductField
