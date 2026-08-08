import { describe, expect, it } from 'vitest'

import { createAxiosAdapter } from '@/__tests__/api/testAxiosAdapter'
import { ApTransactionsResponseSchema } from '@/api/contracts/ap'
import { getApTransactions } from '@/api/generated/endpoints/ap-controller/ap-controller'
import { executeGeneratedApiOperation } from '@/hooks/api'
import { mapApTransactionPage } from '@/mappers/myMapper'

const cursor = '1bcbac27-b08b-452e-a88a-3b7a41c1fe54'

function apTransactionsResponse(reason: string = 'DECISION_WIN') {
  return {
    success: true,
    code: 'COMMON_200',
    message: '성공',
    result: {
      summary: { balanceAp: 1_250, monthlyEarnedAp: 620, monthlyLostAp: 140 },
      page: {
        items: [
          {
            apTransactionId: cursor,
            reason,
            amount: 80,
            createdAt: '2026-08-03T13:57:42.446611',
          },
        ],
        nextCursor: '7fdfc1be-b994-4f12-9a49-bac9f1b27f10',
        hasNext: true,
      },
    },
  }
}

describe('My AP API integration', () => {
  it('serializes the cursor request, validates the generated response, and maps the page', async () => {
    let serialized: string | undefined
    const adapter = createAxiosAdapter((config) => {
      const serializer =
        typeof config.paramsSerializer === 'object' ? config.paramsSerializer.serialize : undefined
      serialized = serializer?.(config.params)
      return { data: apTransactionsResponse() }
    })

    const page = await executeGeneratedApiOperation({
      operation: getApTransactions,
      endpoint: 'getApTransactions',
      args: [{ request: { cursor, size: 20 } }],
      responseSchema: ApTransactionsResponseSchema,
      response: 'requiredResult',
      requestConfig: { adapter },
      map: mapApTransactionPage,
    })

    expect(serialized).toBe(`cursor=${cursor}&size=20`)
    expect(page).toMatchObject({
      summary: { balance: 1_250, earned: 620, lost: 140 },
      items: [
        {
          reason: 'DECISION_WIN',
          label: '결정 적중',
          amount: 80,
          createdAt: '2026-08-03T13:57:42.446611',
        },
      ],
      nextCursor: '7fdfc1be-b994-4f12-9a49-bac9f1b27f10',
      hasNext: true,
    })
  })

  it('rejects an AP response with an unsupported transaction reason', async () => {
    const adapter = createAxiosAdapter(() => ({ data: apTransactionsResponse('UNKNOWN_REASON') }))

    const promise = executeGeneratedApiOperation({
      operation: getApTransactions,
      endpoint: 'getApTransactions',
      args: [{ request: { cursor, size: 20 } }],
      responseSchema: ApTransactionsResponseSchema,
      response: 'requiredResult',
      requestConfig: { adapter },
      map: mapApTransactionPage,
    })

    await expect(promise).rejects.toMatchObject({
      kind: 'contract',
      code: 'CONTRACT_ERROR',
      endpoint: 'getApTransactions',
    })
  })
})
