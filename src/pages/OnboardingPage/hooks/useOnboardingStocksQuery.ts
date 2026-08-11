import { signupSession } from '@/api/client/signupSession'
import { useGetStocksQuery } from '@/hooks/queries/stock/useStockQueries'

const STOCK_PAGE_SIZE = 20

export function useOnboardingStocksQuery(keyword: string) {
  return useGetStocksQuery(keyword, STOCK_PAGE_SIZE, signupSession.isActive())
}
