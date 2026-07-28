import { useQuery } from '@tanstack/react-query'

import { decisionQueryKeys } from '@/hooks/queries/decision/decisionQueryKeys'
import { mapDecisionDetail, mapDecisionList } from '@/mappers/decisionMapper'

import { MOCK_DECISIONS, MOCK_GET_DECISION_RESPONSES } from '../mockDecision'

export function useDecisionListQuery() {
  return useQuery({
    queryKey: decisionQueryKeys.list(),
    staleTime: 0,
    queryFn: () => mapDecisionList(MOCK_DECISIONS),
    initialData: () => mapDecisionList(MOCK_DECISIONS),
  })
}

export function useDecisionDetailQuery(decisionId: string | null) {
  return useQuery({
    queryKey: decisionQueryKeys.detail(decisionId ?? ''),
    staleTime: 0,
    queryFn: () => {
      const response = MOCK_GET_DECISION_RESPONSES[decisionId!]
      if (!response) throw new Error('Decision not found')
      return mapDecisionDetail(response.result)
    },
    enabled: Boolean(decisionId),
    retry: false,
  })
}
