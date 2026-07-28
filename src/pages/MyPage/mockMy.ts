import type { ApTransactionResponse } from '@/types/api/ap'
import type { BadgeDetailApiResponse, BadgeListApiResponse } from '@/types/api/badge'
import type { MyLearnedTermsApiResponse } from '@/types/api/terms'
import type { MyUserApiResponse } from '@/types/api/user'

const OK = { success: true as const, code: 'COMMON_200', message: '요청에 성공했습니다.' }

export const MOCK_MY_USER_RESPONSE: MyUserApiResponse = {
  ...OK,
  result: {
    nickname: 'brifo',
    companyName: '내 투자회사',
    balanceAp: 1250,
    thisWeekEarnedAp: 450,
    decisionAccuracyRate: 63,
    totalDecision: 48,
    consecutiveDays: 5,
    learnedTermCount: 2,
  },
}

export const MOCK_AP_TRANSACTIONS_RESPONSE: ApTransactionResponse = {
  ...OK,
  result: {
    summary: { balanceAp: 1250, monthlyEarnedAp: 620, monthlyLostAp: 140 },
    page: {
      items: [
        {
          apTransactionId: '1bcbac27-b08b-452e-a88a-3b7a41c1fe54',
          reason: 'DECISION_WIN',
          amount: 80,
          createdAt: '2026-07-03T15:30:00',
        },
        {
          apTransactionId: '7fdfc1be-b994-4f12-9a49-bac9f1b27f10',
          reason: 'ATTENDANCE',
          amount: 50,
          createdAt: '2026-07-02T15:30:00',
        },
        {
          apTransactionId: '3b57e2d9-8c14-4a6f-b2d0-77e9a1c3f408',
          reason: 'DECISION_LOSE',
          amount: -40,
          createdAt: '2026-07-01T15:30:00',
        },
      ],
      nextCursor: null,
      hasNext: false,
    },
  },
}

export const MOCK_BADGE_LIST_RESPONSE: BadgeListApiResponse = {
  ...OK,
  result: {
    items: [
      {
        badgeId: '1bcbac27-b08b-452e-a88a-3b7a41c1fe54',
        code: 'FIRST_ATTENDANCE',
        name: '첫 출근',
        isOwned: true,
      },
      {
        badgeId: '2f57f76f-0804-4f1f-9c1d-8366f477cf53',
        code: 'FIRST_DECISION',
        name: '첫 예측',
        isOwned: false,
      },
    ],
  },
}

export const MOCK_BADGE_DETAILS: Record<string, BadgeDetailApiResponse> = {
  '1bcbac27-b08b-452e-a88a-3b7a41c1fe54': {
    ...OK,
    result: {
      badgeId: '1bcbac27-b08b-452e-a88a-3b7a41c1fe54',
      code: 'FIRST_ATTENDANCE',
      name: '첫 출근',
      description: '처음으로 출근했어요!',
      rewardAp: 50,
    },
  },
}

export const MOCK_MY_TERMS_RESPONSE: MyLearnedTermsApiResponse = {
  ...OK,
  result: {
    learnedTermCount: 2,
    page: {
      items: [
        {
          termId: '62ef76f1-8d61-49f4-8d1d-75b123c68e1a',
          term: '순매수',
          definition:
            '산 금액이 판 금액보다 많은 상태예요. 외국인·기관의 순매수는 매수세가 우세하다는 뜻으로 읽혀요.',
          category: '수급',
          learnedAt: '2026-07-11T14:30:00',
        },
        {
          termId: '0bb8e8ef-2d70-4321-8b19-34ef11b0a5cf',
          term: 'PER',
          definition:
            '주가를 주당순이익으로 나눈 값이에요. 기업 이익 대비 주가가 어느 정도인지 볼 때 사용해요.',
          category: '지표',
          learnedAt: '2026-07-10T11:00:00',
        },
      ],
      nextCursor: null,
      hasNext: false,
    },
  },
}
