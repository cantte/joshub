import React, { FC } from 'react'
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow
} from '@tremor/react'
import { Order } from '@joshub/types/orders'
import { useQuery } from '@tanstack/react-query'
import { usePub } from '@joshub/store/pubs'
import axios from 'axios'
import NextLink from 'next/link'
import { EyeIcon } from '@heroicons/react/24/outline'

const OrdersTable: FC = () => {
  const { pub } = usePub()
  const loadOrders = async (pubId: string): Promise<Order[] | null> => {
    const { data } = await axios.get<Order[]>(
      `/api/orders/latest?pubId=${pubId}`
    )

    return data
  }

  const { data: orders } = useQuery(
    ['orders'],
    async () => await loadOrders(pub?.id ?? ''),
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
              <TableHeaderCell>Dirección</TableHeaderCell>
              <TableHeaderCell>Empleado</TableHeaderCell>
              <TableHeaderCell>Total</TableHeaderCell>
              <TableHeaderCell>{' '}</TableHeaderCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {orders !== undefined && orders !== null
              ? (
                  orders.map(order => (
                  <TableRow key={order.id}>
                    <TableCell>
                      {Intl.DateTimeFormat('es').format(
                        Date.parse(order.created_at)
                      )}
                    </TableCell>
                    <TableCell>{order.customer_id}</TableCell>
                    <TableCell>{order.address}</TableCell>
                    <TableCell>{order.employee_id}</TableCell>
                    <TableCell>
                      ${Intl.NumberFormat('es').format(order.total)}
                    </TableCell>
                    <TableCell>
                      <NextLink href={`/orders/${order.id}`}>
                        <button
                          type='button'
                          title='Ver orden'
                          className='inline-flex justify-center rounded-full border border-transparent bg-white px-2 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50 focus:outline-none'
                        >
                          <EyeIcon className='h-5 w-5 text-indigo-700' />
                        </button>
                      </NextLink>
                    </TableCell>
                  </TableRow>
                  ))
                )
              : (
                <TableRow>
                  <TableCell textAlignment='text-center'>No hay
                    ventas</TableCell>
                </TableRow>
                )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}

export default OrdersTable
