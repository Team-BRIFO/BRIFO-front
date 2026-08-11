

import { getBriefingDetail } from '@/api/generated/endpoints/briefing-controller/briefing-controller'
import { ApiResponseGetBriefingDetailResponse } from '@/api/generated/schemas/briefing-controller'
import { useApiQuery } from '@/hooks/api'
import { briefingQueryKeys } from '@/hooks/queries/briefing/briefingQueryKeys'
import { mapBriefingDetail } from '@/mappers/briefingMapper'
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
        result,
        MOCK_AGENT_DETAIL_RESPONSES[result.agent.agentId]?.result,
      ),
    enabled: Boolean(briefingId),
    staleTime: 0,
  })
}
