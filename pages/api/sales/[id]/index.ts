import { type NextApiRequest, type NextApiResponse } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method === 'GET') {
    const supabase = createServerSupabaseClient({ req, res })

    const { id } = req.query

    const { data, error } = await supabase
      .from('sales')
      .select(
        `
              id,
              customers(id,name),
              employees(id,name),
              total,
              created_at
      `
      )
      .eq('id', id)

    if (error !== null) {
      res.status(500).json({ error: error.message })
      return
    }

    if (data === null || data.length === 0) {
      res.status(404).json({ error: 'Sale not found' })
      return
    }

    const { data: saleItems, error: saleItemsError } = await supabase
      .from('sales_detail')
      .select(
        `
              id,
              products(code,name),
              quantity,
              price,
              total
      `
      )
      .eq('sale_id', id)

    if (saleItemsError !== null) {
      res.status(500).json({ error: saleItemsError.message })
      return
    }

    const sale = {
      id: data[0].id,
      total: data[0].total,
      created_at: data[0].created_at,
      customer: data[0].customers,
      employee: data[0].employees,
      items: saleItems?.map(item => ({
        id: item.id,
        product: item.products,
        quantity: item.quantity,
        price: item.price,
        total: item.total
      }))
    }

    res.status(200).json(sale)
    return
  }

  res.status(405).json({ error: 'Method not allowed' })
}

export default handler
