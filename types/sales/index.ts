import { Product } from '@joshub/types/products'

export interface SaleDetailInput {
  product?: Product

  quantity: number
  price: number
}

export type SaleDetail =
  Omit<SaleDetailInput, 'product'>
  & { sale_id: number, product_code: string, total: number }

export interface Sale {
  id: number
  customer_id: string
  employee_id: string
  total: number
  created_at: string
}
