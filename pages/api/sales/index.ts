import { type NextApiRequest, type NextApiResponse } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method === 'GET') {
    const supabase = createServerSupabaseClient({ req, res })

    const { data, error } = await supabase.from('sales').select()

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

    const { data: sale, error: createSaleError } = await supabase
      .from('sales')
      .insert(rest)
      .select()

    if (createSaleError !== null) {
      res.status(500).json({ error: createSaleError.message })
      return
    }

    if (sale === null) {
      res.status(500).json({ error: "Can't create sale" })
      return
    }

    const saleItems = items.map((item: any) => ({
      ...item,
      sale_id: sale[0].id
    }))

    const { error: createSaleItemsError } = await supabase
      .from('sales_detail')
      .insert(saleItems)

    if (createSaleItemsError !== null) {
      // Delete sale if sale items failed to create
      await supabase.from('sales').delete().eq('id', sale[0].id)

      res.status(500).json({ error: createSaleItemsError.message })
      return
    }

    res.status(200).json(sale[0])
    return
  }

  res.status(405).json({ error: 'Method not allowed' })
}

export default handler
