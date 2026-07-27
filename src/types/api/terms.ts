import type { ApiResponse } from './common'

export interface MyLearnedTermResponse {
  termId: string
  term: string
  definition: string
  category: string
  learnedAt: string
}

export interface MyLearnedTermsResult {
  learnedTermCount: number
  page: {
    items: MyLearnedTermResponse[]
    nextCursor: string | null
    hasNext: boolean
  }
}

export type MyLearnedTermsApiResponse = ApiResponse<MyLearnedTermsResult>
