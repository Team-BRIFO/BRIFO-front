import type {
  GetDecisionResultResponseOutput,
  GetDecisionsResponseOutput,
} from '@/api/generated/schemas/decision-controller'
import type { DecisionDetail, DecisionListItem } from '@/types/domain/decision'

export function mapDecisionList(items: GetDecisionsResponseOutput['items']): DecisionListItem[] {
  return items.map((item) => ({
    id: item.decisionId,
    allocatedAp: item.allocatedAp,
    isSettled: item.isSettled,
    stock: {
      name: item.stock.name,
      logoUrl: item.stock.logoUrl,
      price: item.stock.price ?? undefined,
      changeRate: item.stock.changeRate ?? 0,
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
