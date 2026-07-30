/* eslint-disable @typescript-eslint/no-explicit-any */
import { browserTokenStore } from '@/api/client/tokenStore'
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
import { MOCK_DECISIONS, MOCK_GET_DECISION_RESPONSES } from '@/pages/DecisionPage/mockDecision'

const mockGetDecisions = async () => {
  const MOCK_DATA: ApiResponseGetDecisionsResponse = {
    success: true,
    code: 'COMMON_200',
    message: 'Success',
    result: MOCK_DECISIONS as any, // Cast to any because the mock matches the old schema
  }

  if (!browserTokenStore.getAccessToken()) {
    return MOCK_DATA
  }

  try {
    return await getDecisions()
  } catch {
    return MOCK_DATA
  }
}

export function useDecisionListQuery() {
  return useApiQuery({
    queryKey: decisionQueryKeys.list(),
    operation: mockGetDecisions as typeof getDecisions,
    endpoint: 'getDecisions',
    args: [],
    responseSchema: ApiResponseGetDecisionsResponse,
    response: 'requiredResult',
    map: (result) => mapDecisionList(result as any),
    staleTime: 0,
  })
}

const mockGetDecisionResult = async (decisionId: string) => {
  const MOCK_DATA: ApiResponseGetDecisionResultResponse = MOCK_GET_DECISION_RESPONSES[
    decisionId
  ] as unknown as ApiResponseGetDecisionResultResponse

  if (!browserTokenStore.getAccessToken()) {
    return MOCK_DATA || MOCK_GET_DECISION_RESPONSES['8d0e6428-c909-4401-9049-72843fb90c3d']
  }

  try {
    return await getDecisionResult(decisionId)
  } catch {
    return MOCK_DATA || MOCK_GET_DECISION_RESPONSES['8d0e6428-c909-4401-9049-72843fb90c3d']
  }
}

export function useDecisionDetailQuery(decisionId: string | null) {
  return useApiQuery({
    queryKey: decisionQueryKeys.detail(decisionId ?? ''),
    operation: mockGetDecisionResult as typeof getDecisionResult,
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
