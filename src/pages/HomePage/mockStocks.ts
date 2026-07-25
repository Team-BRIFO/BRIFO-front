import type { AnalyzeResultType } from '@/components/feature/analyze/AnalyzeCard'

export const MOCK_STOCK = {
  stockId: '1',
  name: '삼성전자',
  code: '005930',
  marketType: 'KOSPI',
  price: 79200,
  changeRate: 1.2,
  tradeDate: '2026-07-03',
  keywords: ['HBM3E', '공급계약', '외국인 순매수'],
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
