import { DailyReport } from '@joshub/types/reports'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

interface UseDailyReport {
  dailyReport?: DailyReport
  isLoading: boolean
  error: Error | unknown
}

const useDailyReport = (): UseDailyReport => {
  const loadDailyReport = async (): Promise<DailyReport | undefined> => {
    const { data } = await axios.get<DailyReport>('/api/reports/today')

    return data
  }

  const { data, isLoading, error } = useQuery(['daily_reports'], loadDailyReport)

  return {
    dailyReport: data,
    isLoading,
    error
  }
}

export default useDailyReport
