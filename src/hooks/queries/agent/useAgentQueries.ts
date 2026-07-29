import { useQuery } from '@tanstack/react-query'

import { agentQueryKeys } from '@/hooks/queries/agent/agentQueryKeys'
import { mapAgentDetail, mapAgentListItem } from '@/mappers/agentMapper'
import { MOCK_AGENT_DETAIL_RESPONSES, MOCK_AGENT_LIST_RESPONSE } from '@/mocks/agent'

export function useAgentListQuery() {
  return useQuery({
    queryKey: agentQueryKeys.list(),
    staleTime: 0,
    queryFn: () => MOCK_AGENT_LIST_RESPONSE.result.items.map(mapAgentListItem),
    initialData: () => MOCK_AGENT_LIST_RESPONSE.result.items.map(mapAgentListItem),
  })
}

export function useAgentDetailQuery(agentId: string | null) {
  return useQuery({
    queryKey: agentQueryKeys.detail(agentId ?? ''),
    staleTime: 0,
    queryFn: () => {
      const response = MOCK_AGENT_DETAIL_RESPONSES[agentId!]
      if (!response) throw new Error('Agent not found')
      return mapAgentDetail(response.result)
    },
    enabled: Boolean(agentId),
    retry: false,
  })
}
