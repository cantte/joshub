import { NextApiRequest, NextApiResponse } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method === 'GET') {
    const supabase = createServerSupabaseClient({ req, res })

    const { id } = req.query

    const { data, error } = await supabase
      .from('customers')
      .select()
      .eq('id', id as string)

    if (error != null) {
      res.status(500).json({ error: error.message })
      return
    }

    if (data == null || data.length === 0) {
      res.status(404).json({ error: 'Customer not found' })
      return
    }

    res.status(200).json(data[0])
    return
  }

  res.status(405).json({ error: 'Method not allowed' })
}

export default handler
