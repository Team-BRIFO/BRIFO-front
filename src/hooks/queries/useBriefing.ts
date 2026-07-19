import { useQuery } from '@tanstack/react-query'

import { getBriefingDetail } from '@/api/briefing'
import type { BriefingDetailResponse } from '@/types/api/briefing'

export const BRIEFING_QUERY_KEYS = {
  all: ['briefings'] as const,
  detail: (id: string) => [...BRIEFING_QUERY_KEYS.all, 'detail', id] as const,
}

export function useGetBriefingDetail(briefingId: string | null) {
  return useQuery<BriefingDetailResponse, Error>({
    queryKey: BRIEFING_QUERY_KEYS.detail(briefingId ?? ''),
    queryFn: () => getBriefingDetail(briefingId!),
    enabled: Boolean(briefingId),
  })
}
