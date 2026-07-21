import type { NewsDetailResponse } from '@/types/api/news'

/**
 * 카드뉴스 상세 조회 API
 * @param cardId 조회할 카드뉴스 공개 ID (UUID)
 */
export const getNewsCardDetail = async (cardId: string): Promise<NewsDetailResponse> => {
  // TODO: 공통 apiClient(src/api/axios.ts) 연동
  return {
    success: true,
    code: 'COMMON_200',
    message: '요청에 성공했습니다.',
    result: {
      stock: {
        stockId: '0d6d4f4a-7d5d-4e4d-bf71-4b59d18c1a01',
        name: '삼성전자',
        sector: '반도체',
        price: 79200,
        changeRate: 2.1,
        tradeDate: '2026-07-03',
      },
      newsCards: [
        {
          cardId: cardId || '7bcd9b8a-2ed7-43a5-b4b4-1829aa4b5fd1',
          source: 'NAVER',
          headline: '삼성전자, 반도체 실적 개선 기대',
          importanceBadge: 'HOT',
          publishedDate: '2026-07-04',
          points: [
            '2분기 메모리 수요 회복 기대가 커졌습니다.',
            'AI 서버향 고부가 제품 비중이 확대되고 있습니다.',
            '단기 주가에는 실적 가이던스가 주요 변수입니다.',
          ],
          keywords: ['HBM3E', '공급계약', '외국인 순매수'],
          terms: [
            {
              termId: '9c7e2c35-92a2-4d90-93bc-1c3ddadf0461',
              surface: '목표주가',
              displayOrder: 0,
            },
            {
              termId: '6c558a17-b726-4cc1-b13e-f1ff46131a6a',
              surface: '순매수',
              displayOrder: 1,
            },
          ],
        },
      ],
    },
  }
}
