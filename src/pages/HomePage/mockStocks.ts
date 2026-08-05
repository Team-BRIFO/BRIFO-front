import type { AnalyzeResultType } from '@/components/feature/analyze/AnalyzeCard'

export const MOCK_STOCK = {
  stockId: '1',
  name: '브리포테크',
  code: 'BRIFO01',
  marketType: 'KOSPI',
  price: 31850,
  changeRate: 17.96,
  tradeDate: '2026-08-22',
  keywords: ['차세대 공정 모듈', '대형 공급계약', '연구개발'],
}

export const RESULT_TYPES: AnalyzeResultType[] = [
  'HASHTAG',
  'ERROR',
  'SUCCESS_UP',
  'SUCCESS_DOWN',
  'SUCCESS_HOLD',
  'FAIL_UP',
  'FAIL_DOWN',
  'FAIL_HOLD',
  'BRIEFING',
]
