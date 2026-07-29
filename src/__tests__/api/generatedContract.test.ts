import { describe, expect, it } from 'vitest'

import { createAxiosAdapter } from '@/__tests__/api/testAxiosAdapter'
import { getDiaries } from '@/api/generated/endpoints/diary-controller/diary-controller'
import { getStocks } from '@/api/generated/endpoints/stock-controller/stock-controller'
import { ApiErrorResponse, ApiResponseGetAgentsResponse } from '@/api/generated/schemas'

describe('generated OpenAPI contract', () => {
  it('keeps generated paths relative and serializes object query parameters centrally', async () => {
    const configurations: Array<{
      params: unknown
      serialized: string | undefined
      url?: string
    }> = []
    const adapter = createAxiosAdapter((config) => {
      const serializer =
        typeof config.paramsSerializer === 'object' ? config.paramsSerializer.serialize : undefined
      configurations.push({
        params: config.params,
        serialized: serializer?.(config.params),
        url: config.url,
      })
      return { data: {} }
    })

    await getDiaries(
      {
        request: {
          cursor: '2ec50140-8cf3-4c6f-a7ec-8c2fa7b0ce7a',
          size: 20,
        },
      },
      { adapter },
    )
    await getStocks(
      {
        request: {
          keyword: '삼성 전자',
          size: 10,
        },
      },
      { adapter },
    )

    expect(configurations[0]).toMatchObject({
      url: '/api/diaries',
      serialized: 'cursor=2ec50140-8cf3-4c6f-a7ec-8c2fa7b0ce7a&size=20',
    })
    expect(configurations[1]?.url).toBe('/api/stocks')
    expect(new URLSearchParams(configurations[1]?.serialized).get('keyword')).toBe('삼성 전자')
    expect(new URLSearchParams(configurations[1]?.serialized).get('size')).toBe('10')
  })

  it('keeps success result optional and accepts the current error body without result', () => {
    expect(
      ApiResponseGetAgentsResponse.parse({
        success: true,
        code: 'COMMON_200',
        message: '성공',
      }).result,
    ).toBeUndefined()

    expect(
      ApiErrorResponse.parse({
        success: false,
        code: 'COMMON_400',
        message: '잘못된 요청입니다.',
      }),
    ).toEqual({
      success: false,
      code: 'COMMON_400',
      message: '잘못된 요청입니다.',
    })
  })
})
