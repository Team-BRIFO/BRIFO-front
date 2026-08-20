import { describe, expect, it } from 'vitest'

import type { GetNewsCardsResponseOutput } from '@/api/generated/schemas/news-controller'
import { mapNewsCards } from '@/mappers/newsMapper'

type ResponseCard = GetNewsCardsResponseOutput['newsCards'][number]

const stock: GetNewsCardsResponseOutput['stock'] = {
  stockId: 'a3f1b6d2-1c44-4f0e-9c4e-2c1f4a9b7e10',
  name: 'SK하이닉스',
  sector: '반도체',
  logoUrl: 'https://example.com/logo.png',
  price: 200000,
  changeRate: 2.1,
  tradeDate: '2026-08-20',
}

function card(overrides: Partial<ResponseCard> & Pick<ResponseCard, 'cardId'>): ResponseCard {
  return {
    source: 'NAVER',
    headline: '헤드라인',
    importanceBadge: 'MID',
    publishedDate: '2026-08-20T09:00:00Z',
    points: ['본문 포인트'],
    keywords: ['키워드'],
    terms: [],
    ...overrides,
  }
}

function response(newsCards: ResponseCard[]): GetNewsCardsResponseOutput {
  return { stock, newsCards }
}

describe('mapNewsCards', () => {
  it('maps every card the server returned', () => {
    const cards = mapNewsCards(
      response([
        card({ cardId: '00000000-0000-0000-0000-000000000001' }),
        card({ cardId: '00000000-0000-0000-0000-000000000002' }),
        card({ cardId: '00000000-0000-0000-0000-000000000003' }),
        card({ cardId: '00000000-0000-0000-0000-000000000004' }),
        card({ cardId: '00000000-0000-0000-0000-000000000005' }),
      ]),
    )

    expect(cards).toHaveLength(5)
    // 홈 목록으로 메우던 시절의 빈 카드(내용 없는 카드)가 더 이상 섞이지 않는다.
    expect(cards.every((mapped) => mapped.points.length > 0)).toBe(true)
  })

  it('sorts HOT before MID and LOW, keeping server order within a badge', () => {
    const cards = mapNewsCards(
      response([
        card({ cardId: '00000000-0000-0000-0000-000000000001', importanceBadge: 'LOW' }),
        card({ cardId: '00000000-0000-0000-0000-000000000002', importanceBadge: 'MID' }),
        card({ cardId: '00000000-0000-0000-0000-000000000003', importanceBadge: 'HOT' }),
        card({ cardId: '00000000-0000-0000-0000-000000000004', importanceBadge: 'MID' }),
      ]),
    )

    expect(cards.map((mapped) => mapped.cardId)).toEqual([
      '00000000-0000-0000-0000-000000000003',
      '00000000-0000-0000-0000-000000000002',
      '00000000-0000-0000-0000-000000000004',
      '00000000-0000-0000-0000-000000000001',
    ])
  })

  it('carries card content and attaches the stock from the response root', () => {
    const [mapped] = mapNewsCards(
      response([
        card({
          cardId: '00000000-0000-0000-0000-000000000001',
          headline: 'HBM 수요 회복',
          imageUrl: 'https://example.com/news.png',
          points: ['공급 계약 체결', '가격 반등'],
          terms: [
            { termId: '00000000-0000-0000-0000-0000000000aa', surface: '순매수', displayOrder: 0 },
          ],
        }),
      ]),
    )

    expect(mapped?.headline).toBe('HBM 수요 회복')
    expect(mapped?.imageUrl).toBe('https://example.com/news.png')
    expect(mapped?.points).toEqual(['공급 계약 체결', '가격 반등'])
    expect(mapped?.terms).toHaveLength(1)
    expect(mapped?.relatedStocks).toEqual([{ name: 'SK하이닉스', changeRate: 2.1 }])
  })
})
