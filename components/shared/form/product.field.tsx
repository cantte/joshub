import React, { FC } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useQuery } from '@tanstack/react-query'
import { Product } from '@joshub/types/products'
import { SelectBox, SelectBoxItem } from '@tremor/react'

interface Props {
  onSelected: (value: Product) => void
}

const ProductField: FC<Props> = ({ onSelected }) => {
  const supabase = useSupabaseClient()

  const loadProducts = async (): Promise<Product[] | null> => {
    const { data } = await supabase.from('products').select().is('deleted_at', null)
    return data
  }

  const {
    data: products
  } = useQuery(['products'], loadProducts)

  const handleSelect = (product: Product): void => {
    onSelected(product)
  }

  return (
    <>
      <label htmlFor="quantity"
             className="block text-sm mb-1 font-medium text-gray-700">
        Producto
      </label>
      <SelectBox handleSelect={handleSelect}
                 placeholder="Seleccione un producto">
        {
          products !== undefined && products !== null
            ? (
                products.map((product) => (
                <SelectBoxItem key={product.code} value={product}
                               text={`${product.name}, $${Intl.NumberFormat('es').format(product.cold_spot_price)}`}/>))
              )
            : <SelectBoxItem value={undefined} text=""/>
        }
      </SelectBox>
    </>
  )
}

export default ProductField
