import type { PolicyReagreementItem } from '@/types/domain/policy'

export const POLICY_REAGREEMENT_MOCK_ITEMS: PolicyReagreementItem[] = [
  {
    policyId: 'mock-service',
    title: '서비스 이용약관',
    isRequired: true,
    version: 1.1,
    previousVersion: 1.0,
  },
  {
    policyId: 'mock-privacy',
    title: '개인정보 처리방침',
    isRequired: true,
    version: 1.1,
    previousVersion: 1.0,
  },
]
