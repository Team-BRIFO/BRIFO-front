import type { ApTransactionResponse } from '@/types/api/ap'

interface GetApTransactionsParams {
  cursor?: string
  size?: number
}

/**
 * AP 거래 내역 조회 API
 * @param params 커서(cursor)와 조회 개수(size, 기본값 20)
 */
export const getApTransactions = async (
  params?: GetApTransactionsParams,
): Promise<ApTransactionResponse> => {
  // TODO: 공통 apiClient(src/api/axios.ts) 연동
  return {
    success: true,
    code: 'COMMON_200',
    message: '요청에 성공했습니다.',
    result: {
      summary: {
        balanceAp: 1280,
        monthlyEarnedAp: 620,
        monthlyLostAp: 140,
      },
      page: {
        items: [
          {
            apTransactionId: '1bcbac27-b08b-452e-a88a-3b7a41c1fe54',
            reason: 'DECISION_WIN',
            amount: 80,
            createdAt: '2026-07-03T15:30:00',
          },
          {
            apTransactionId: '7fdfc1be-b994-4f12-9a49-bac9f1b27f10',
            reason: 'DECISION_LOSE',
            amount: -40,
            createdAt: '2026-07-02T15:30:00',
          },
        ],
        nextCursor: '7fdfc1be-b994-4f12-9a49-bac9f1b27f10',
        hasNext: true,
      },
    },
  }
}
