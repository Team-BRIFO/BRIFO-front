import { signupSession } from '@/api/client/signupSession'
import { PolicyDetailResponseSchema } from '@/api/contracts/policy'
import {
  agreePolicies,
  getPolicies,
  getPolicyDetail,
} from '@/api/generated/endpoints/policy-controller/policy-controller'
import type { AgreePoliciesRequest } from '@/api/generated/schemas'
import { ApiResponse, ApiResponseGetPoliciesResponse } from '@/api/generated/schemas'
import { useApiMutation, useApiQuery } from '@/hooks/api'

export function usePoliciesQuery() {
  return useApiQuery({
    queryKey: ['onboarding', 'policies'],
    operation: getPolicies,
    endpoint: 'getPolicies',
    args: [],
    responseSchema: ApiResponseGetPoliciesResponse,
    response: 'requiredResult',
    enabled: signupSession.isActive(),
  })
}

export function usePolicyDetailQuery(policyId?: string) {
  return useApiQuery({
    queryKey: ['onboarding', 'policies', policyId],
    operation: getPolicyDetail,
    endpoint: 'getPolicyDetail',
    args: [policyId ?? ''],
    responseSchema: PolicyDetailResponseSchema,
    response: 'requiredResult',
    enabled: signupSession.isActive() && Boolean(policyId),
  })
}

export function useAgreePoliciesMutation() {
  return useApiMutation({
    operation: agreePolicies,
    endpoint: 'agreePolicies',
    responseSchema: ApiResponse,
    getArgs: (request: AgreePoliciesRequest): [AgreePoliciesRequest] => [request],
  })
}
