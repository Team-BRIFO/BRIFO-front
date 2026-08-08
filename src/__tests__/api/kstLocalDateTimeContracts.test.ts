import { describe, expect, it } from 'vitest'

import { UserHomeResponseSchema } from '@/api/contracts/home'
import { KstLocalDateTimeSchema } from '@/api/contracts/localDateTime'
import { PolicyDetailResponseSchema } from '@/api/contracts/policy'
import { MyTermsResponseSchema } from '@/api/contracts/terms'
import { Day, DiaryItem } from '@/api/generated/schemas/diary-controller'
import { formatPolicyEffectiveDate } from '@/pages/AgreementPage/policyMapping'
import { formatBatchTime } from '@/utils/formatBatchTime'

const uuid = '1bcbac27-b08b-452e-a88a-3b7a41c1fe54'

describe('KST LocalDateTime response contracts', () => {
  it('accepts offset-less AP createdAt and preserves the original response string', () => {
    const createdAt = '2026-08-03T13:57:42.446611'

    expect(KstLocalDateTimeSchema.parse(createdAt)).toBe(createdAt)
  })

  it('accepts offset-less glossary learnedAt', () => {
    const learnedAt = '2026-08-03T13:57:42'

    const parsed = MyTermsResponseSchema.parse({
      success: true,
      code: 'COMMON_200',
      message: '성공',
      result: {
        learnedTermCount: 1,
        page: {
          items: [
            {
              termId: uuid,
              term: 'PER',
              definition: '주가수익비율',
              category: '지표',
              learnedAt,
            },
          ],
          hasNext: false,
        },
      },
    })

    expect(parsed.result?.page.items[0]?.learnedAt).toBe(learnedAt)
  })

  it('accepts offset-less policy createdAt and displays its original KST calendar date', () => {
    const createdAt = '2026-08-03T00:05:00'

    const parsed = PolicyDetailResponseSchema.parse({
      success: true,
      code: 'COMMON_200',
      message: '성공',
      result: {
        policyId: uuid,
        title: '서비스 이용약관',
        content: '내용',
        createdAt,
        version: 1,
      },
    })

    expect(parsed.result?.createdAt).toBe(createdAt)
    expect(formatPolicyEffectiveDate(createdAt)).toBe('2026. 8. 3.')
    expect(formatBatchTime(createdAt)).toEqual({ date: '8/3', time: '00:05' })
  })

  it('applies the same strict contract to consumed home batch and news timestamps', () => {
    const batchTime = '2026-08-03T13:57:42'
    const publishedAt = '2026-08-03T10:00:00.1'

    const parsed = UserHomeResponseSchema.parse({
      success: true,
      code: 'COMMON_200',
      message: '성공',
      result: {
        user: { nickname: '브리포', companyName: '브리포 투자사', balanceAp: 0 },
        agents: [],
        attendedToday: false,
        weeklyAttendanceDays: 0,
        dates: ['2026-08-03'],
        todayDecisions: { count: 0 },
        todayNewsCards: {
          batchTime,
          items: [
            {
              cardId: uuid,
              headline: '헤드라인',
              news: { newsId: uuid, publishedAt, source: 'NAVER' },
              stock: { stockId: uuid, name: '브리포', changeRate: 0 },
            },
          ],
        },
      },
    })

    expect(parsed.result?.todayNewsCards.batchTime).toBe(batchTime)
    expect(parsed.result?.todayNewsCards.items[0]?.news.publishedAt).toBe(publishedAt)
  })

  it.each([
    '2026-08-03T13:57:42Z',
    '2026-08-03T13:57:42+09:00',
    '2026-08-03T13:57',
    '2026-02-30T13:57:42',
  ])('rejects %s as a contract error: seconds are required and offsets are forbidden', (value) => {
    expect(KstLocalDateTimeSchema.safeParse(value).success).toBe(false)
  })

  it('keeps diary YYYY-MM-DD date-only fields unchanged', () => {
    const outcome = { decisionWin: false, decisionLoss: false, neutralHit: false }

    expect(Day.safeParse({ date: '2026-08-03', outcome }).success).toBe(true)
    expect(Day.safeParse({ date: '2026-08-03T13:57:42', outcome }).success).toBe(false)
    expect(
      DiaryItem.safeParse({
        diaryId: uuid,
        stock: {
          stockId: uuid,
          name: '브리포',
          price: 10_000,
          changeRate: 0,
          tradeDate: '2026-08-03',
        },
        decision: { direction: 'UP', apDelta: 80, isCorrect: true },
      }).success,
    ).toBe(true)
  })
})
