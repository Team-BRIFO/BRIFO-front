import type { GetNewsCardsResponseOutput } from '@/api/generated/schemas/news-controller'
import type { TodayNewsCardItem } from '@/mappers/homeMapper'
import type { NewsCardData } from '@/types/domain/newsCard'
import { formatRelativeTime } from '@/utils/formatRelativeTime'

const IMPORTANCE_SORT_ORDER: Record<string, number> = {
  HOT: 0,
  MID: 1,
  LOW: 2,
}

function getImportanceSortOrder(badge?: string): number {
  if (!badge) return 3
  return IMPORTANCE_SORT_ORDER[badge.toUpperCase()] ?? 3
}

function sortNewsCardsByImportance(cards: NewsCardData[]): NewsCardData[] {
  return cards
    .map((card, index) => ({ card, index }))
    .sort((a, b) => {
      const orderDiff =
        getImportanceSortOrder(a.card.importanceBadge) -
        getImportanceSortOrder(b.card.importanceBadge)
      return orderDiff !== 0 ? orderDiff : a.index - b.index
    })
    .map(({ card }) => card)
}

export function mapHomeNewsCardItem(item: TodayNewsCardItem): NewsCardData {
  return {
    cardId: item.cardId,
    publishedDate: formatRelativeTime(item.news.publishedAt),
    headline: item.headline,
    points: [],
    terms: [],
    source: item.news.source,
    relatedStocks: [
      {
        name: item.stock.name,
        changeRate: item.stock.changeRate,
      },
    ],
  }
}

/** 홈 목록(cardId) 순서를 유지하면서 상세 API 데이터와 병합 */
export function mergeStockNewsCards(
  homeItems: TodayNewsCardItem[],
  detailCards: NewsCardData[],
): NewsCardData[] {
  const detailByCardId = new Map(detailCards.map((card) => [card.cardId, card]))
  const seen = new Set<string>()
  const merged: NewsCardData[] = []

  for (const item of homeItems) {
    if (seen.has(item.cardId)) continue
    seen.add(item.cardId)
    merged.push(detailByCardId.get(item.cardId) ?? mapHomeNewsCardItem(item))
  }

  for (const card of detailCards) {
    if (seen.has(card.cardId)) continue
    merged.push(card)
  }

  return sortNewsCardsByImportance(merged)
}

export function mapNewsCards(response: GetNewsCardsResponseOutput): NewsCardData[] {
  return sortNewsCardsByImportance(
    response.newsCards.map((card) => ({
      cardId: card.cardId,
      publishedDate: formatRelativeTime(card.publishedDate),
      headline: card.headline,
      imageUrl: card.imageUrl,
      importanceBadge: card.importanceBadge,
      source: card.source,
      points: card.points,
      terms: card.terms,
      relatedStocks: [
        {
          name: response.stock.name,
          changeRate: response.stock.changeRate,
        },
      ],
    })),
  )
}
