import { FC } from 'react'
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow
} from '@tremor/react'
import { Sale } from '@joshub/types/sales'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { usePub } from '@joshub/store/pubs'

const SalesTable: FC = () => {
  const pub = usePub()
  const loadSales = async (pubId: string): Promise<Sale[] | null> => {
    const { data } = await axios.get<Sale[]>(`/api/sales/latest?pubId=${pubId}`)

    return data
  }

  const { data: sales } = useQuery(
    ['sales'],
    async () => await loadSales(pub?.id ?? ''),
    {
      enabled: pub !== undefined
    }
  )

  return (
    <div className='col-span-6 mt-5'>
      <Card>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Fecha</TableHeaderCell>
              <TableHeaderCell>Cliente</TableHeaderCell>
              <TableHeaderCell>Empleado</TableHeaderCell>
              <TableHeaderCell>Total</TableHeaderCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {sales !== undefined && sales !== null
              ? (
                  sales.map(sale => (
                <TableRow key={sale.id}>
                  <TableCell>
                    {Intl.DateTimeFormat('es').format(
                      Date.parse(sale.created_at)
                    )}
                  </TableCell>
                  <TableCell>{sale.customer_id}</TableCell>
                  <TableCell>{sale.employee_id}</TableCell>
                  <TableCell>
                    ${Intl.NumberFormat('es').format(sale.total)}
                  </TableCell>
                </TableRow>
                  ))
                )
              : (
              <TableRow>
                <TableCell>No hay ventas</TableCell>
              </TableRow>
                )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}

export default SalesTable
