import React, { type FC } from 'react'
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow
} from '@tremor/react'
import { type Sale } from '@joshub/types/sales'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { usePub } from '@joshub/store/pubs'
import NextLink from 'next/link'
import { EyeIcon } from '@heroicons/react/24/outline'

const SalesTable: FC = () => {
  const { pub } = usePub()
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
              <TableHeaderCell>
                <span className='sr-only'>Acciones</span>
              </TableHeaderCell>
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
                  <TableCell>
                    <NextLink href={`/sales/${sale.id}`}>
                      <button
                        type='button'
                        title='Ver venta'
                        className='inline-flex justify-center rounded-full border border-transparent bg-white px-2 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50 focus:outline-none'
                      >
                        <EyeIcon className='h-5 w-5 text-blue-700' />
                      </button>
                    </NextLink>
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
