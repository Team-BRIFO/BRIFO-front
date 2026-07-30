import { z } from 'zod'

import {
  getDecisionResult,
  getDecisions,
} from '@/api/generated/endpoints/decision-controller/decision-controller'
import { useApiQuery } from '@/hooks/api'
import { decisionQueryKeys } from '@/hooks/queries/decision/decisionQueryKeys'
import { mapDecisionDetail, mapDecisionList } from '@/mappers/decisionMapper'

export function useDecisionListQuery() {
  return useApiQuery({
    queryKey: decisionQueryKeys.list(),
    operation: getDecisions,
    endpoint: 'getDecisions',
    args: [],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    responseSchema: z.any() as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    response: 'requiredResult' as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    map: (result: any) => mapDecisionList(result),
    staleTime: 0,
  })
}

export function useDecisionDetailQuery(decisionId: string | null) {
  return useApiQuery({
    queryKey: decisionQueryKeys.detail(decisionId ?? ''),
    operation: getDecisionResult,
    endpoint: 'getDecisionResult',
    args: [decisionId!],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    responseSchema: z.any() as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    response: 'requiredResult' as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    map: (result: any) => mapDecisionDetail(result),
    enabled: Boolean(decisionId),
    retry: false,
    staleTime: 0,
  })
}
