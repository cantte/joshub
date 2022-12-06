import React, { FC } from 'react'
import ProductsTable from '@components/products/table'
import DefaultLayout from '@components/shared/layout/default'

const ProductsPage: FC = () => {
  return (
    <DefaultLayout>
      <ProductsTable/>
    </DefaultLayout>
  )
}

export default ProductsPage
