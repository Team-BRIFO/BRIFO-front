import { signupSession } from '@/api/client/signupSession'
import { useGetStocksQuery } from '@/hooks/queries/stock/useStockQueries'

/** 키워드 없이 인기 종목을 조회할 때는 코스피200 전체 순위를 한 번에 받아온다. */
const POPULAR_PAGE_SIZE = 200
/** 키워드 검색은 서버가 허용하는 최대 size(50)를 넘지 않아야 한다. */
const SEARCH_PAGE_SIZE = 20

export function useOnboardingStocksQuery(keyword: string) {
  const size = keyword.trim() ? SEARCH_PAGE_SIZE : POPULAR_PAGE_SIZE
  return useGetStocksQuery(keyword, size, signupSession.isActive())
}
