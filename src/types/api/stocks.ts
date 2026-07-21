import type { ApiResponse } from './common'

export interface StockSearchItemDTO {
  rank?: number
  stockId: string
  code: string
  name: string
  price: number | null
  changeRate: number | null
}

export interface StockSearchPageDTO {
  items: StockSearchItemDTO[]
  nextCursor: string | null
  hasNext: boolean
}

export interface StockSearchResult {
  mode: 'POPULAR' | 'SEARCH'
  keyword?: string
  page: StockSearchPageDTO
}

export type StockSearchResponse = ApiResponse<StockSearchResult>
