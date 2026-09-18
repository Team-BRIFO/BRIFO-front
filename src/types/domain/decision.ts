export type DecisionDirection = 'UP' | 'DOWN' | 'NEUTRAL'

/** 예측 등록 시 보유 자금 중 이 결정에 배분한 금액 (1 이상, 보유 자금의 40% 이하) */
export const MAX_ALLOCATION_RATE_PERCENT = 40

export interface DecisionListItem {
  id: string
  allocatedAp: number
  isSettled: boolean
  isCorrect?: boolean | null
  apDelta?: number | null
  stock: {
    name: string
    logoUrl?: string
    price?: number
    changeRate: number
  }
}

export interface DecisionDetail {
  isCorrect: boolean | null
  apDelta: number | null
  stock: {
    name: string
    changeRate: number | null
  }
}
