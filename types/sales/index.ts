import { TransactionDetail, TransactionDetailInput } from '@joshub/types/shared'

export type SaleDetailInput = TransactionDetailInput
export type SaleDetail = TransactionDetail & { sale_id: number }

export interface Sale {
  id: number
  customer_id: string
  employee_id: string
  total: number
  created_at: string
}
