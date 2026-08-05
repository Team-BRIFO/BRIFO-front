import { describe, expect, it } from 'vitest'

import type { GetApTransactionsResponse } from '@/api/generated/schemas/ap-controller'
import type { BadgeItem, GetOwnedBadgeResponse } from '@/api/generated/schemas/badge-controller'
import type { GetMyTermsResponse } from '@/api/generated/schemas/term-controller'
import type { GetMyPageResponse } from '@/api/generated/schemas/user-controller'
import {
  mapApTransactionPage,
  mapBadge,
  mapBadgeDetail,
  mapMyGlossaryPage,
  mapMyUser,
} from '@/mappers/myMapper'

describe('My mappers', () => {
  it('maps getMyPage stocks and keeps missing profile contract fields as UI fallbacks', () => {
    const response = {
      nickname: '브리포',
      companyName: '브리포 투자사',
      balanceAp: 1_250,
      thisWeekEarnedAp: 450,
      decisionAccuracyRate: 63,
      totalDecision: 48,
      consecutiveDays: 5,
      learnedTermCount: 2,
      stocks: [
        {
          stockId: '51f6a481-3a4f-4f74-b5b7-2f7f6a0d8c31',
          name: '삼성전자',
        },
      ],
    } satisfies GetMyPageResponse

    expect(mapMyUser(response)).toMatchObject({
      profile: {
        nickname: '브리포',
        companyName: '브리포 투자사',
        jobTitle: '사장',
        characterType: 'rookie',
      },
      profileFormValues: {
        interestStocks: [
          {
            id: '51f6a481-3a4f-4f74-b5b7-2f7f6a0d8c31',
            name: '삼성전자',
          },
        ],
      },
    })
  })

  it('maps AP transactions and normalizes an omitted next cursor to null', () => {
    const response = {
      summary: { balanceAp: 1_250, monthlyEarnedAp: 620, monthlyLostAp: 140 },
      page: {
        items: [
          {
            apTransactionId: '1bcbac27-b08b-452e-a88a-3b7a41c1fe54',
            reason: 'DECISION_WIN',
            amount: 80,
            createdAt: '2026-07-03T15:30:00+09:00',
          },
        ],
        hasNext: true,
      },
    } satisfies GetApTransactionsResponse

    expect(mapApTransactionPage(response)).toMatchObject({
      items: [{ reason: 'DECISION_WIN', label: '결정 적중', amount: 80 }],
      nextCursor: null,
      hasNext: true,
    })
  })

  it('maps learned terms and normalizes an omitted next cursor to null', () => {
    const response = {
      learnedTermCount: 1,
      page: {
        items: [
          {
            termId: '62ef76f1-8d61-49f4-8d1d-75b123c68e1a',
            term: '순매수',
            definition: '산 금액이 판 금액보다 많은 상태예요.',
            category: '수급',
            learnedAt: '2026-07-11T14:30:00+09:00',
          },
        ],
        hasNext: true,
      },
    } satisfies GetMyTermsResponse

    expect(mapMyGlossaryPage(response)).toMatchObject({
      learnedTermCount: 1,
      entries: [{ term: '순매수', category: '수급' }],
      nextCursor: null,
      hasNext: true,
    })
  })

  it('maps badge list and detail responses', () => {
    const item = {
      badgeId: '1bcbac27-b08b-452e-a88a-3b7a41c1fe54',
      code: 'FIRST_ATTENDANCE',
      name: '첫 출근',
      isOwned: true,
    } satisfies BadgeItem
    const detail = {
      badgeId: item.badgeId,
      code: item.code,
      name: item.name,
      rewardAp: 50,
    } satisfies GetOwnedBadgeResponse

    expect(mapBadge(item)).toEqual({
      id: item.badgeId,
      name: '첫 출근',
      description: '',
      iconKey: 'FIRST_ATTENDANCE',
      isUnlocked: true,
      unlockedAt: null,
    })
    expect(mapBadgeDetail(detail)).toEqual({
      badge: {
        id: item.badgeId,
        name: '첫 출근',
        description: '',
        iconKey: 'FIRST_ATTENDANCE',
        isUnlocked: true,
        unlockedAt: null,
      },
      rewardAp: 50,
    })
  })
})
