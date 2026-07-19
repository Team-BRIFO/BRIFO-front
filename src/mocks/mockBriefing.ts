import type {
  BriefingDetailResponse,
  BriefingListByCardResponse,
  OfficeBriefingListResponse,
  PostBriefingResponse,
} from '@/types/api/briefing'

export const MOCK_BRIEFING_DETAIL: BriefingDetailResponse = {
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
}

export const MOCK_BRIEFING_LIST_BY_CARD: BriefingListByCardResponse = {
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
}

export const MOCK_OFFICE_BRIEFING_LIST: OfficeBriefingListResponse = {
  items: [
    {
      stockName: '삼성전자',
      agents: [
        {
          briefingId: '51f6a481-3a4f-4f74-b5b7-2f7f6a0d8c31',
          agentId: '0f2b7e7c-7d8a-4f4f-9b8e-0d1f3a2b9c11',
          nickname: '루키',
          agentType: 'ROOKIE',
          status: 'COMPLETED',
        },
      ],
    },
  ],
}

export const MOCK_POST_BRIEFING_RESPONSE: PostBriefingResponse = {
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
}
