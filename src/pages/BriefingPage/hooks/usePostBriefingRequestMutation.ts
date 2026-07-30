/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQueryClient } from '@tanstack/react-query'

import { browserTokenStore } from '@/api/client/tokenStore'
import { createBriefing } from '@/api/generated/endpoints/briefing-controller/briefing-controller'
import { ApiResponseCreateBriefingResponse } from '@/api/generated/schemas'
import { useApiMutation } from '@/hooks/api'
import { briefingQueryKeys } from '@/hooks/queries/briefing/briefingQueryKeys'
import { mapBriefingRequestResult } from '@/mappers/briefingMapper'

const mockCreateBriefing = async (cardId: string, params: { agentIds: string[] }) => {
  const MOCK_DATA: ApiResponseCreateBriefingResponse = {
    success: true,
    code: 'COMMON_200',
    message: 'Success',
    result: {
      requestedCount: params.agentIds.length,
      totalSalaryCost: params.agentIds.length * 100, // mock salary cost
      requestedAgents: params.agentIds.map((agentId) => ({
        agentId,
        briefingId: `mock-briefing-${agentId}`,
        agentType: 'ROOKIE', // mock type
        salaryCost: 100,
      })) as any,
    },
  }

  if (!browserTokenStore.getAccessToken()) {
    return MOCK_DATA
  }

  try {
    return await createBriefing(cardId, params)
  } catch {
    return MOCK_DATA
  }
}

export function usePostBriefingRequestMutation() {
  const queryClient = useQueryClient()

  return useApiMutation({
    operation: mockCreateBriefing as typeof createBriefing,
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
