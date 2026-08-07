import { describe, expect, it } from 'vitest'

import { createAxiosAdapter } from '@/__tests__/api/testAxiosAdapter'
import { getDiaries } from '@/api/generated/endpoints/diary-controller/diary-controller'
import { getStocks } from '@/api/generated/endpoints/stock-controller/stock-controller'
import {
  ApiErrorResponse,
  ApiResponseGetAgentsResponse,
  GetMyPageResponse,
  LogoutBody,
  UpdateOnboardingProfileRequest,
  UpdateUserProfileRequest,
} from '@/api/generated/schemas'

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

  it('matches the current My/Auth OpenAPI constraints', () => {
    const stockId = '51f6a481-3a4f-4f74-b5b7-2f7f6a0d8c31'
    const stocks = Array.from({ length: 3 }, (_, index) => ({
      stockId: `${stockId.slice(0, -1)}${index + 1}`,
      name: `종목 ${index + 1}`,
    }))
    const fourthStockId = `${stockId.slice(0, -1)}4`
    const validProfile = {
      nickname: '브리포',
      companyName: '브리포 투자사',
    }

    expect(LogoutBody.safeParse({}).success).toBe(false)
    expect(LogoutBody.safeParse({ refreshToken: 'refresh-token' }).success).toBe(true)
    expect(UpdateUserProfileRequest.safeParse({ ...validProfile, stockIds: [] }).success).toBe(
      false,
    )
    expect(
      UpdateUserProfileRequest.safeParse({
        ...validProfile,
        stockIds: [...stocks.map((stock) => stock.stockId), fourthStockId],
      }).success,
    ).toBe(false)
    expect(
      UpdateOnboardingProfileRequest.safeParse({ ...validProfile, stockIds: [stockId] }).success,
    ).toBe(true)
    expect(
      GetMyPageResponse.safeParse({
        nickname: '브리포',
        companyName: '브리포 투자사',
        balanceAp: 0,
        thisWeekEarnedAp: 0,
        decisionAccuracyRate: 0,
        totalDecision: 0,
        consecutiveDays: 0,
        learnedTermCount: 0,
        stocks,
      }).success,
    ).toBe(true)
    expect(
      GetMyPageResponse.safeParse({
        nickname: '브리포',
        companyName: '브리포 투자사',
        balanceAp: 0,
        thisWeekEarnedAp: 0,
        decisionAccuracyRate: 0,
        totalDecision: 0,
        consecutiveDays: 0,
        learnedTermCount: 0,
        stocks: [],
      }).success,
    ).toBe(false)
  })
})
