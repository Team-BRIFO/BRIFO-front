import { useQueryClient } from '@tanstack/react-query'

import { agreePolicies } from '@/api/generated/endpoints/policy-controller/policy-controller'
import type { AgreePoliciesRequest } from '@/api/generated/schemas'
import { ApiResponse } from '@/api/generated/schemas'
import { useApiMutation } from '@/hooks/api'
import { policyQueryKeys } from '@/hooks/queries/policy/policyQueryKeys'

export function useAgreePoliciesMutation() {
  const queryClient = useQueryClient()

  return useApiMutation({
    operation: agreePolicies,
    endpoint: 'agreePolicies',
    responseSchema: ApiResponse,
    getArgs: (request: AgreePoliciesRequest): [AgreePoliciesRequest] => [request],
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: policyQueryKeys.pending() })
    },
  })
}
