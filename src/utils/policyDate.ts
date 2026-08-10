import { getKstLocalDate } from '@/api/contracts/localDateTime'

/** 브라우저 로컬 시간대 변환 없이 원본 KST 날짜를 화면용으로 표시한다. */
export function formatPolicyEffectiveDate(createdAt: string): string {
  const [year, month, day] = getKstLocalDate(createdAt).split('-')

  return `${year}. ${Number(month)}. ${Number(day)}.`
}
