import { describe, expect, it } from 'vitest'

import { findPolicyByAgreementId } from '@/mappers/policyMapper'

const policies = [
  { policyId: 'age', title: '만 14세 이상입니다.', isRequired: true, isAgreed: false },
  { policyId: 'service', title: '서비스 이용약관', isRequired: true, isAgreed: false },
  { policyId: 'privacy', title: '개인정보 처리방침', isRequired: true, isAgreed: false },
  { policyId: 'investment', title: '투자 정보 유의사항', isRequired: true, isAgreed: false },
  {
    policyId: 'marketing',
    title: '광고성 정보 수신 및 서비스 안내',
    isRequired: false,
    isAgreed: false,
  },
]

describe('findPolicyByAgreementId', () => {
  it('maps each policy uniquely regardless of the API response order', () => {
    expect(findPolicyByAgreementId(policies, 'service')?.policyId).toBe('service')
    expect(findPolicyByAgreementId([...policies].reverse(), 'service')?.policyId).toBe('service')
    expect(findPolicyByAgreementId(policies, 'marketing')?.policyId).toBe('marketing')
  })

  it('does not select an arbitrary policy when multiple policies match one agreement', () => {
    const duplicatedServicePolicies = [
      ...policies,
      {
        policyId: 'service-v2',
        title: '서비스 이용약관 v2',
        isRequired: true,
        isAgreed: false,
      },
    ]

    expect(findPolicyByAgreementId(duplicatedServicePolicies, 'service')).toBeUndefined()
  })
})
