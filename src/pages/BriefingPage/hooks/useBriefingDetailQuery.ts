import { getBriefingDetail } from '@/api/generated/endpoints/briefing-controller/briefing-controller'
import { ApiResponseGetBriefingDetailResponse } from '@/api/generated/schemas/briefing-controller'
import { useApiQuery } from '@/hooks/api'
import { briefingQueryKeys } from '@/hooks/queries/briefing/briefingQueryKeys'
import { mapBriefingDetail } from '@/mappers/briefingMapper'

export function useBriefingDetailQuery(briefingId: string | null) {
  return useApiQuery({
    queryKey: briefingQueryKeys.detail(briefingId ?? ''),
    operation: getBriefingDetail,
    endpoint: 'getBriefingDetail',
    args: [briefingId!],
    responseSchema: ApiResponseGetBriefingDetailResponse,
    response: 'requiredResult',
    map: (result) => mapBriefingDetail(result),
    enabled: Boolean(briefingId),
    staleTime: 0,
  })
}
