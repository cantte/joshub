import { type NextApiRequest, type NextApiResponse } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method === 'POST') {
    const supabase = createServerSupabaseClient({
      req,
      res
    })

    const { body } = req
    const { owner, user_id: userId, ...rest } = body
    const pub = {
      ...rest,
      owner: userId
    }

    const { data, error } = await supabase.from('pubs').insert(pub).select()

    if (error != null) {
      res.status(500).json({ error: error.message })
      return
    }

    const pubId = data[0].id

    const { error: ownerError } = await supabase
      .from('employees')
      .insert({
        ...owner,
        pub_id: pubId,
        user_id: userId
      })
      .select()

    if (ownerError != null) {
      // delete the pub
      await supabase.from('pubs').delete().eq('id', pubId)

      res.status(500).json({ error: ownerError.message })
      return
    }

    res.status(200).json(data[0])
    return
  }

  if (req.method === 'GET') {
    const supabase = createServerSupabaseClient({
      req,
      res
    })

    const { owner } = req.query

    const { data, error } = await supabase
      .from('pubs')
      .select()
      .eq('owner', owner)

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

  res.status(405).json({ error: 'Method not allowed' })
}

export default handler
