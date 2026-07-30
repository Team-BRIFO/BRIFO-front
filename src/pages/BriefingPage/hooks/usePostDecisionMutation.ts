import { useQueryClient } from '@tanstack/react-query'

import { browserTokenStore } from '@/api/client/tokenStore'
import { createDecision } from '@/api/generated/endpoints/decision-controller/decision-controller'
import { ApiResponseCreateDecisionResponse } from '@/api/generated/schemas'
import { useApiMutation } from '@/hooks/api'
import { decisionQueryKeys } from '@/hooks/queries/decision/decisionQueryKeys'
import { diaryQueryKeys } from '@/hooks/queries/diary/diaryQueryKeys'
import { MOCK_POST_DECISION_RESPONSE } from '@/pages/DecisionPage/mockDecision'
import type { ConfidenceLevel, DecisionDirection } from '@/types/domain/decision'

interface PostDecisionInput {
  direction: DecisionDirection
  confidenceLevel: ConfidenceLevel
}

const mockCreateDecision = async (
  briefingId: string,
  params: { direction: DecisionDirection; confidenceLevel: ConfidenceLevel },
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const MOCK_DATA: ApiResponseCreateDecisionResponse = MOCK_POST_DECISION_RESPONSE.default as any

  if (!browserTokenStore.getAccessToken()) {
    return MOCK_DATA
  }

  try {
    return await createDecision(briefingId, params)
  } catch {
    return MOCK_DATA
  }
}

export function usePostDecisionMutation(briefingId: string) {
  const queryClient = useQueryClient()

  return useApiMutation({
    operation: mockCreateDecision as typeof createDecision,
    endpoint: 'createDecision',
    responseSchema: ApiResponseCreateDecisionResponse,
    response: 'requiredResult',
    getArgs: (input: PostDecisionInput) =>
      [briefingId, { direction: input.direction, confidenceLevel: input.confidenceLevel }] as const,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: decisionQueryKeys.list(),
        }),
        queryClient.invalidateQueries({
          queryKey: diaryQueryKeys.calendars(),
        }),
      ])
    },
  })
}
