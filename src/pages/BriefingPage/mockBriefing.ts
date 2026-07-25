import type {
  BriefingDetailResponse,
  BriefingListByCardResponse,
  OfficeBriefingListResponse,
  PostBriefingResponse,
} from '@/types/api/briefing'

export const MOCK_BRIEFING_DETAIL: BriefingDetailResponse = {
  success: true,
  code: 'COMMON_200',
  message: 'OK',
  result: {
    stock: {
      stockId: '0d6d4f4a-7d5d-4e4d-bf71-4b59d18c1a01',
      name: '삼성전자',
      price: 72420,
      changeRate: 2.0,
      tradeDate: '2026-07-03',
    },
    agent: {
      agentId: '0f2b7e7c-7d8a-4f4f-9b8e-0d1f3a2b9c11',
      agentType: 'ROOKIE',
      nickname: '루키',
      modelName: 'gpt-4o-mini',
    },
    newsCard: {
      cardId: '7bcd9b8a-2ed7-43a5-b4b4-1829aa4b5fd1',
      headline: '삼성전자, 반도체 실적 개선 기대',
    },
    briefing: {
      briefingId: '51f6a481-3a4f-4f74-b5b7-2f7f6a0d8c31',
      direction: 'UP',
      confidenceRate: 72,
      contentText: '사장님 진짜 갑니다! HBM 수주 소식에 외국인까지 붙었어요. 지금이 기회예요!',
      oneLiner: '지금 이 흐름, 놓치기 아까워요 사장님!',
    },
  },
}

export const MOCK_BRIEFING_DETAIL_PRO: BriefingDetailResponse = {
  success: true,
  code: 'COMMON_200',
  message: 'OK',
  result: {
    stock: MOCK_BRIEFING_DETAIL.result.stock,
    agent: {
      agentId: '2d9c6a71-3c5c-46e7-b8a2-54f5c1f7d912',
      agentType: 'PRO',
      nickname: '프로',
      modelName: 'claude-3-5-sonnet',
    },
    newsCard: MOCK_BRIEFING_DETAIL.result.newsCard,
    briefing: {
      briefingId: '8c3a9f61-9db5-4c0b-90ec-91d3b2a54f81',
      direction: 'UP',
      confidenceRate: 85,
      contentText:
        '확률적으로 상승 우위입니다. 외국인 5일 연속 순매수 추이가 지속되며 단기 모멘텀이 유효합니다. 목표가 8만원 선까지 분할 매수를 추천합니다.',
      oneLiner: '외국인 순매수 추이 긍정적. 단기 모멘텀 유효.',
    },
  },
}

export const MOCK_BRIEFING_DETAIL_TANKER: BriefingDetailResponse = {
  success: true,
  code: 'COMMON_200',
  message: 'OK',
  result: {
    stock: MOCK_BRIEFING_DETAIL.result.stock,
    agent: {
      agentId: '7a1e6d33-890e-4f73-a18c-9d11c8e7f444',
      agentType: 'TANKER',
      nickname: '탱커',
      modelName: 'gpt-4o',
    },
    newsCard: MOCK_BRIEFING_DETAIL.result.newsCard,
    briefing: {
      briefingId: '2e3f5d77-c6b3-4d13-8f88-637c8c623c44',
      direction: 'NEUTRAL',
      confidenceRate: 40,
      contentText:
        '조심스럽지만 단기 과열이 우려됩니다. 현재가 부근에서 저항 매물이 출회될 가능성이 높으니, 당장 무리한 진입보다는 관망 후 눌림목에서 분할 접근을 권장드립니다.',
      oneLiner: '단기 과열 우려. 추격 매수 자제 및 관망 권장.',
    },
  },
}

export const MOCK_BRIEFING_DETAILS: Record<string, BriefingDetailResponse> = {
  '51f6a481-3a4f-4f74-b5b7-2f7f6a0d8c31': MOCK_BRIEFING_DETAIL,
  '8c3a9f61-9db5-4c0b-90ec-91d3b2a54f81': MOCK_BRIEFING_DETAIL_PRO,
  '2e3f5d77-c6b3-4d13-8f88-637c8c623c44': MOCK_BRIEFING_DETAIL_TANKER,
}

export const MOCK_BRIEFING_LIST_BY_CARD: BriefingListByCardResponse = {
  success: true,
  code: 'COMMON_200',
  message: 'OK',
  result: {
    stock: {
      stockId: '0d6d4f4a-7d5d-4e4d-bf71-4b59d18c1a01',
      name: '삼성전자',
      price: 72420,
      changeRate: 2.0,
      tradeDate: '2026-07-03',
    },
    items: [
      {
        briefingId: '51f6a481-3a4f-4f74-b5b7-2f7f6a0d8c31',
        oneLiner: '사장님 진짜 갑니다! HBM 수주 소식에 외국인까지 붙었어요. 지금이 기회예요!',
        direction: 'UP',
        agentId: '0f2b7e7c-7d8a-4f4f-9b8e-0d1f3a2b9c11',
        nickname: '루키',
        agentType: 'ROOKIE',
      },
      {
        briefingId: '8c3a9f61-9db5-4c0b-90ec-91d3b2a54f81',
        oneLiner: '확률적으로 상승 우위입니다. 외국인 5일 연속 순매수, 단기 모멘텀 유효합니다.',
        direction: 'UP',
        agentId: '2d9c6a71-3c5c-46e7-b8a2-54f5c1f7d912',
        nickname: '프로',
        agentType: 'PRO',
      },
      {
        briefingId: '2e3f5d77-c6b3-4d13-8f88-637c8c623c44',
        oneLiner: '조심스럽지만 단기 과열이 우려됩니다. 분할 접근을 권장드립니다.',
        direction: 'NEUTRAL',
        agentId: '7a1e6d33-890e-4f73-a18c-9d11c8e7f444',
        nickname: '탱커',
        agentType: 'TANKER',
      },
    ],
  },
}

export const MOCK_OFFICE_BRIEFING_LIST: OfficeBriefingListResponse = {
  success: true,
  code: 'COMMON_200',
  message: 'OK',
  result: {
    items: [
      {
        stockName: '삼성전자',
        agents: [
          {
            briefingId: '1-1',
            agentId: 'a-1',
            nickname: '루키',
            agentType: 'ROOKIE',
            status: 'COMPLETED',
          },
          {
            briefingId: '1-2',
            agentId: 'a-2',
            nickname: '프로',
            agentType: 'PRO',
            status: 'COMPLETED',
          },
          {
            briefingId: '1-3',
            agentId: 'a-3',
            nickname: '탱커',
            agentType: 'TANKER',
            status: 'COMPLETED',
          },
        ],
      },
      {
        stockName: 'SK하이닉스',
        agents: [
          {
            briefingId: '2-1',
            agentId: 'a-1',
            nickname: '루키',
            agentType: 'ROOKIE',
            status: 'COMPLETED',
          },
          {
            briefingId: '2-2',
            agentId: 'a-2',
            nickname: '프로',
            agentType: 'PRO',
            status: 'COMPLETED',
          },
          {
            briefingId: '2-3',
            agentId: 'a-3',
            nickname: '탱커',
            agentType: 'TANKER',
            status: 'ANALYZING',
          },
        ],
      },
      {
        stockName: '현대차',
        agents: [
          {
            briefingId: '3-1',
            agentId: 'a-1',
            nickname: '루키',
            agentType: 'ROOKIE',
            status: 'COMPLETED',
          },
          {
            briefingId: '3-2',
            agentId: 'a-2',
            nickname: '프로',
            agentType: 'PRO',
            status: 'ANALYZING',
          },
          {
            briefingId: '3-3',
            agentId: 'a-3',
            nickname: '탱커',
            agentType: 'TANKER',
            status: 'ANALYZING',
          },
        ],
      },
    ],
  },
}

export const MOCK_POST_BRIEFING_RESPONSE: PostBriefingResponse = {
  success: true,
  code: 'COMMON_200',
  message: 'OK',
  result: {
    requestedCount: 2,
    totalSalaryCost: 60,
    requestedAgents: [
      {
        briefingId: '51f6a481-3a4f-4f74-b5b7-2f7f6a0d8c31',
        agentId: '0f2b7e7c-7d8a-4f4f-9b8e-0d1f3a2b9c11',
        agentType: 'ROOKIE',
        salaryCost: 10,
      },
      {
        briefingId: '8c3a9f61-9db5-4c0b-90ec-91d3b2a54f81',
        agentId: '2d9c6a71-3c5c-46e7-b8a2-54f5c1f7d912',
        agentType: 'PRO',
        salaryCost: 50,
      },
    ],
  },
}
