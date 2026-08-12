import NewscardImg from '@/assets/images/newscardImg.svg'
import type { NewsCardData } from '@/types/domain/newsCard'

export const TUTORIAL_HOME_CARD_NEWS_MOCK = [
  {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    stock: {
      name: '브리포테크',
      code: 'BRIFO01',
      marketType: 'KOSPI',
      price: 31850,
      changeRate: 17.96,
    },
    newsCount: 7,
    headline: '브리포테크, 차세대 공정 모듈 연구개발 1단계 검증 착수',
    isCompleted: false,
  },
  {
    id: 2,
    stock: {
      name: '브리포시스템',
      code: 'BRIFO02',
      marketType: 'KOSPI',
      price: 25000,
      changeRate: 0.0,
    },
    newsCount: 5,
    headline: '브리포시스템, 신규 제품군 시제품 조립 절차 돌입',
    isCompleted: false,
  },
]

export const TUTORIAL_NEWS_CARD_MOCK: NewsCardData = {
  cardId: 'brifo01-0810',
  publishedDate: '8월 10일',
  headline: '브리포테크, 차세대 공정 모듈 연구개발 1단계 검증 착수',
  imageUrl: NewscardImg,
  importanceBadge: 'MID',
  source: '브리포뉴스',
  points: [
    '브리포테크가 내부 개발 중인 차세대 공정 모듈 1단계 성능 검증 착수',
    '반복 작동 안정성 및 처리 효율 점검 후 하반기 통합 시험 전환 계획',
    '현재 주요 시험 항목은 계획 범위 내 진행 중',
  ],
  relatedStocks: [{ name: '브리포테크' }],
}
