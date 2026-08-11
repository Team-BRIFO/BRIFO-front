import type {
  GetDecisionResultResponseOutput,
  GetDecisionsResponseOutput,
} from '@/api/generated/schemas/decision-controller'
import type { ConfidenceLevel, DecisionDetail, DecisionListItem } from '@/types/domain/decision'

function mapConfidenceLevel(value: number): ConfidenceLevel {
  if (value === 2 || value === 3 || value === 4 || value === 5) return value
  return 1
}

export function mapDecisionList(items: GetDecisionsResponseOutput['items']): DecisionListItem[] {
  const now = new Date()
  const kstOffset = 9 * 60 * 60 * 1000
  const kstTime = new Date(now.getTime() + now.getTimezoneOffset() * 60000 + kstOffset)
  const isAfterMarketClose =
    kstTime.getHours() > 15 || (kstTime.getHours() === 15 && kstTime.getMinutes() >= 30)

  return items.map((item) => ({
    id: item.decisionId,
    confidenceLevel: mapConfidenceLevel(item.confidenceLevel),
    isSettled: isAfterMarketClose,
    stock: {
      name: item.stock.name,
      changeRate: item.stock.changeRate,
    },
  }))
}

export function mapDecisionDetail(result: GetDecisionResultResponseOutput): DecisionDetail {
  return {
    isCorrect: result.isCorrect,
    apDelta: result.apDelta,
    stock: {
      name: result.stock.name,
      changeRate: result.stock.changeRate,
    },
  }
}
