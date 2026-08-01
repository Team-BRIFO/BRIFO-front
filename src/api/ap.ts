import { mockFetch } from '@/api/client/mockNetwork'
import { MOCK_AP_TRANSACTIONS_RESPONSE } from '@/pages/MyPage/mockMy'
import type { ApTransactionResult } from '@/types/api/ap'

export const AP_TRANSACTION_PAGE_SIZE = 20

/** TODO: GET /api/ap/transactions 실 API 연동 */
export async function getApTransactions(
  cursor?: string | null,
  size: number = AP_TRANSACTION_PAGE_SIZE,
): Promise<ApTransactionResult> {
  void cursor
  void size
  return mockFetch('GET /api/ap/transactions', () => MOCK_AP_TRANSACTIONS_RESPONSE.result)
}
