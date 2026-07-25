import type {
  DecisionItemDTO,
  GetDecisionResponse,
  PostDecisionResponse,
} from '@/types/api/decision'

export const MOCK_DECISIONS: DecisionItemDTO[] = [
  {
    decisionId: '8d0e6428-c909-4401-9049-72843fb90c3d',
    direction: 'UP',
    confidenceLevel: 4,
    isSettled: false,
    stock: {
      stockId: '0d6d4f4a-7d5d-4e4d-bf71-4b59d18c1a01',
      name: 'SK 하이닉스',
      changeRate: 6.3,
      tradeDate: '2026-07-04',
    },
  },
  {
    decisionId: '8d0e6428-c909-4401-9049-72843fb90c3e',
    direction: 'UP',
    confidenceLevel: 4,
    isSettled: true,
    stock: {
      stockId: '0d6d4f4a-7d5d-4e4d-bf71-4b59d18c1a01',
      name: 'SK 하이닉스',
      changeRate: 6.3,
      tradeDate: '2026-07-04',
    },
  },
]

export const MOCK_POST_DECISION_RESPONSE: Record<'default', PostDecisionResponse> = {
  default: {
    success: true,
    code: '200',
    message: 'Success',
    result: {
      decisionId: '8d0e6428-c909-4401-9049-72843fb90c3d',
      direction: 'UP',
      confidenceLevel: 4,
      stock: {
        stockId: '0d6d4f4a-7d5d-4e4d-bf71-4b59d18c1a01',
        name: 'SK 하이닉스',
      },
    },
  },
}

export const MOCK_GET_DECISION_RESPONSES: Record<string, GetDecisionResponse> = {
  '8d0e6428-c909-4401-9049-72843fb90c3d': {
    success: true,
    code: '200',
    message: 'Success',
    result: {
      isCorrect: true,
      apDelta: 100,
      direction: 'UP',
      confidenceLevel: 4,
      stock: {
        name: 'SK 하이닉스',
        price: 2679000,
        changeRate: 6.3,
        tradeDate: '2026-07-04',
      },
    },
  },
  '8d0e6428-c909-4401-9049-72843fb90c3e': {
    success: true,
    code: '200',
    message: 'Success',
    result: {
      isCorrect: false,
      apDelta: -50,
      direction: 'UP',
      confidenceLevel: 4,
      stock: {
        name: 'SK 하이닉스',
        price: 2679000,
        changeRate: -2.3,
        tradeDate: '2026-07-04',
      },
    },
  },
}
