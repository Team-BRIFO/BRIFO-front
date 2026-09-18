import { keepPreviousData } from '@tanstack/react-query'

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
    // 사원 탭 전환 시 다음 데이터가 도착할 때까지 이전 사원 브리핑을 유지해 로딩 화면 깜빡임을 없앤다.
    placeholderData: keepPreviousData,
  })
}
