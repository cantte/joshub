import { NextApiRequest, NextApiResponse } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.method === 'GET') {
    const supabase = createServerSupabaseClient({ req, res })

    const { data, error } = await supabase.from('orders').select()

    if (error !== null) {
      res.status(500).json({ error: error.message })
      return
    }

    res.status(200).json(data)
    return
  }

  if (req.method === 'POST') {
    const supabase = createServerSupabaseClient({ req, res })

    const { body } = req
    const { items, ...rest } = body

    const {
      data: order,
      error: createOrderError
    } = await supabase.from('orders').insert(rest).select()

    if (createOrderError !== null) {
      res.status(500).json({ error: createOrderError.message })
      return
    }

    if (order === null) {
      res.status(500).json({ error: 'Can\'t create order' })
      return
    }

    const orderItems = items.map((item: any) => ({
      ...item,
      order_id: order[0].id
    }))

    const {
      error: createOrderItemsError
    } = await supabase.from('orders_detail').insert(orderItems)

    if (createOrderItemsError !== null) {
      // Delete order if order items failed to create
      await supabase.from('orders').delete().eq('id', order[0].id)

      res.status(500).json({ error: createOrderItemsError.message })
      return
    }

    res.status(200).json(order[0])
    return
  }

  res.status(405).json({ error: 'Method not allowed' })
}

export default handler
