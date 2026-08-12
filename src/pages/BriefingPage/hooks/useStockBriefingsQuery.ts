import { getStockBriefings } from '@/api/generated/endpoints/briefing-controller/briefing-controller'
import { ApiResponseGetStockBriefingsResponse } from '@/api/generated/schemas/briefing-controller'
import { useApiQuery } from '@/hooks/api'
import { briefingQueryKeys } from '@/hooks/queries/briefing/briefingQueryKeys'
import { mapBriefingList } from '@/mappers/briefingMapper'

export function useStockBriefingsQuery(stockId: string | null) {
  return useApiQuery({
    queryKey: briefingQueryKeys.listByStock(stockId ?? ''),
    operation: getStockBriefings,
    endpoint: 'getStockBriefings',
    args: [stockId!],
    responseSchema: ApiResponseGetStockBriefingsResponse,
    response: 'requiredResult',
    map: mapBriefingList,
    enabled: Boolean(stockId),
    staleTime: 0,
  })
}
