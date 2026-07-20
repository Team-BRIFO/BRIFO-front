export type ConfidenceLevel = 1 | 2 | 3 | 4 | 5

export interface PostDecisionRequest {
  direction: 'UP' | 'DOWN' | 'NEUTRAL'
  confidenceLevel: ConfidenceLevel
}

export interface PostDecisionResponse {
  decisionId: string
  direction: 'UP' | 'DOWN' | 'NEUTRAL'
  confidenceLevel: ConfidenceLevel
  stock: {
    stockId: string
    name: string
  }
}

export interface GetDecisionResponse {
  isCorrect: boolean | null
  apDelta: number | null
  direction: 'UP' | 'DOWN' | 'NEUTRAL'
  confidenceLevel: ConfidenceLevel
  stock: {
    name: string
    price: number | null
    changeRate: number | null
    tradeDate: string | null
  }
}
