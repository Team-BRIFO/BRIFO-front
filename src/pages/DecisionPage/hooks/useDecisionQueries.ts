import { useQuery } from '@tanstack/react-query'

import { mapDecisionDetail, mapDecisionList } from '@/mappers/decisionMapper'

import { MOCK_DECISIONS, MOCK_GET_DECISION_RESPONSES } from '../mockDecision'
import { decisionQueryKeys } from './decisionQueryKeys'

export function useDecisionListQuery() {
  return useQuery({
    queryKey: decisionQueryKeys.list(),
    queryFn: () => mapDecisionList(MOCK_DECISIONS),
    initialData: () => mapDecisionList(MOCK_DECISIONS),
  })
}

export function useDecisionDetailQuery(decisionId: string | null) {
  return useQuery({
    queryKey: decisionQueryKeys.detail(decisionId ?? ''),
    queryFn: () => {
      const response = MOCK_GET_DECISION_RESPONSES[decisionId!]
      if (!response) throw new Error('Decision not found')
      return mapDecisionDetail(response.result)
    },
    enabled: Boolean(decisionId),
    retry: false,
  })
}
