import type { DecisionItemDTO, GetDecisionResult } from '@/types/api/decision'
import type { ConfidenceLevel, DecisionDetail, DecisionListItem } from '@/types/domain/decision'

function mapConfidenceLevel(value: number): ConfidenceLevel {
  if (value === 2 || value === 3 || value === 4 || value === 5) return value
  return 1
}

export function mapDecisionList(items: DecisionItemDTO[]): DecisionListItem[] {
  return items.map((item) => ({
    id: item.decisionId,
    confidenceLevel: mapConfidenceLevel(item.confidenceLevel),
    isSettled: item.isSettled,
    stock: {
      name: item.stock.name,
      changeRate: item.stock.changeRate,
    },
  }))
}

export function mapDecisionDetail(result: GetDecisionResult): DecisionDetail {
  return {
    isCorrect: result.isCorrect,
    apDelta: result.apDelta,
    stock: {
      name: result.stock.name,
      changeRate: result.stock.changeRate,
    },
  }
}
