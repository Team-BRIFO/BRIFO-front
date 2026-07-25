import type { ApTransactionReason } from '@/types/domain/ap'

/**
 * AP 거래 사유 코드 → 화면 표시 라벨
 * TODO: 문구는 기획 확정 전 임시. 서버가 표시용 문구를 내려주면 이 맵을 제거한다.
 */
export const AP_TRANSACTION_LABEL: Record<ApTransactionReason, string> = {
  INITIAL_GRANT: '가입 축하 지급',
  ATTENDANCE: '출석 보상',
  TUTORIAL: '튜토리얼 완료',
  BADGE: '배지 획득',
  DECISION_WIN: '결정 적중',
  DECISION_LOSE: '결정 실패',
  NEUTRAL_HIT: '중립 예측 적중',
  NEUTRAL_MISS: '중립 예측 실패',
  SALARY: '사원 급여',
  SALARY_REFUND: '급여 환급',
  CREDIT_LOAN: 'AP 대출',
}

/** 증감 부호를 붙인 AP 문자열 (예: +80 AP / -40 AP) */
export function formatSignedAp(amount: number) {
  const sign = amount > 0 ? '+' : amount < 0 ? '-' : ''
  return `${sign}${Math.abs(amount).toLocaleString()} AP`
}

/** 증감 부호별 텍스트 색상 클래스 (획득 Pink / 차감 Green — 국내 증시 관례) */
export function getApAmountColorClass(amount: number) {
  if (amount > 0) return 'text-Pink-30'
  if (amount < 0) return 'text-Green-30'
  return 'text-Gray-6'
}

/** ISO 8601 → 2026.07.03 형식 */
export function formatApTransactionDate(isoDate: string) {
  // API는 Asia/Seoul 기준의 offset 없는 LocalDateTime을 준다. Date로 파싱하면 브라우저
  // 시간대에 따라 날짜가 달라질 수 있으므로 날짜 문자열을 그대로 포맷한다.
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(isoDate)
  return match ? `${match[1]}.${match[2]}.${match[3]}` : isoDate
}

/** ISO 8601 → 피그마 AP 행용 { date: '5/28', time: '15:30' } */
export function formatApTransactionDateTime(isoDate: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/.exec(isoDate)
  if (!match) return { date: formatApTransactionDate(isoDate), time: '' }

  const month = Number(match[2])
  const day = Number(match[3])
  return {
    date: `${month}/${day}`,
    time: `${match[4]}:${match[5]}`,
  }
}
