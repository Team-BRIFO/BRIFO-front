import type { ApiResponse } from './common'

export type ConfidenceLevel = 1 | 2 | 3 | 4 | 5

export interface PostDecisionRequest {
  direction: 'UP' | 'DOWN' | 'NEUTRAL'
  confidenceLevel: ConfidenceLevel
}

export interface DecisionStockDTO {
  stockId: string
  name: string
}

export interface PostDecisionResult {
  decisionId: string
  direction: 'UP' | 'DOWN' | 'NEUTRAL'
  confidenceLevel: ConfidenceLevel
  stock: DecisionStockDTO
}

export type PostDecisionResponse = ApiResponse<PostDecisionResult>

export interface DecisionStockDetailDTO {
  name: string
  price: number | null
  changeRate: number | null
  tradeDate: string | null
}

export interface GetDecisionResult {
  isCorrect: boolean | null
  apDelta: number | null
  direction: 'UP' | 'DOWN' | 'NEUTRAL'
  confidenceLevel: ConfidenceLevel
  stock: DecisionStockDetailDTO
}

export type GetDecisionResponse = ApiResponse<GetDecisionResult>
