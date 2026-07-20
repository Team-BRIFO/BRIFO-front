import { useMutation, useQuery } from '@tanstack/react-query'

import { getDecision, postDecision } from '@/api/decision'
import type { PostDecisionRequest, PostDecisionResponse } from '@/types/api/decision'

/**
 * 특정 브리핑에 대해 예측을 등록(결정)하는 Mutation Hook
 */
export const usePostDecision = (briefingId: string) => {
  return useMutation<PostDecisionResponse, Error, PostDecisionRequest>({
    mutationFn: (req) => postDecision(briefingId, req),
  })
}

/**
 * 특정 예측(결정) 상세 및 정산 결과를 조회하는 Query Hook
 */
export const useGetDecision = (decisionId: string | null) => {
  return useQuery({
    queryKey: ['decision', decisionId],
    queryFn: () => getDecision(decisionId!),
    enabled: !!decisionId,
  })
}
