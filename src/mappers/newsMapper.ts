import type { GetNewsCardsResponseOutput } from '@/api/generated/schemas/news-controller'
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
