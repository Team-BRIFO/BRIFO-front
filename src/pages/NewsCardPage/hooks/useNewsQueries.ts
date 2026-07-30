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
