/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQueryClient } from '@tanstack/react-query'

import { createBriefing } from '@/api/generated/endpoints/briefing-controller/briefing-controller'
import { ApiResponseCreateBriefingResponse } from '@/api/generated/schemas'
import { useApiMutation } from '@/hooks/api'
import { briefingQueryKeys } from '@/hooks/queries/briefing/briefingQueryKeys'
import { mapBriefingRequestResult } from '@/mappers/briefingMapper'

export function usePostBriefingRequestMutation() {
  const queryClient = useQueryClient()

  return useApiMutation({
    operation: createBriefing,
    endpoint: 'createBriefing',
    responseSchema: ApiResponseCreateBriefingResponse,
    response: 'requiredResult',
    getArgs: ({ cardId, agentIds }: { cardId: string; agentIds: string[] }) =>
      [cardId, { agentIds }] as const,
    map: (result) => mapBriefingRequestResult(result as any),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: briefingQueryKeys.listByCard(variables.cardId),
        }),
        queryClient.invalidateQueries({ queryKey: briefingQueryKeys.officeList() }),
      ])
    },
  })
}
