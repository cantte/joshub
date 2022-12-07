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
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { Sale } from '@joshub/types/sales'
import { useQuery } from '@tanstack/react-query'

const SalesTable: FC = () => {
  const supabase = useSupabaseClient()

  const loadSales = async (): Promise<Sale[] | null> => {
    const { data } = await supabase.from('sales')
      .select().limit(5).order('created_at', { ascending: false })
    return data
  }

  const { data: sales } = useQuery(['sales'], loadSales)

  return (
    <div className="col-span-6 mt-5">
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
              ? sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>{Intl.DateTimeFormat('es').format(Date.parse(sale.created_at))}</TableCell>
                  <TableCell>{sale.customer_id}</TableCell>
                  <TableCell>{sale.employee_id}</TableCell>
                  <TableCell>${Intl.NumberFormat('es').format(sale.total)}</TableCell>
                </TableRow>
              ))
              : <TableRow>
                <TableCell>
                  No hay ventas
                </TableCell>
              </TableRow>}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}

export default SalesTable
