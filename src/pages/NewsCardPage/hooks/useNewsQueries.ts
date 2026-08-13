import { useMemo } from 'react'

import { getNewsCards } from '@/api/generated/endpoints/news-controller/news-controller'
import { ApiResponseGetNewsCardsResponse } from '@/api/generated/schemas/news-controller'
import { useApiQuery } from '@/hooks/api'
import { mapNewsCards, mergeStockNewsCards } from '@/mappers/newsMapper'
import { useUserHomeQuery } from '@/pages/HomePage/hooks/useUserHomeQuery'

export const newsQueryKeys = {
  all: ['news'] as const,
  detail: (stockId: string) => [...newsQueryKeys.all, 'detail', stockId] as const,
}

export function useGetNewsCardDetail(stockId: string | null) {
  return useApiQuery({
    queryKey: newsQueryKeys.detail(stockId ?? ''),
    operation: getNewsCards,
    endpoint: 'getNewsCards',
    args: [stockId ?? ''],
    responseSchema: ApiResponseGetNewsCardsResponse,
    response: 'requiredResult',
    map: (result) => mapNewsCards(result),
    enabled: Boolean(stockId),
    staleTime: 0,
  })
}

/** 홈 todayNewsCards + 상세 API를 cardId 기준으로 병합해 전체 카드뉴스 목록 반환 */
export function useStockNewsCards(stockId: string | null) {
  const homeQuery = useUserHomeQuery()
  const detailQuery = useGetNewsCardDetail(stockId)

  const cards = useMemo(() => {
    if (!stockId) return []

    const detailCards = detailQuery.data ?? []
    const homeItems =
      homeQuery.data?.todayNewsCards.items.filter((item) => item.stock.stockId === stockId) ?? []

    if (homeItems.length === 0) return detailCards
    return mergeStockNewsCards(homeItems, detailCards)
  }, [stockId, homeQuery.data, detailQuery.data])

  return {
    cards,
    isLoading: detailQuery.isLoading,
    error: detailQuery.error,
    refetch: detailQuery.refetch,
    fetchStatus: detailQuery.fetchStatus,
  }
}
