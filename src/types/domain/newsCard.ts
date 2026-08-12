import type { GlossaryTerm } from '@/types/domain/glossary'

export interface NewsCardData {
  cardId: string
  publishedDate: string
  headline: string
  imageUrl?: string
  importanceBadge?: string
  source?: string
  points: string[]
  terms?: GlossaryTerm[]
  relatedStocks?: Array<{
    name: string
    changeRate?: number
  }>
}
