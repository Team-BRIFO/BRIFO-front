import type { ApiResponse } from './common'

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

export interface ApSummaryDTO {
  balanceAp: number
  monthlyEarnedAp: number
  monthlyLostAp: number
}

export interface ApTransactionItemDTO {
  apTransactionId: string
  reason: ApTransactionReason
  amount: number
  createdAt: string
}

export interface ApTransactionPageDTO {
  items: ApTransactionItemDTO[]
  nextCursor: string | null
  hasNext: boolean
}

export interface ApTransactionResult {
  summary: ApSummaryDTO
  page: ApTransactionPageDTO
}

export type ApTransactionResponse = ApiResponse<ApTransactionResult>
