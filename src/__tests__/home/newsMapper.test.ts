import { describe, expect, it } from 'vitest'

import { mergeStockNewsCards } from '@/mappers/newsMapper'
import type { NewsCardData } from '@/types/domain/newsCard'

const STOCK_A = '11111111-1111-1111-1111-111111111111'

const detailCards: NewsCardData[] = [
  {
    cardId: 'card-1',
    publishedDate: '1시간 전',
    headline: '상세 카드 1',
    points: ['요약 1'],
    terms: [],
    relatedStocks: [{ name: '삼성전자', changeRate: 1.2 }],
  },
  {
    cardId: 'card-2',
    publishedDate: '2시간 전',
    headline: '상세 카드 2',
    points: ['요약 2'],
    terms: [],
    relatedStocks: [{ name: '삼성전자', changeRate: 1.2 }],
  },
]

describe('mergeStockNewsCards', () => {
  it('keeps home card order and fills missing cards from home items', () => {
    const result = mergeStockNewsCards(
      [
        {
          cardId: 'card-1',
          headline: '홈 카드 1',
          news: { newsId: 'n1', publishedAt: '2026-08-13T09:00:00', source: 'NAVER' },
          stock: { stockId: STOCK_A, name: '삼성전자', changeRate: 1.2 },
        },
        {
          cardId: 'card-3',
          headline: '홈 카드 3',
          news: { newsId: 'n3', publishedAt: '2026-08-13T11:00:00', source: 'NAVER' },
          stock: { stockId: STOCK_A, name: '삼성전자', changeRate: 1.2 },
        },
        {
          cardId: 'card-2',
          headline: '홈 카드 2',
          news: { newsId: 'n2', publishedAt: '2026-08-13T10:00:00', source: 'NAVER' },
          stock: { stockId: STOCK_A, name: '삼성전자', changeRate: 1.2 },
        },
      ],
      detailCards,
    )

    expect(result).toHaveLength(3)
    expect(result.map((card) => card.cardId)).toEqual(['card-1', 'card-3', 'card-2'])
    expect(result[0]?.headline).toBe('상세 카드 1')
    expect(result[0]?.points).toEqual(['요약 1'])
    expect(result[1]?.headline).toBe('홈 카드 3')
    expect(result[1]?.points).toEqual([])
    expect(result[2]?.headline).toBe('상세 카드 2')
  })

  it('sorts HOT badge cards before MID, LOW, and cards without badge', () => {
    const result = mergeStockNewsCards(
      [
        {
          cardId: 'card-low',
          headline: 'LOW 카드',
          news: { newsId: 'n1', publishedAt: '2026-08-13T09:00:00', source: 'NAVER' },
          stock: { stockId: STOCK_A, name: '삼성전자', changeRate: 1.2 },
        },
        {
          cardId: 'card-hot',
          headline: 'HOT 카드',
          news: { newsId: 'n2', publishedAt: '2026-08-13T10:00:00', source: 'NAVER' },
          stock: { stockId: STOCK_A, name: '삼성전자', changeRate: 1.2 },
        },
        {
          cardId: 'card-mid',
          headline: 'MID 카드',
          news: { newsId: 'n3', publishedAt: '2026-08-13T11:00:00', source: 'NAVER' },
          stock: { stockId: STOCK_A, name: '삼성전자', changeRate: 1.2 },
        },
      ],
      [
        {
          cardId: 'card-low',
          publishedDate: '3시간 전',
          headline: 'LOW 카드',
          importanceBadge: 'LOW',
          points: [],
          terms: [],
        },
        {
          cardId: 'card-hot',
          publishedDate: '1시간 전',
          headline: 'HOT 카드',
          importanceBadge: 'HOT',
          points: [],
          terms: [],
        },
        {
          cardId: 'card-mid',
          publishedDate: '2시간 전',
          headline: 'MID 카드',
          importanceBadge: 'MID',
          points: [],
          terms: [],
        },
        {
          cardId: 'card-none',
          publishedDate: '4시간 전',
          headline: '뱃지 없음',
          points: [],
          terms: [],
        },
      ],
    )

    expect(result.map((card) => card.cardId)).toEqual([
      'card-hot',
      'card-mid',
      'card-low',
      'card-none',
    ])
  })

  it('deduplicates home items by cardId', () => {
    const homeItem = {
      cardId: 'card-1',
      headline: '홈 카드 1',
      news: { newsId: 'n1', publishedAt: '2026-08-13T09:00:00', source: 'NAVER' as const },
      stock: { stockId: STOCK_A, name: '삼성전자', changeRate: 1.2 },
    }

    const result = mergeStockNewsCards([homeItem, homeItem, homeItem], [detailCards[0]!])

    expect(result).toHaveLength(1)
    expect(result[0]?.cardId).toBe('card-1')
  })
})
