import { describe, expect, it } from 'vitest'

import { mapTodayNewsCardsByStock } from '@/mappers/homeMapper'

const STOCK_A = '11111111-1111-1111-1111-111111111111'
const STOCK_B = '22222222-2222-2222-2222-222222222222'

describe('homeMapper', () => {
  it('groups todayNewsCards by stockId and aggregates newsCount', () => {
    const result = mapTodayNewsCardsByStock([
      {
        cardId: 'aaaa0001-0000-0000-0000-000000000001',
        headline: '삼성전자, 1분기 실적 발표',
        news: {
          newsId: 'news-1',
          publishedAt: '2026-08-13T09:00:00',
          source: 'NAVER',
        },
        stock: {
          stockId: STOCK_A,
          name: '삼성전자',
          changeRate: 1.2,
        },
      },
      {
        cardId: 'aaaa0002-0000-0000-0000-000000000002',
        headline: '삼성전자, 신규 투자 발표',
        news: {
          newsId: 'news-2',
          publishedAt: '2026-08-13T10:00:00',
          source: 'NAVER',
        },
        stock: {
          stockId: STOCK_A,
          name: '삼성전자',
          changeRate: 1.2,
        },
      },
      {
        cardId: 'bbbb0001-0000-0000-0000-000000000001',
        headline: 'SK하이닉스, HBM 수주 확대',
        news: {
          newsId: 'news-3',
          publishedAt: '2026-08-13T11:00:00',
          source: 'NAVER',
        },
        stock: {
          stockId: STOCK_B,
          name: 'SK하이닉스',
          changeRate: -0.5,
        },
      },
    ])

    expect(result).toHaveLength(2)
    expect(result[0]).toMatchObject({
      id: STOCK_A,
      stockId: STOCK_A,
      newsCount: 2,
      headline: '삼성전자, 1분기 실적 발표',
      stock: { name: '삼성전자', changeRate: 1.2 },
    })
    expect(result[1]).toMatchObject({
      id: STOCK_B,
      stockId: STOCK_B,
      newsCount: 1,
      headline: 'SK하이닉스, HBM 수주 확대',
    })
  })
})
