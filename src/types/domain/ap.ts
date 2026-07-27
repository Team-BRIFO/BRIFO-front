/**
 * AP 도메인 타입
 * - 서버 DTO는 types/api/ap.ts (ApSummaryDTO · ApTransactionItemDTO)
 * - 화면에서 쓰는 형태로 매핑한 결과를 이 파일의 타입으로 표현한다.
 */

import type { ApTransactionReason } from '@/types/api/ap'

export type { ApTransactionReason }

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
  items: ApTransaction[]
  nextCursor: string | null
  hasNext: boolean
}

/** AP 내역 흐름 필터 (피그마: 전체 / 획득 / 사용) */
export type ApPeriod = 'all' | 'earned' | 'spent'
