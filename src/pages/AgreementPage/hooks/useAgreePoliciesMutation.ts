import { agreePolicies } from '@/api/generated/endpoints/policy-controller/policy-controller'
import type { AgreePoliciesRequest } from '@/api/generated/schemas'
import { ApiResponse } from '@/api/generated/schemas'
import { useApiMutation } from '@/hooks/api'

export function useAgreePoliciesMutation() {
  return useApiMutation({
    operation: agreePolicies,
    endpoint: 'agreePolicies',
    responseSchema: ApiResponse,
    getArgs: (request: AgreePoliciesRequest): [AgreePoliciesRequest] => [request],
  })
}
