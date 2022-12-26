import { NextApiRequest, NextApiResponse } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.method === 'GET') {
    const supabase = createServerSupabaseClient({ req, res })
    const { pubId } = req.query

    const {
      data,
      error
    } = await supabase.from('daily_reports').select()
      .eq('created_at', new Date().toISOString().split('T')[0])
      .eq('pub_id', pubId)

    if (error !== null) {
      res.status(500).json({ error: error.message })
      return
    }

    res.status(200).json(data[0])
    return
  }

  res.status(405).json({ error: 'Method not allowed' })
}

export default handler
