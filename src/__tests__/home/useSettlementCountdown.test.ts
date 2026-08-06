import { describe, expect, it } from 'vitest'

import { getSettlementRemainingTime } from '@/pages/HomePage/hooks/useSettlementCountdown'

describe('getSettlementRemainingTime', () => {
  it('오후 3시 30분 전에는 당일 정산까지 남은 시간을 반환한다', () => {
    const kstThreeTwenty = Date.UTC(2026, 7, 6, 6, 20)

    expect(getSettlementRemainingTime(kstThreeTwenty)).toBe('00:10:00')
  })

  it('정산 시각에는 0을 반환한다', () => {
    const kstThreeThirty = Date.UTC(2026, 7, 6, 6, 30)

    expect(getSettlementRemainingTime(kstThreeThirty)).toBe('00:00:00')
  })

  it('오후 3시 30분이 지나면 다음 날 정산까지 남은 시간을 반환한다', () => {
    const kstThreeThirtyOne = Date.UTC(2026, 7, 6, 6, 31)

    expect(getSettlementRemainingTime(kstThreeThirtyOne)).toBe('23:59:00')
  })
})
