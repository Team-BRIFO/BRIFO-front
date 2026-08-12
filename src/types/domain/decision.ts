export type ConfidenceLevel = 1 | 2 | 3 | 4 | 5
export type DecisionDirection = 'UP' | 'DOWN' | 'NEUTRAL'

export interface DecisionListItem {
  id: string
  confidenceLevel: ConfidenceLevel
  isSettled: boolean
  stock: {
    name: string
    logoUrl?: string
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
