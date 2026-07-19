import type { AgentDetailResponse, AgentListResult } from '@/types/api/agent'
import type { ApiResponse } from '@/types/api/common'

// TODO: 실제 API 연동 시 제거 — 서버 응답 shape 그대로 흉내낸 mock

/** 사원 목록 조회 응답 mock */
export const MOCK_AGENT_LIST_RESPONSE: ApiResponse<AgentListResult> = {
  success: true,
  code: 'COMMON_200',
  message: '요청에 성공했습니다.',
  result: {
    items: [
      {
        agentId: '0f2b7e7c-7d8a-4f4f-9b8e-0d1f3a2b9c11',
        nickname: '루키',
        agentType: 'ROOKIE',
        modelName: 'gpt-4.1-mini',
        level: 1,
        exp: 120,
        dailySalary: 10,
        accuracyRate: 64,
      },
      {
        agentId: '2d9c6a71-3c5c-46e7-b8a2-54f5c1f7d912',
        nickname: '프로',
        agentType: 'PRO',
        modelName: 'gpt-4.1',
        level: 3,
        exp: 450,
        dailySalary: 50,
        accuracyRate: 69,
      },
      {
        agentId: '7a1e6d33-890e-4f73-a18c-9d11c8e7f444',
        nickname: '탱커',
        agentType: 'TANKER',
        modelName: 'gpt-4.1-mini',
        level: 2,
        exp: 230,
        dailySalary: 30,
        accuracyRate: 58,
      },
    ],
  },
}

/** 사원 상세 조회 응답 mock (route param: rookie/pro/tanker 로 조회) */
export const MOCK_AGENT_DETAIL_RESPONSES: Record<string, ApiResponse<AgentDetailResponse>> = {
  rookie: {
    success: true,
    code: 'COMMON_200',
    message: '요청에 성공했습니다.',
    result: {
      agentId: '0f2b7e7c-7d8a-4f4f-9b8e-0d1f3a2b9c11',
      nickname: '루키',
      agentType: 'ROOKIE',
      level: 1,
      exp: 120,
      modelName: 'gpt-4.1-mini',
      description: '초긍정·열정의 신입 분석가',
      accuracyRate: 64,
      totalAnalyses: 42,
      contributedAp: 560,
      consecutiveWorkDays: 8,
      dailySalary: 10,
    },
  },
  pro: {
    success: true,
    code: 'COMMON_200',
    message: '요청에 성공했습니다.',
    result: {
      agentId: '2d9c6a71-3c5c-46e7-b8a2-54f5c1f7d912',
      nickname: '프로',
      agentType: 'PRO',
      level: 3,
      exp: 450,
      modelName: 'gpt-4.1',
      description: '냉철·신중의 베테랑 분석가',
      accuracyRate: 69,
      totalAnalyses: 204,
      contributedAp: 2380,
      consecutiveWorkDays: 21,
      dailySalary: 50,
    },
  },
  tanker: {
    success: true,
    code: 'COMMON_200',
    message: '요청에 성공했습니다.',
    result: {
      agentId: '7a1e6d33-890e-4f73-a18c-9d11c8e7f444',
      nickname: '탱커',
      agentType: 'TANKER',
      level: 2,
      exp: 230,
      modelName: 'gpt-4.1-mini',
      description: '안정·방어의 균형형 분석가',
      accuracyRate: 58,
      totalAnalyses: 176,
      contributedAp: 1760,
      consecutiveWorkDays: 15,
      dailySalary: 30,
    },
  },
}
