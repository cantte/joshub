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

interface OrderCustomer {
  id: string
  name: string
}

interface OrderEmployee {
  id: string
  name: string
}

export type Order = Omit<OrderInputs, 'id' | 'pub_id'> & {
  id: number
  created_at: string
}

export type SingleOrder = Omit<Order, 'customer_id' | 'employee_id'> & {
  customer: OrderCustomer
  employee: OrderEmployee
  items: OrderDetail[]
}
