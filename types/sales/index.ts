import { TransactionDetail, TransactionDetailInput } from '@joshub/types/shared'

export type SaleDetailInput = TransactionDetailInput
export type SaleDetail = TransactionDetail & { sale_id: number }

export interface SalesInputs {
  id?: number
  customer_id: string
  employee_id: string
  total: number

  items?: SaleDetailInput[]

  pub_id: string
}

export type Sale = Omit<SalesInputs, 'id' | 'pub_id'> & {
  id: number
  created_at: string
}

interface SaleCustomer {
  id: string
  name: string
}

interface SaleEmployee {
  id: string
  name: string
}

export type SingleSale = Omit<Sale, 'customer_id' | 'employee_id'> & {
  customer: SaleCustomer
  employee: SaleEmployee
  items: SaleDetail[]
}
