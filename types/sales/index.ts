import { TransactionDetail, TransactionDetailInput } from '@joshub/types/shared'

export type SaleDetailInput = TransactionDetailInput
export type SaleDetail = TransactionDetail & { sale_id: number }

export interface SalesInputs {
  id?: number
  customer_id: string
  employee_id: string
  total: number

  items?: SaleDetailInput[]
}

export type Sale =
  Omit<SalesInputs, 'id'>
  & { id: number, created_at: string, items: SaleDetail[] }
