import { POLICY_TITLE_KEYWORDS } from '@/constants/agreement'
import type { AgreementId } from '@/types/domain/agreement'

interface PolicySummary {
  policyId: string
  title: string
  isRequired: boolean
  isAgreed: boolean
}

export function findPolicyByAgreementId(policies: PolicySummary[], agreementId: AgreementId) {
  const keywords = POLICY_TITLE_KEYWORDS[agreementId]
  return policies.find((policy) => keywords.some((keyword) => policy.title.includes(keyword)))
}
