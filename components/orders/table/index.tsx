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
import { Order } from '@joshub/types/orders'
import { useQuery } from '@tanstack/react-query'

const OrdersTable: FC = () => {
  const supabase = useSupabaseClient()

  const loadOrders = async (): Promise<Order[] | null> => {
    const { data } = await supabase.from('orders')
      .select().limit(5).order('created_at', { ascending: false })
    return data
  }

  const { data: orders } = useQuery(['orders'], loadOrders)

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
            {orders !== undefined && orders !== null
              ? orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{Intl.DateTimeFormat('es').format(Date.parse(order.created_at))}</TableCell>
                  <TableCell>{order.customer_id}</TableCell>
                  <TableCell>{order.employee_id}</TableCell>
                  <TableCell>${Intl.NumberFormat('es').format(order.total)}</TableCell>
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

export default OrdersTable
