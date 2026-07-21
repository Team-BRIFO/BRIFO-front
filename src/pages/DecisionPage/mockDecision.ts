import type { GetDecisionResponse, PostDecisionResponse } from '@/types/api/decision'

// POST /api/briefings/{briefingId}/decisions 모의 응답
export const MOCK_POST_DECISION_RESPONSE: Record<string, PostDecisionResponse> = {
  // 어떤 briefingId든 기본적으로 성공 응답
  default: {
    success: true,
    code: 'COMMON_200',
    message: 'OK',
    result: {
      decisionId: '8d0e6428-c909-4401-9049-72843fb90c3d',
      direction: 'UP',
      confidenceLevel: 4,
      stock: {
        stockId: '0d6d4f4a-7d5d-4e4d-bf71-4b59d18c1a01',
        name: '삼성전자',
      },
    },
  },
}

// GET /api/decisions/{decisionId} 모의 응답
export const MOCK_GET_DECISION_RESPONSES: Record<string, GetDecisionResponse> = {
  // 1. 정산 전 (결과 대기 중)
  'pending-decision': {
    success: true,
    code: 'COMMON_200',
    message: 'OK',
    result: {
      isCorrect: null,
      apDelta: null,
      direction: 'UP',
      confidenceLevel: 4,
      stock: {
        name: '삼성전자',
        price: null,
        changeRate: null,
        tradeDate: null,
      },
    },
  },
  // 2. 예측 적중
  'success-decision': {
    success: true,
    code: 'COMMON_200',
    message: 'OK',
    result: {
      isCorrect: true,
      apDelta: 80,
      direction: 'UP',
      confidenceLevel: 4,
      stock: {
        name: '삼성전자',
        price: 72420,
        changeRate: 8.1,
        tradeDate: '2026-07-04',
      },
    },
  },
  // 3. 예측 실패
  'fail-decision': {
    success: true,
    code: 'COMMON_200',
    message: 'OK',
    result: {
      isCorrect: false,
      apDelta: -40,
      direction: 'DOWN',
      confidenceLevel: 4,
      stock: {
        name: '삼성전자',
        price: 72420,
        changeRate: 8.1,
        tradeDate: '2026-07-04',
      },
    },
  },
}
