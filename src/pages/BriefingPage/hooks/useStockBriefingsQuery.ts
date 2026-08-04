import { z } from 'zod'

import { getStockBriefings } from '@/api/generated/endpoints/briefing-controller/briefing-controller'
import { useApiQuery } from '@/hooks/api'
import { briefingQueryKeys } from '@/hooks/queries/briefing/briefingQueryKeys'
import { mapBriefingList } from '@/mappers/briefingMapper'

export function useStockBriefingsQuery(stockId: string | null) {
  return useApiQuery({
    queryKey: briefingQueryKeys.listByStock(stockId ?? ''),
    operation: getStockBriefings,
    endpoint: 'getStockBriefings',
    args: [stockId!],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    responseSchema: z.any() as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    response: 'requiredResult' as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    map: (result: any) => mapBriefingList(result),
    enabled: Boolean(stockId),
    staleTime: 0,
  })
}
