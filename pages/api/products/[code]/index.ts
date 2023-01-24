import { type NextApiRequest, type NextApiResponse } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method === 'DELETE') {
    const supabase = createServerSupabaseClient({ req, res })

    const { code } = req.query
    const { data, error } = await supabase
      .from('products')
      .update({ deleted_at: new Date() })
      .eq('code', code as string)

    if (error != null) {
      res.status(500).json({ error: error.message })
      return
    }

    res.status(200).json(data)
    return
  }

  if (req.method === 'PUT') {
    const supabase = createServerSupabaseClient({ req, res })

    const { code } = req.query
    const { body } = req
    const { data, error } = await supabase
      .from('products')
      .update({
        ...body,
        updated_at: new Date()
      })
      .eq('code', code as string)

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
