import { z } from 'zod'

import {
  getBriefingDetail,
  getStockBriefings,
} from '@/api/generated/endpoints/briefing-controller/briefing-controller'
import { useApiQuery } from '@/hooks/api'
import { briefingQueryKeys } from '@/hooks/queries/briefing/briefingQueryKeys'
import { mapBriefingDetail, mapBriefingList } from '@/mappers/briefingMapper'
import { MOCK_AGENT_DETAIL_RESPONSES } from '@/mocks/agent'

export function useBriefingDetailQuery(briefingId: string | null) {
  return useApiQuery({
    queryKey: briefingQueryKeys.detail(briefingId ?? ''),
    operation: getBriefingDetail,
    endpoint: 'getBriefingDetail',
    args: [briefingId!],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    responseSchema: z.any() as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    response: 'requiredResult' as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    map: (result: any) =>
      mapBriefingDetail(
        result,
        MOCK_AGENT_DETAIL_RESPONSES[result.agent?.agentId as string]?.result,
      ),
    enabled: Boolean(briefingId),
    staleTime: 0,
  })
}

export function useCardNewsBriefingsQuery(cardId: string | null) {
  return useApiQuery({
    queryKey: briefingQueryKeys.listByCard(cardId ?? ''),
    operation: getStockBriefings,
    endpoint: 'getStockBriefings',
    args: [cardId!],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    responseSchema: z.any() as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    response: 'requiredResult' as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    map: (result: any) => mapBriefingList(result),
    enabled: Boolean(cardId),
    staleTime: 0,
  })
}
