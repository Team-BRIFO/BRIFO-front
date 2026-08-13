import type { GetUserHomeResponseOutput } from '@/api/generated/schemas/user-controller'
import type { OfficeBriefingItem } from '@/types/domain/briefing'
export type TodayNewsCardItem = GetUserHomeResponseOutput['todayNewsCards']['items'][number]

export interface HomeCardNewsItem {
  id: string
  stockId: string
  stock: {
    name: string
    changeRate: number
    logoUrl?: string
  }
  newsCount: number
  headline: string
  isCompleted: boolean
}

/** 홈 todayNewsCards.items를 stockId 기준으로 묶어 종목당 카드 1개로 표시 */
export function mapTodayNewsCardsByStock(
  items: TodayNewsCardItem[],
  officeBriefings: OfficeBriefingItem[] = [],
): HomeCardNewsItem[] {
  const grouped = new Map<
    string,
    { item: Omit<HomeCardNewsItem, 'newsCount'>; cardIds: Set<string> }
  >()

  const briefingStatusMap = new Map(officeBriefings.map((b) => [b.stockId, b.isCompleted]))

  for (const item of items) {
    const { stockId } = item.stock
    const existing = grouped.get(stockId)

    if (existing) {
      existing.cardIds.add(item.cardId)
      continue
    }

    grouped.set(stockId, {
      cardIds: new Set([item.cardId]),
      item: {
        id: stockId,
        stockId,
        stock: {
          name: item.stock.name,
          changeRate: item.stock.changeRate,
          logoUrl: item.stock.logoUrl,
        },
        headline: item.headline,
        isCompleted: briefingStatusMap.get(stockId) ?? true,
      },
    })
  }

  return [...grouped.values()].map(({ item, cardIds }) => ({
    ...item,
    newsCount: cardIds.size,
  }))
}
