import { getAgentDetail } from '@/api/generated/endpoints/agent-controller/agent-controller'
import { ApiResponseGetAgentDetailResponse } from '@/api/generated/schemas/agent-controller'
import { useApiQuery } from '@/hooks/api'
import { agentQueryKeys } from '@/hooks/queries/agent/agentQueryKeys'
import { mapAgentDetail } from '@/mappers/agentMapper'

export function useAgentDetailQuery(agentId: string | null) {
  return useApiQuery({
    queryKey: agentQueryKeys.detail(agentId ?? ''),
    operation: getAgentDetail,
    endpoint: 'getAgentDetail',
    args: [agentId ?? ''],
    responseSchema: ApiResponseGetAgentDetailResponse,
    response: 'requiredResult',
    map: mapAgentDetail,
    staleTime: 0,
    enabled: Boolean(agentId),
    retry: false,
  })
}
