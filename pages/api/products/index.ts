import { NextApiRequest, NextApiResponse } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method === 'GET') {
    const supabase = createServerSupabaseClient({ req, res })

    const { pubId } = req.query
    const { data, error } = await supabase
      .from('products')
      .select()
      .is('deleted_at', null)
      .eq('pub_id', pubId as string)

    if (error != null) {
      res.status(500).json({ error: error.message })
      return
    }

    res.status(200).json(data)
    return
  }

  if (req.method === 'POST') {
    const supabase = createServerSupabaseClient({ req, res })

    const { body } = req
    const { data, error } = await supabase
      .from('products')
      .insert(body)
      .select()

    if (error != null) {
      res.status(500).json({ error: error.message })
      return
    }

    res.status(200).json(data)
    return
  }

  res.status(405).json({ error: 'Method not allowed' })
}

export default handler
