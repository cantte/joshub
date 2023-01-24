import { type NextApiRequest, type NextApiResponse } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const supabase = createServerSupabaseClient({ req, res })

  if (req.method === 'GET') {
    const { userId } = req.query

    if (userId !== undefined) {
      const { data, error } = await supabase
        .from('employees')
        .select()
        .eq('user_id', userId as string)

      if (error !== null) {
        res.status(500).json({ error: error.message })
        return
      }

      if (data === null || data.length === 0) {
        res.status(404).json({ error: 'No employee found' })
        return
      }

      res.status(200).json(data[0])
      return
    }

    const { pubId } = req.query

    const { data, error } = await supabase
      .from('employees')
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
    const { body } = req
    const user = {
      email: body.email,
      password: body.password
    }

    const { data: createdUser, error: userError } =
      await supabase.auth.admin.createUser(user)

    if (userError != null || createdUser.user == null) {
      res
        .status(500)
        .json({ error: userError?.message ?? 'Failed to create user' })
      return
    }

    const { email, password, ...rest } = body
    const employee = {
      ...rest,
      user_id: createdUser.user.id
    }

    const { data, error } = await supabase
      .from('employees')
      .insert(employee)
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
