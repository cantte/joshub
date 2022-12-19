import { TransactionDetailInput } from '@joshub/types/shared'
import { useEffect, useState } from 'react'

interface UseTransactionDetails {
  details: TransactionDetailInput[]
  addDetailModalOpen: boolean
  total: number

  addDetail: (detail: TransactionDetailInput) => void
  openAddDetailModal: () => void
  closeAddDetailModal: () => void
}

const useTransactionDetails = (): UseTransactionDetails => {
  const [details, setDetails] = useState<TransactionDetailInput[]>([])
  const [addDetailModalOpen, setAddDetailModalOpen] = useState(false)
  const [total, setTotal] = useState(0)

  const addDetail = (detail: TransactionDetailInput): void => {
    const exists = details.find(d => d.product?.code === detail.product?.code && d.price === Number(detail.price))
    if (exists === undefined) {
      setDetails([...details, detail])
      return
    }

    const newDetails = details.map(d => {
      if (d.product?.code === detail.product?.code) {
        return { ...d, quantity: Number(d.quantity) + Number(detail.quantity) }
      }
      return d
    })
    setDetails(newDetails)
  }
  const openAddDetailModal = (): void => setAddDetailModalOpen(true)
  const closeAddDetailModal = (): void => setAddDetailModalOpen(false)

  useEffect(() => {
    setTotal(details
      .map(item => Number(item.price) * Number(item.quantity))
      .reduce((accumulator, currentValue) =>
        accumulator + currentValue, 0))
  }, [details])

  return {
    details,
    addDetailModalOpen,
    total,

    addDetail,
    openAddDetailModal,
    closeAddDetailModal
  }
}

export default useTransactionDetails
