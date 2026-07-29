import { useMutation, useQueryClient } from '@tanstack/react-query'

import { postDecision } from '@/api/decision'
import { decisionQueryKeys } from '@/hooks/queries/decision/decisionQueryKeys'
import { diaryQueryKeys } from '@/hooks/queries/diary/diaryQueryKeys'
import type { ConfidenceLevel, DecisionDirection } from '@/types/domain/decision'

interface PostDecisionInput {
  direction: DecisionDirection
  confidenceLevel: ConfidenceLevel
}

export function usePostDecisionMutation(briefingId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: PostDecisionInput) => {
      await postDecision(briefingId, input)
    },
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
