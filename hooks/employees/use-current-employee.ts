import { Employee } from '@joshub/types/employees'
import { useUser } from '@supabase/auth-helpers-react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

interface UseCurrentEmployee {
  employee?: Employee
  isLoading: boolean
  error?: Error | unknown
}

export const useCurrentEmployee = (): UseCurrentEmployee => {
  const user = useUser()

  const loadEmployee = async (userId: string | undefined): Promise<Employee | undefined> => {
    if (userId === undefined) {
      return undefined
    }

    const { data } = await axios.get<Employee>(`/api/employees?userId=${userId}`)

    return data
  }

  const { data: employee, isLoading, error } = useQuery(['employee', user?.id ?? ''],
    async () => await loadEmployee(user?.id), {
      enabled: user !== undefined && user !== null
    })

  return {
    employee,
    isLoading,
    error
  }
}

export default useCurrentEmployee
