import { describe, expect, it } from 'vitest'

import {
  mapDiaryCalendar,
  mapDiaryDetail,
  mapDiaryEntryPage,
  mapDiaryStatistics,
} from '@/mappers/diaryMapper'

describe('diaryMapper', () => {
  it('maps calendar outcome flags in the API-defined display order', () => {
    const calendar = mapDiaryCalendar({
      year: 2026,
      month: 8,
      settledDecisionCount: 3,
      correctDecisionCount: 2,
      accuracyRate: 67,
      days: [
        {
          date: '2026-08-03',
          outcome: { decisionWin: true, decisionLoss: true, neutralHit: true },
        },
      ],
    })

    expect(calendar.marks).toEqual([{ date: '2026-08-03', outcomes: ['win', 'loss', 'neutral'] }])
    expect(calendar.hitRate).toEqual({ rate: 67, totalCount: 3, periodLabel: '2026.08' })
  })

  it('maps list display fields from the nested stock DTO and normalizes an absent cursor', () => {
    const page = mapDiaryEntryPage({
      page: {
        items: [
          {
            diaryId: '8fd2c732-b4f1-4b66-b53a-95b5f11df391',
            stock: {
              stockId: '0d6d4f4a-7d5d-4e4d-bf71-4b59d18c1a01',
              name: '삼성전자',
              price: 73000,
              changeRate: 1.2,
              tradeDate: '2026-08-02',
              logoUrl: 'https://example.com/logo.png',
            },
            decision: { direction: 'UP', apDelta: 80, isCorrect: true },
          },
        ],
        hasNext: false,
      },
    })

    expect(page.nextCursor).toBeNull()
    expect(page.entries[0]).toMatchObject({
      price: 73000,
      changeRate: 1.2,
      date: '2026-08-02',
      logoUrl: 'https://example.com/logo.png',
    })
  })

  it('normalizes an absent detail share image URL for the UI', () => {
    const detail = mapDiaryDetail({
      diaryId: '8fd2c732-b4f1-4b66-b53a-95b5f11df391',
      stock: {
        stockId: '0d6d4f4a-7d5d-4e4d-bf71-4b59d18c1a01',
        name: '삼성전자',
        changeRate: 1.2,
      },
      agent: {
        agentId: '0f2b7e7c-7d8a-4f4f-9b8e-0d1f3a2b9c11',
        agentType: 'ROOKIE',
        nickname: '루키',
      },
      briefing: {
        briefingId: '5f64e4df-83e5-4050-94f9-a42e0f7f9f1a',
        direction: 'UP',
        confidenceRate: 72,
      },
      decision: { isCorrect: true, confidenceLevel: 4 },
    })

    expect(detail.shareImageUrl).toBeNull()
  })

  it('marks statistics empty only when there are no settled decisions at all', () => {
    const statistics = mapDiaryStatistics({
      summary: {
        recent30DaysSettledDecisionCount: 0,
        recent30DaysCorrectDecisionCount: 0,
        recent30DaysAccuracyRate: 0,
        settledDecisionCount: 1,
        correctDecisionCount: 1,
        averageConfidenceLevel: 4,
        bestCorrectStreak: 1,
      },
      directionStats: [],
      agentStats: [],
      confidenceLevelStats: [],
      stockStats: [],
    })

    expect(statistics.isEmpty).toBe(false)
  })

  it('marks statistics empty when there are no settled decisions', () => {
    const statistics = mapDiaryStatistics({
      summary: {
        recent30DaysSettledDecisionCount: 0,
        recent30DaysCorrectDecisionCount: 0,
        recent30DaysAccuracyRate: 0,
        settledDecisionCount: 0,
        correctDecisionCount: 0,
        averageConfidenceLevel: 0,
        bestCorrectStreak: 0,
      },
      directionStats: [],
      agentStats: [],
      confidenceLevelStats: [],
      stockStats: [],
    })

    expect(statistics.isEmpty).toBe(true)
  })
})
