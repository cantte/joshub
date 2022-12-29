import React, { FC } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Product } from '@joshub/types/products'
import { SelectBox, SelectBoxItem } from '@tremor/react'
import axios from 'axios'
import { usePub } from '@joshub/store/pubs'

interface Props {
  onSelected: (value: Product) => void
}

const ProductField: FC<Props> = ({ onSelected }) => {
  const loadProducts = async (pubId: string): Promise<Product[] | null> => {
    const { data } = await axios.get<Product[]>(`/api/products?pubId=${pubId}`)
    return data
  }

  const { pub } = usePub()
  const { data: products } = useQuery(
    ['products'],
    async () => await loadProducts(pub?.id ?? ''),
    {
      enabled: pub !== undefined
    }
  )

  const handleSelect = (product: Product): void => {
    onSelected(product)
  }

  return (
    <>
      <label
        htmlFor='quantity'
        className='block text-sm mb-1 font-medium text-gray-700'
      >
        Producto
      </label>
      <SelectBox
        handleSelect={handleSelect}
        placeholder='Seleccione un producto'
      >
        {products !== undefined && products !== null
          ? (
              products.map(product => (
            <SelectBoxItem
              key={product.code}
              value={product}
              text={`${product.name}, $${Intl.NumberFormat('es').format(
                product.cold_spot_price
              )}`}
            />
              ))
            )
          : (
          <SelectBoxItem value={undefined} text='' />
            )}
      </SelectBox>
    </>
  )
}

export default ProductField
