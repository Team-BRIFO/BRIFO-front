import type { GetUserHomeResponseOutput } from '@/api/generated/schemas/user-controller'

type TodayNewsCardItem = GetUserHomeResponseOutput['todayNewsCards']['items'][number]

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
export function mapTodayNewsCardsByStock(items: TodayNewsCardItem[]): HomeCardNewsItem[] {
  const grouped = new Map<string, HomeCardNewsItem>()

  for (const item of items) {
    const { stockId } = item.stock
    const existing = grouped.get(stockId)

    if (existing) {
      existing.newsCount += 1
      continue
    }

    grouped.set(stockId, {
      id: stockId,
      stockId,
      stock: {
        name: item.stock.name,
        changeRate: item.stock.changeRate,
        logoUrl: item.stock.logoUrl,
      },
      newsCount: 1,
      headline: item.headline,
      isCompleted: false,
    })
  }

  return [...grouped.values()]
}
