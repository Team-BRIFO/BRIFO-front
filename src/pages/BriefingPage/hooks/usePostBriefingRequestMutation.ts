import { useMutation, useQueryClient } from '@tanstack/react-query'

import { postBriefingRequest } from '@/api/briefing'
import { briefingQueryKeys } from '@/hooks/queries/briefing/briefingQueryKeys'
import { mapBriefingRequestResult } from '@/mappers/briefingMapper'

export function usePostBriefingRequestMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ cardId, agentIds }: { cardId: string; agentIds: string[] }) =>
      mapBriefingRequestResult((await postBriefingRequest(cardId, { agentIds })).result),
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
