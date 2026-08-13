import { AGREEMENTS, POLICY_TITLE_TOKEN_GROUPS } from '@/constants/agreement'
import type { AgreementId } from '@/types/domain/agreement'
import type { PolicyReagreementItem } from '@/types/domain/policy'

interface PolicySummary {
  policyId: string
  title: string
  isRequired: boolean
  isAgreed: boolean
}

interface PendingPolicyItem {
  policyId: string
  title: string
  isRequired: boolean
  version: number
}

function normalizeTitle(title: string) {
  return title.replaceAll(/\s/g, '')
}

function matchesAgreementTitle(policy: PolicySummary, agreementId: AgreementId) {
  const agreement = AGREEMENTS.find(({ id }) => id === agreementId)
  if (!agreement || policy.isRequired !== (agreement.type === 'required')) return false

  const normalizedTitle = normalizeTitle(policy.title)
  return POLICY_TITLE_TOKEN_GROUPS[agreementId].every((tokenGroup) =>
    tokenGroup.some((token) => normalizedTitle.includes(normalizeTitle(token))),
  )
}

/**
 * API 응답에 agreementId가 없으므로 제목이 정확히 한 종류의 약관에만 매핑될 때만 반환한다.
 * 후보가 중복되거나 여러 종류에 일치하면 undefined로 처리해 응답 순서에 따른 오매핑을 막는다.
 */
export function findPolicyByAgreementId(policies: PolicySummary[], agreementId: AgreementId) {
  const candidates = policies.filter((policy) => {
    const matchedAgreementIds = AGREEMENTS.filter(({ id }) =>
      matchesAgreementTitle(policy, id),
    ).map(({ id }) => id)

    return matchedAgreementIds.length === 1 && matchedAgreementIds[0] === agreementId
  })

  return candidates.length === 1 ? candidates[0] : undefined
}

export function mapPendingPolicyItems(items: PendingPolicyItem[]): PolicyReagreementItem[] {
  return items.map((item) => ({
    policyId: item.policyId,
    title: item.title,
    isRequired: item.isRequired,
    version: item.version,
  }))
}
