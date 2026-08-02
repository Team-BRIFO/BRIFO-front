import { mockFetch } from '@/api/client/mockNetwork'
import { MOCK_MY_TERMS_RESPONSE } from '@/pages/MyPage/mockMy'
import type { MyLearnedTermsResult } from '@/types/api/terms'

export const MY_TERMS_PAGE_SIZE = 20

/** TODO: GET /api/users/me/terms 실 API 연동 */
export async function getMyLearnedTerms(
  cursor?: string | null,
  size: number = MY_TERMS_PAGE_SIZE,
): Promise<MyLearnedTermsResult> {
  void cursor
  void size
  return mockFetch('GET /api/users/me/terms', () => MOCK_MY_TERMS_RESPONSE.result)
}
