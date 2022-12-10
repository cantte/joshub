import { Product } from '@joshub/types/products'

export interface TransactionDetailInput {
  product?: Product

  quantity: number
  price: number
}

export type TransactionDetail =
  Omit<TransactionDetailInput, 'product'>
  & { product_code: string, total: number }
