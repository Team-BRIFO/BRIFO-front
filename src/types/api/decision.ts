export interface PostDecisionRequest {
  direction: 'UP' | 'DOWN' | 'NEUTRAL'
  confidenceLevel: number
}

export interface PostDecisionResponse {
  decisionId: string
  direction: 'UP' | 'DOWN' | 'NEUTRAL'
  confidenceLevel: number
  stock: {
    stockId: string
    name: string
  }
}

export interface GetDecisionResponse {
  isCorrect: boolean | null
  apDelta: number | null
  direction: 'UP' | 'DOWN' | 'NEUTRAL'
  confidenceLevel: number
  stock: {
    name: string
    price: number | null
    changeRate: number | null
    tradeDate: string | null
  }
}
