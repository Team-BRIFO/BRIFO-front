/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  getDecisionResult,
  getDecisions,
} from '@/api/generated/endpoints/decision-controller/decision-controller'
import {
  ApiResponseGetDecisionResultResponse,
  ApiResponseGetDecisionsResponse,
} from '@/api/generated/schemas'
import { useApiQuery } from '@/hooks/api'
import { decisionQueryKeys } from '@/hooks/queries/decision/decisionQueryKeys'
import { mapDecisionDetail, mapDecisionList } from '@/mappers/decisionMapper'

export function useDecisionListQuery() {
  return useApiQuery({
    queryKey: decisionQueryKeys.list(),
    operation: getDecisions,
    endpoint: 'getDecisions',
    args: [],
    responseSchema: ApiResponseGetDecisionsResponse,
    response: 'requiredResult',
    map: (result) => mapDecisionList(result as any),
    staleTime: 0,
  })
}

export function useDecisionDetailQuery(decisionId: string | null) {
  return useApiQuery({
    queryKey: decisionQueryKeys.detail(decisionId ?? ''),
    operation: getDecisionResult,
    endpoint: 'getDecisionResult',
    args: [decisionId!],
    responseSchema: ApiResponseGetDecisionResultResponse,
    response: 'requiredResult',
    map: (result) => mapDecisionDetail(result as any),
    enabled: Boolean(decisionId),
    retry: false,
    staleTime: 0,
  })
}
