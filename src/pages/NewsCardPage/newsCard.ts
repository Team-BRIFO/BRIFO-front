import type { NewsCardData } from '@/components/feature/newsCard/NewsCard'

export const MOCK_NEWS_CARDS: NewsCardData[] = [
  {
    cardId: '1',
    publishedDate: '41분전',
    headline: '삼성전자, HBM3E 12단 양산 본격화... 엔비디아 공급 기대감 확대',
    imageUrl:
      'https://images.unsplash.com/photo-1611681283307-eecb46571bc8?q=80&w=600&auto=format&fit=crop',
    importanceBadge: 'HOT',
    source: '네이버뉴스',
    points: [
      'HBM3E 12단 제품 양산 라인 가동 시작',
      '증권가 목표주가 잇단 상향 조정',
      '외국인 5 거래일 연속 순매수 지속',
    ],
    terms: [
      { termId: '1', surface: '목표주가', displayOrder: 1 },
      { termId: '2', surface: '순매수', displayOrder: 2 },
    ],
    relatedStocks: [
      { name: '삼성전자', changeRate: 6.3 },
      { name: '삼성전자', changeRate: -6.3 },
    ],
  },
  {
    cardId: '2',
    publishedDate: '1시간전',
    headline: '테스트 뉴스 헤드라인 2번째 카드',
    imageUrl:
      'https://images.unsplash.com/photo-1611681283307-eecb46571bc8?q=80&w=600&auto=format&fit=crop',
    importanceBadge: 'MID',
    source: '다음뉴스',
    points: ['테스트 포인트 1', '테스트 포인트 2'],
  },
]
