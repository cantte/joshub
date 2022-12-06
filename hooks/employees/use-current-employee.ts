import { Employee } from '@joshub/types/employees'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { useQuery } from '@tanstack/react-query'

interface UseCurrentEmployee {
  employee?: Employee
  isLoading: boolean
  error?: Error | unknown
}

export const useCurrentEmployee = (): UseCurrentEmployee => {
  const supabase = useSupabaseClient()
  const user = useUser()

  const loadEmployee = async (userId: string | undefined): Promise<Employee | undefined> => {
    if (userId === undefined) {
      return undefined
    }
    const { data } = await supabase.from('employees')
      .select().eq('user_id', userId)
    return data !== null ? data[0] : undefined
  }

  const { data: employee, isLoading, error } = useQuery(['employee', user],
    async () => await loadEmployee(user?.id), {
      enabled: user !== undefined
    })

  return {
    employee,
    isLoading,
    error
  }
}

export default useCurrentEmployee
