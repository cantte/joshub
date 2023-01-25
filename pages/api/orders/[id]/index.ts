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
      .from('orders')
      .select(
        `
              id,
              customers(id,name),
              employees(id,name),
              address,
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
      res.status(404).json({ error: 'Order not found' })
      return
    }

    const { data: orderItems, error: orderItemsError } = await supabase
      .from('orders_detail')
      .select(
        `
              id,
              products(code,name),
              quantity,
              price,
              total
      `
      )
      .eq('order_id', id)

    if (orderItemsError !== null) {
      res.status(500).json({ error: orderItemsError.message })
      return
    }

    const order = {
      id: data[0].id,
      address: data[0].address,
      total: data[0].total,
      created_at: data[0].created_at,
      customer: data[0].customers,
      employee: data[0].employees,
      items: orderItems?.map(item => ({
        id: item.id,
        product: item.products,
        quantity: item.quantity,
        price: item.price,
        total: item.total
      }))
    }

    res.status(200).json(order)
    return
  }

  res.status(405).json({ error: 'Method not allowed' })
}

export default handler
