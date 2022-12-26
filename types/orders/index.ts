import { TransactionDetail, TransactionDetailInput } from '@joshub/types/shared'

export type OrderDetailInput = TransactionDetailInput

export type OrderDetail = TransactionDetail & { order_id: number }

export interface OrderInputs {
  id?: number
  customer_id: string
  employee_id: string
  address: string
  total: number

  items?: OrderDetailInput[]

  pub_id: string
}

export type Order = Omit<OrderInputs, 'id'> & {
  id: number
  created_at: string
  items: OrderDetail[]
}
