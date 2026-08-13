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
  return items.map((item) => {
    const now = new Date()
    const kstOffset = 9 * 60 * 60 * 1000
    const kstTime = new Date(now.getTime() + now.getTimezoneOffset() * 60000 + kstOffset)

    let isSettled: boolean

    // API 응답에 isSettled 필드가 추가되기 전까지 tradeDate 기반으로 정산 여부 판단
    if (item.stock.tradeDate) {
      let year, month, day
      const tradeDateStr = String(item.stock.tradeDate)
      const parts = tradeDateStr.split('-')
      if (parts.length >= 3) {
        year = Number(parts[0])
        month = Number(parts[1])
        day = Number(parts[2])
      }

      if (
        year !== undefined &&
        month !== undefined &&
        day !== undefined &&
        !isNaN(year) &&
        !isNaN(month) &&
        !isNaN(day)
      ) {
        // tradeDate의 15:30 KST
        const settlementTimeKst = new Date(year, month - 1, day, 15, 30, 0)
        isSettled = kstTime >= settlementTimeKst
      } else {
        isSettled =
          kstTime.getHours() > 15 || (kstTime.getHours() === 15 && kstTime.getMinutes() >= 30)
      }
    } else {
      isSettled =
        kstTime.getHours() > 15 || (kstTime.getHours() === 15 && kstTime.getMinutes() >= 30)
    }

    return {
      id: item.decisionId,
      confidenceLevel: mapConfidenceLevel(item.confidenceLevel),
      isSettled,
      stock: {
        name: item.stock.name,
        logoUrl: item.stock.logoUrl,
        changeRate: item.stock.changeRate ?? 0,
      },
    }
  })
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
