/** AP 도메인 타입 */

export type ApTransactionReason =
  | 'INITIAL_GRANT'
  | 'ATTENDANCE'
  | 'TUTORIAL'
  | 'BADGE'
  | 'DECISION_WIN'
  | 'DECISION_LOSE'
  | 'NEUTRAL_HIT'
  | 'NEUTRAL_MISS'
  | 'SALARY'
  | 'SALARY_REFUND'
  | 'CREDIT_LOAN'

/** AP 요약 (보유 AP · 기간 내 증감) */
export interface ApSummary {
  /** 보유 AP */
  balance: number
  /** 기간 내 획득 AP (양수) */
  earned: number
  /** 기간 내 차감 AP (양수) */
  lost: number
}

/** AP 입출금 한 건 */
export interface ApTransaction {
  id: string
  reason: ApTransactionReason
  /** 표시용 사유 라벨 (예: 결정 적중) */
  label: string
  /** 증감량 — 음수면 차감 */
  amount: number
  /** ISO 8601 문자열 */
  createdAt: string
}

/** 커서 기반 AP 내역 페이지 */
export interface ApTransactionPage {
  summary: ApSummary
  items: ApTransaction[]
  nextCursor: string | null
  hasNext: boolean
}

/** AP 내역 흐름 필터 (피그마: 전체 / 획득 / 사용) */
export type ApPeriod = 'all' | 'earned' | 'spent'
