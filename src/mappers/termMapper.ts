import type { GetTermResponseOutput } from '@/api/generated/schemas/term-controller'
import type { TermDetail } from '@/types/domain/glossary'

export function mapTermDetail(response: GetTermResponseOutput): TermDetail {
  return {
    termId: response.termId,
    term: response.term,
    definition: response.definition,
    category: response.category,
    isLearned: response.isLearned,
  }
}
