import { useQuery } from '@tanstack/react-query'

import { getBriefingDetail, getCardNewsBriefings } from '@/api/briefing'
import { briefingQueryKeys } from '@/hooks/queries/briefing/briefingQueryKeys'
import { mapBriefingDetail, mapBriefingList } from '@/mappers/briefingMapper'
import { MOCK_AGENT_DETAIL_RESPONSES } from '@/mocks/agent'

export function useBriefingDetailQuery(briefingId: string | null) {
  return useQuery({
    queryKey: briefingQueryKeys.detail(briefingId ?? ''),
    queryFn: async () => {
      const response = await getBriefingDetail(briefingId!)
      return mapBriefingDetail(
        response.result,
        MOCK_AGENT_DETAIL_RESPONSES[response.result.agent.agentId]?.result,
      )
    },
    enabled: Boolean(briefingId),
  })
}

export function useCardNewsBriefingsQuery(cardId: string | null) {
  return useQuery({
    queryKey: briefingQueryKeys.listByCard(cardId ?? ''),
    queryFn: async () => mapBriefingList((await getCardNewsBriefings(cardId!)).result),
    enabled: Boolean(cardId),
  })
}
