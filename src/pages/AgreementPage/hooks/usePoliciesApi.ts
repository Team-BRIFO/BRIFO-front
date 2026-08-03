import { signupTokenStore } from '@/api/client/tokenStore'
import {
  agreePolicies,
  getPolicies,
  getPolicyDetail,
} from '@/api/generated/endpoints/policy-controller/policy-controller'
import type { AgreePoliciesRequest } from '@/api/generated/schemas'
import {
  ApiResponse,
  ApiResponseGetPoliciesResponse,
  ApiResponseGetPolicyDetailResponse,
} from '@/api/generated/schemas'
import { useApiMutation, useApiQuery } from '@/hooks/api'

function useSignupTokenRequestConfig() {
  const signupToken = signupTokenStore.get()

  return signupToken ? { headers: { Authorization: `Bearer ${signupToken}` } } : undefined
}

export function usePoliciesQuery() {
  const requestConfig = useSignupTokenRequestConfig()

  return useApiQuery({
    queryKey: ['onboarding', 'policies'],
    operation: getPolicies,
    endpoint: 'getPolicies',
    args: [],
    responseSchema: ApiResponseGetPoliciesResponse,
    response: 'requiredResult',
    enabled: Boolean(requestConfig),
    requestConfig,
  })
}

export function usePolicyDetailQuery(policyId?: string) {
  const requestConfig = useSignupTokenRequestConfig()

  return useApiQuery({
    queryKey: ['onboarding', 'policies', policyId],
    operation: getPolicyDetail,
    endpoint: 'getPolicyDetail',
    args: [policyId ?? ''],
    responseSchema: ApiResponseGetPolicyDetailResponse,
    response: 'requiredResult',
    enabled: Boolean(requestConfig && policyId),
    requestConfig,
  })
}

export function useAgreePoliciesMutation() {
  const requestConfig = useSignupTokenRequestConfig()

  return useApiMutation({
    operation: agreePolicies,
    endpoint: 'agreePolicies',
    responseSchema: ApiResponse,
    getArgs: (request: AgreePoliciesRequest): [AgreePoliciesRequest] => [request],
    requestConfig,
  })
}
