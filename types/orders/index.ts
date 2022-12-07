import { Product } from '@joshub/types/products'

export interface OrderDetailInput {
  product?: Product

  quantity: number
  price: number
}

export type OrderDetail =
  Omit<OrderDetailInput, 'product'>
  & { order_id: number, product_code: string, total: number }

export interface Order {
  id: number
  customer_id: string
  employee_id: string
  total: number
  created_at: string
}
