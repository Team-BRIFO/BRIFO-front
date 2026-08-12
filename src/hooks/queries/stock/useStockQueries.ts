import { getStocks } from '@/api/generated/endpoints/stock-controller/stock-controller'
import type { GetStocksParams } from '@/api/generated/schemas'
import { ApiResponseGetStocksResponse } from '@/api/generated/schemas/stock-controller'
import { useApiInfiniteQuery } from '@/hooks/api'

export const stockQueryKeys = {
  all: ['stocks'] as const,
  list: (keyword: string, size: number) =>
    [...stockQueryKeys.all, 'list', { keyword, size }] as const,
}

/** 검색어와 cursor를 기준으로 관심종목 후보를 조회한다. */
export function useGetStocksQuery(keyword: string, size: number, enabled: boolean = true) {
  const normalizedKeyword = keyword.trim()

  return useApiInfiniteQuery({
    queryKey: stockQueryKeys.list(normalizedKeyword, size),
    operation: getStocks,
    endpoint: 'getStocks',
    responseSchema: ApiResponseGetStocksResponse,
    response: 'requiredResult',
    getArgs: ({ pageParam }): [GetStocksParams] => [
      {
        request: {
          cursor: pageParam ?? undefined,
          keyword: normalizedKeyword || undefined,
          size,
        },
      },
    ],
    enabled,
    staleTime: 0,
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) =>
      lastPage.page.hasNext ? (lastPage.page.nextCursor ?? undefined) : undefined,
  })
}
