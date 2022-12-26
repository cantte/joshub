import { DailyReport } from '@joshub/types/reports'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { usePub } from '@joshub/store/pubs'

interface UseDailyReport {
  dailyReport?: DailyReport
  isLoading: boolean
  error: Error | unknown
}

const useDailyReport = (): UseDailyReport => {
  const loadDailyReport = async (
    pubId: string
  ): Promise<DailyReport | undefined> => {
    const { data } = await axios.get<DailyReport>(
      `/api/reports/today?pubId=${pubId}`
    )

    return data
  }

  const pub = usePub()
  const { data, isLoading, error } = useQuery(
    ['daily_reports'],
    async () => await loadDailyReport(pub?.id ?? ''),
    {
      enabled: pub !== undefined
    }
  )

  return {
    dailyReport: data,
    isLoading,
    error
  }
}

export default useDailyReport
