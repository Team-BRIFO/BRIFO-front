/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  getBriefingDetail,
  getStockBriefings,
} from '@/api/generated/endpoints/briefing-controller/briefing-controller'
import {
  ApiResponseGetBriefingDetailResponse,
  ApiResponseGetStockBriefingsResponse,
} from '@/api/generated/schemas'
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
    responseSchema: ApiResponseGetBriefingDetailResponse,
    response: 'requiredResult',
    map: (result) =>
      mapBriefingDetail(
        result as any, // Temporary cast until mapper types are fully synced with generated types
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
    responseSchema: ApiResponseGetStockBriefingsResponse,
    response: 'requiredResult',
    map: (result) => mapBriefingList(result as any),
    enabled: Boolean(cardId),
    staleTime: 0,
  })
}
