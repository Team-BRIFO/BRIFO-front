import type { GetNewsCardsResponseOutput } from '@/api/generated/schemas/news-controller'
import type { NewsCardData } from '@/types/domain/newsCard'
import { formatRelativeTime } from '@/utils/formatRelativeTime'

export function mapNewsCards(response: GetNewsCardsResponseOutput): NewsCardData[] {
  return response.newsCards.map((card) => ({
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
  }))
}
