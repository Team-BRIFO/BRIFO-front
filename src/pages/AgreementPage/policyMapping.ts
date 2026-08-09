import { getKstLocalDate } from '@/api/contracts/localDateTime'
import type { AgreementId } from '@/pages/AgreementPage/agreement'

interface PolicySummary {
  policyId: string
  title: string
  isRequired: boolean
  isAgreed: boolean
}

const POLICY_TITLE_KEYWORDS: Record<AgreementId, string[]> = {
  age: ['14세', '연령'],
  service: ['서비스', '이용약관'],
  privacy: ['개인정보'],
  investment: ['투자', '유의'],
  marketing: ['광고', '마케팅'],
}

export function findPolicyByAgreementId(policies: PolicySummary[], agreementId: AgreementId) {
  const keywords = POLICY_TITLE_KEYWORDS[agreementId]
  return policies.find((policy) => keywords.some((keyword) => policy.title.includes(keyword)))
}

/** Formats the original KST calendar date without a browser-local Date conversion. */
export function formatPolicyEffectiveDate(createdAt: string): string {
  const [year, month, day] = getKstLocalDate(createdAt).split('-')

  return `${year}. ${Number(month)}. ${Number(day)}.`
}
