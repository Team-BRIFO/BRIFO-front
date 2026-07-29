import type { ApiResponse } from '@/types/api/common'

export interface NewsCardTermDTO {
  termId: string
  surface: string
  displayOrder: number
}

export interface NewsCardDTO {
  cardId: string
  source: string
  headline: string
  importanceBadge: string
  publishedDate: string
  points: string[]
  keywords: string[]
  terms: NewsCardTermDTO[]
}

export interface NewsCardStockDTO {
  stockId: string
  name: string
  sector: string
  price: number
  changeRate: number
  tradeDate: string
}

export interface NewsDetailResult {
  stock: NewsCardStockDTO
  newsCards: NewsCardDTO[]
}

export type NewsDetailResponse = ApiResponse<NewsDetailResult>
