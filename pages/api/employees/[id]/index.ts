import { type NextApiRequest, type NextApiResponse } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method === 'DELETE') {
    const supabase = createServerSupabaseClient({ req, res })

    const { id } = req.query
    const { data, error } = await supabase
      .from('employees')
      .update({ deleted_at: new Date() })
      .eq('id', id as string)

    if (error != null) {
      res.status(500).json({ error: error.message })
      return
    }

    if (data != null && data.length > 0) {
      res.status(200).json(data[0])
      return
    }

    res.status(404).json({ error: 'Not found' })
    return
  }

  if (req.method === 'PUT') {
    const supabase = createServerSupabaseClient({ req, res })

    const { id } = req.query
    const { body } = req
    const { data, error } = await supabase
      .from('employees')
      .update(body)
      .eq('id', id as string)

    if (error != null) {
      res.status(500).json({ error: error.message })
      return
    }

    res.status(200).json(data)
  }
}

export default handler
