import { getKstLocalDate } from '@/api/contracts/localDateTime'

/** 브라우저 로컬 시간대 변환 없이 원본 KST 날짜를 화면용으로 표시한다. */
export function formatPolicyEffectiveDate(createdAt: string): string {
  const [year, month, day] = getKstLocalDate(createdAt).split('-')

  return `${year}. ${Number(month)}. ${Number(day)}.`
}

/** 약관 버전 단일 표기 (예: 1 → 1.0, 1.1 → 1.1) */
export function formatPolicyVersion(version: number) {
  if (Number.isInteger(version)) {
    return `${version}.0`
  }

  return version.toFixed(1)
}

/** 약관 개정 버전 표기 (예: v1.0 → v1.1) */
export function formatPolicyVersionTransition(version: number, previousVersion?: number) {
  const current = formatPolicyVersion(version)
  const previous =
    previousVersion != null
      ? formatPolicyVersion(previousVersion)
      : formatPolicyVersion(Math.round((version - 0.1) * 10) / 10)

  return `(v${previous} → v${current})`
}
