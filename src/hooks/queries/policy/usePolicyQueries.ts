import { signupSession } from '@/api/client/signupSession'
import { PolicyDetailResponseSchema } from '@/api/contracts/policy'
import {
  getPendingPolicies,
  getPolicies,
  getPolicyDetail,
} from '@/api/generated/endpoints/policy-controller/policy-controller'
import {
  ApiResponseGetPendingPoliciesResponse,
  ApiResponseGetPoliciesResponse,
} from '@/api/generated/schemas'
import { useApiQuery } from '@/hooks/api'
import { policyQueryKeys } from '@/hooks/queries/policy/policyQueryKeys'
import { mapPendingPolicyItems } from '@/mappers/policyMapper'

/** 가입 약관과 설정의 읽기 전용 약관 목록에서 함께 사용한다. */
export function usePoliciesQuery(enabled: boolean = signupSession.isActive()) {
  return useApiQuery({
    queryKey: policyQueryKeys.list(),
    operation: getPolicies,
    endpoint: 'getPolicies',
    args: [],
    responseSchema: ApiResponseGetPoliciesResponse,
    response: 'requiredResult',
    enabled,
  })
}

export function usePendingPoliciesQuery(enabled = true) {
  return useApiQuery({
    queryKey: policyQueryKeys.pending(),
    operation: getPendingPolicies,
    endpoint: 'getPendingPolicies',
    args: [],
    responseSchema: ApiResponseGetPendingPoliciesResponse,
    response: 'requiredResult',
    map: (result) => mapPendingPolicyItems(result.items),
    enabled,
  })
}

/** policyId 기반 정책 상세 조회. 설정의 딥링크도 같은 query를 재사용한다. */
export function usePolicyDetailQuery(
  policyId?: string,
  enabled: boolean = signupSession.isActive(),
) {
  return useApiQuery({
    queryKey: policyQueryKeys.detail(policyId ?? ''),
    operation: getPolicyDetail,
    endpoint: 'getPolicyDetail',
    args: [policyId ?? ''],
    responseSchema: PolicyDetailResponseSchema,
    response: 'requiredResult',
    enabled: enabled && Boolean(policyId),
  })
}
