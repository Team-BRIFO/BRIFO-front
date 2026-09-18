import { useQueryClient } from '@tanstack/react-query'

import { createDecision } from '@/api/generated/endpoints/decision-controller/decision-controller'
import { ApiResponseCreateDecisionResponse } from '@/api/generated/schemas'
import { useApiMutation } from '@/hooks/api'
import { decisionQueryKeys } from '@/hooks/queries/decision/decisionQueryKeys'
import { diaryQueryKeys } from '@/hooks/queries/diary/diaryQueryKeys'
import { userQueryKeys } from '@/hooks/queries/user/userQueryKeys'
import type { DecisionDirection } from '@/types/domain/decision'

interface PostDecisionInput {
  direction: DecisionDirection
  allocatedAp: number
}

export function usePostDecisionMutation(briefingId: string) {
  const queryClient = useQueryClient()

  return useApiMutation({
    operation: createDecision,
    endpoint: 'createDecision',
    responseSchema: ApiResponseCreateDecisionResponse,
    response: 'requiredResult',
    getArgs: (input: PostDecisionInput) =>
      [briefingId, { direction: input.direction, allocatedAp: input.allocatedAp }] as const,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: decisionQueryKeys.list(),
        }),
        queryClient.invalidateQueries({
          queryKey: diaryQueryKeys.calendars(),
        }),
        queryClient.invalidateQueries({
          queryKey: userQueryKeys.profile(),
        }),
      ])
    },
  })
}
