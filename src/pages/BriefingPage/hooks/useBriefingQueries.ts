/* eslint-disable @typescript-eslint/no-explicit-any */
import { browserTokenStore } from '@/api/client/tokenStore'
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
import {
  MOCK_BRIEFING_DETAILS,
  MOCK_BRIEFING_LIST_BY_CARD,
} from '@/pages/BriefingPage/mockBriefing'

const mockGetBriefingDetail = async (briefingId: string) => {
  const MOCK_DATA: ApiResponseGetBriefingDetailResponse = {
    success: true,
    code: 'COMMON_200',
    message: 'Success',
    result: MOCK_BRIEFING_DETAILS[briefingId] as any,
  }

  if (!browserTokenStore.getAccessToken()) {
    return (
      MOCK_DATA || {
        success: true,
        code: '200',
        message: 'Success',
        result: MOCK_BRIEFING_DETAILS['1'] as any,
      }
    )
  }

  try {
    return await getBriefingDetail(briefingId)
  } catch {
    return (
      MOCK_DATA || {
        success: true,
        code: '200',
        message: 'Success',
        result: MOCK_BRIEFING_DETAILS['1'] as any,
      }
    )
  }
}

export function useBriefingDetailQuery(briefingId: string | null) {
  return useApiQuery({
    queryKey: briefingQueryKeys.detail(briefingId ?? ''),
    operation: mockGetBriefingDetail as typeof getBriefingDetail,
    endpoint: 'getBriefingDetail',
    args: [briefingId!],
    responseSchema: ApiResponseGetBriefingDetailResponse,
    response: 'requiredResult',
    map: (result) =>
      mapBriefingDetail(
        result as any,
        MOCK_AGENT_DETAIL_RESPONSES[result.agent?.agentId as string]?.result,
      ),
    enabled: Boolean(briefingId),
    staleTime: 0,
  })
}

const mockGetStockBriefings = async (cardId: string) => {
  const MOCK_DATA: ApiResponseGetStockBriefingsResponse = {
    success: true,
    code: 'COMMON_200',
    message: 'Success',
    result: MOCK_BRIEFING_LIST_BY_CARD as any,
  }

  if (!browserTokenStore.getAccessToken()) {
    return MOCK_DATA
  }

  try {
    return await getStockBriefings(cardId)
  } catch {
    return MOCK_DATA
  }
}

export function useCardNewsBriefingsQuery(cardId: string | null) {
  return useApiQuery({
    queryKey: briefingQueryKeys.listByCard(cardId ?? ''),
    operation: mockGetStockBriefings as typeof getStockBriefings,
    endpoint: 'getStockBriefings',
    args: [cardId!],
    responseSchema: ApiResponseGetStockBriefingsResponse,
    response: 'requiredResult',
    map: (result) => mapBriefingList(result as any),
    enabled: Boolean(cardId),
    staleTime: 0,
  })
}
