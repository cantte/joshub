import { NextApiRequest, NextApiResponse } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method === 'GET') {
    const supabase = createServerSupabaseClient({ req, res })

    const { idOrPhone } = req.query

    const { data, error } = await supabase
      .from('employees')
      .select()
      .or(`phone.eq.${idOrPhone as string},id.eq.${idOrPhone as string}`)

    if (error !== null) {
      res.status(500).json({ error: error.message })
      return
    }

    if (data === null || data.length === 0) {
      res.status(200).json(false)
      return
    }

    res.status(200).json(true)
    return
  }

  res.status(405).json({ error: 'Method not allowed' })
}

export default handler
