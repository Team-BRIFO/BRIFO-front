import { signupSession } from '@/api/client/signupSession'
import { useGetStocksQuery } from '@/hooks/queries/stock/useStockQueries'

/** 검색을 열기 전 컴팩트 목록은 인기 순위 상위 5개만 보여주므로 딱 그만큼만 받아온다. */
const COMPACT_PAGE_SIZE = 5
/** 검색 화면을 열면 코스피200 전체 순위를 한 번에 받아온다. */
const POPULAR_PAGE_SIZE = 200
/** 키워드 검색은 서버가 허용하는 최대 size(50)를 넘지 않아야 한다. */
const SEARCH_PAGE_SIZE = 20

function resolvePageSize(keyword: string, isSearchOpen: boolean) {
  if (!isSearchOpen) return COMPACT_PAGE_SIZE
  if (keyword.trim()) return SEARCH_PAGE_SIZE
  return POPULAR_PAGE_SIZE
}

export function useOnboardingStocksQuery(keyword: string, isSearchOpen: boolean) {
  const size = resolvePageSize(keyword, isSearchOpen)
  return useGetStocksQuery(keyword, size, signupSession.isActive())
}
