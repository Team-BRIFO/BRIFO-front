import { useMutation } from '@tanstack/react-query'

import { postDecision } from '@/api/decision'
import type { ConfidenceLevel, DecisionDirection } from '@/types/domain/decision'

interface PostDecisionInput {
  direction: DecisionDirection
  confidenceLevel: ConfidenceLevel
}

export function usePostDecisionMutation(briefingId: string) {
  return useMutation({
    mutationFn: async (input: PostDecisionInput) => {
      await postDecision(briefingId, input)
    },
  })
}
