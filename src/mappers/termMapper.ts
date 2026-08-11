import type { GetTermResponseOutput } from '@/api/generated/schemas/term-controller'
import type { TermDetailResponse } from '@/api/terms'

export function mapTermDetail(response: GetTermResponseOutput): TermDetailResponse {
  return {
    termId: response.termId,
    term: response.term,
    definition: response.definition,
    category: response.category,
    isLearned: response.isLearned,
  }
}
