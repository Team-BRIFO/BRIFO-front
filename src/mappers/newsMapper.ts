import type { GetNewsCardsResponse } from '@/api/generated/schemas/news-controller'
import type { NewsCardData } from '@/components/feature/newsCard/NewsCard'

export function mapNewsCards(response: GetNewsCardsResponse): NewsCardData[] {
  return response.newsCards.map((card) => ({
    cardId: card.cardId,
    // TODO: formatting date string appropriately (e.g. "41분전" or similar based on utility). For now, use raw string.
    publishedDate: card.publishedDate,
    headline: card.headline,
    imageUrl:
      'https://images.unsplash.com/photo-1611681283307-eecb46571bc8?q=80&w=600&auto=format&fit=crop', // Provide placeholder image as original schema doesn't have it
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
