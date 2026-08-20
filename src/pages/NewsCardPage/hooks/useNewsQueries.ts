import { getNewsCards } from '@/api/generated/endpoints/news-controller/news-controller'
import { ApiResponseGetNewsCardsResponse } from '@/api/generated/schemas/news-controller'
import { useApiQuery } from '@/hooks/api'
import { mapNewsCards } from '@/mappers/newsMapper'

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

/**
 * 카드뉴스 상세 목록.
 *
 * 예전에는 홈 `todayNewsCards`와 병합했다. 상세 API가 카드를 2건만 내려주던 시절의 보정인데,
 * 홈 데이터에는 본문·용어·이미지가 없어서 제목만 있는 빈 카드가 생겼다. 서버가 그날 카드를
 * 전부 내려주게 되면서 병합을 걷어냈다.
 */
export function useStockNewsCards(stockId: string | null) {
  const detailQuery = useGetNewsCardDetail(stockId)

  return {
    cards: detailQuery.data ?? [],
    isLoading: detailQuery.isLoading,
    error: detailQuery.error,
    refetch: detailQuery.refetch,
    fetchStatus: detailQuery.fetchStatus,
  }
}
