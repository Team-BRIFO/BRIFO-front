import { getAgents } from '@/api/generated/endpoints/agent-controller/agent-controller'
import { ApiResponseGetAgentsResponse } from '@/api/generated/schemas/agent-controller'
import { useApiQuery } from '@/hooks/api'
import { agentQueryKeys } from '@/hooks/queries/agent/agentQueryKeys'
import { mapAgentListItem } from '@/mappers/agentMapper'

export function useAgentListQuery() {
  return useApiQuery({
    queryKey: agentQueryKeys.list(),
    operation: getAgents,
    endpoint: 'getAgents',
    args: [],
    responseSchema: ApiResponseGetAgentsResponse,
    response: 'requiredResult',
    map: (result) => result.items.map(mapAgentListItem),
    staleTime: 0,
  })
}
